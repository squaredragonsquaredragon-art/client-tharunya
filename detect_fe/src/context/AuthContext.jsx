import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import {
  getToken, setToken, setRefreshToken, getRefreshToken,
  setUser, getUser, clearAuth, isTokenExpired
} from '../utils/tokenHelper';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const initialState = {
  user: getUser(),
  token: getToken(),
  isLoading: false,
  isAuthenticated: !!getToken() && !isTokenExpired(getToken()),
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Auto-logout on token expiry
  useEffect(() => {
    const token = getToken();
    if (token && isTokenExpired(token)) {
      dispatch({ type: 'LOGOUT' });
      clearAuth();
    }
  }, []);

  // Periodic token expiry check
  useEffect(() => {
    const interval = setInterval(() => {
      const token = getToken();
      if (token && isTokenExpired(token)) {
        dispatch({ type: 'LOGOUT' });
        clearAuth();
        toast.error('Session expired. Please log in again.');
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const SUPER_ADMIN_CREDS = {
    username: 'qwer1234',
    password: 'qwer1234asdf1234'
  };

  const getApprovalRegistry = () => {
    try {
      return JSON.parse(localStorage.getItem('theftguard_user_approvals') || '{}');
    } catch {
      return {};
    }
  };

  const setApprovalRegistry = (registry) => {
    try {
      localStorage.setItem('theftguard_user_approvals', JSON.stringify(registry));
    } catch (err) {
      console.error('Failed to save approval registry:', err);
    }
  };

  const isUserApproved = (identifier) => {
    if (!identifier) return false;
    const key = identifier.toLowerCase().trim();
    const registry = getApprovalRegistry();
    return registry[key] === true;
  };

  const registerUserForApproval = (username, email) => {
    const registry = getApprovalRegistry();
    if (username) registry[username.toLowerCase().trim()] = false;
    if (email) registry[email.toLowerCase().trim()] = false;
    setApprovalRegistry(registry);
  };

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    const uName = (credentials.username || '').trim();
    const uPass = (credentials.password || '').trim();

    // Check static Super Admin credentials
    if (
      uName === SUPER_ADMIN_CREDS.username &&
      uPass === SUPER_ADMIN_CREDS.password
    ) {
      const superAdminUser = {
        id: 'super-admin-1',
        username: 'qwer1234',
        email: 'admin@theftguard.ai',
        role: 'admin',
        is_superuser: true,
        is_active: true
      };
      const mockToken = 'super-admin-static-token-' + Date.now();
      setToken(mockToken);
      setRefreshToken(mockToken);
      setUser(superAdminUser);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: superAdminUser, token: mockToken },
      });
      toast.success('Welcome Super Admin!');
      return { success: true };
    }

    // Check Super Admin approval status for regular user
    const approvedLocally = isUserApproved(uName);

    try {
      const { data } = await authApi.login(credentials);
      
      const backendActive = data.user && data.user.is_active !== false;

      // If backend marks user as inactive and local approval is false -> block login
      if (!backendActive && !approvedLocally) {
        clearAuth();
        dispatch({ type: 'SET_LOADING', payload: false });
        const errorMsg = 'Super admin still not approved';
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      // If backend active or approved locally -> sync to local registry
      const reg = getApprovalRegistry();
      reg[uName.toLowerCase()] = true;
      if (data.user?.email) reg[data.user.email.toLowerCase()] = true;
      setApprovalRegistry(reg);

      setToken(data.access);
      setRefreshToken(data.refresh);
      setUser(data.user);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: data.user, token: data.access },
      });
      toast.success(`Welcome back, ${data.user?.username || 'User'}!`);
      return { success: true };
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
      
      const responseDetail = err.response?.data?.detail || '';
      const isPendingMsg = 
        responseDetail === 'Super admin still not approved' || 
        responseDetail.toLowerCase().includes('not approved');

      if (isPendingMsg) {
        clearAuth();
        const errorMsg = 'Super admin still not approved';
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      const msg = err.response?.data?.detail || err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Register user in local approval registry as pending approval (false)
      registerUserForApproval(userData.username, userData.email);

      // Call backend register API
      const { data } = await authApi.register({ ...userData, is_active: false }).catch(async () => {
        return await authApi.register(userData);
      });
      
      // Do NOT log user in — require Super Admin approval
      clearAuth();
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.success('Account created! Pending Super Admin approval.');
      return { success: true, pendingApproval: true, user: data?.user || userData };
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
      const msg = err.response?.data?.detail || 'Registration failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const refresh = getRefreshToken();
      if (refresh) await authApi.logout(refresh);
    } catch { /* ignore */ }
    clearAuth();
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((user) => {
    setUser(user);
    dispatch({ type: 'UPDATE_USER', payload: user });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
