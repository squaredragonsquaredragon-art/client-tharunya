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

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await authApi.login(credentials);
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
      const msg = err.response?.data?.detail || err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await authApi.register(userData);
      setToken(data.access);
      setRefreshToken(data.refresh);
      setUser(data.user);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: data.user, token: data.access },
      });
      toast.success('Account created successfully!');
      return { success: true };
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
