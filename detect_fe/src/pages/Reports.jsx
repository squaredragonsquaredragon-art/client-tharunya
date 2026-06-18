import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler, ArcElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { MdBarChart, MdTrendingUp, MdDateRange } from 'react-icons/md';
import { FiAlertTriangle } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, usePointStyle: true } },
    tooltip: { backgroundColor: '#0f1b2e', borderColor: 'rgba(56,100,180,0.3)', borderWidth: 1, titleColor: '#e2e8f0', bodyColor: '#94a3b8', padding: 12 }
  },
  scales: {
    x: { grid: { color: 'rgba(56,100,180,0.06)' }, ticks: { color: '#4a5568', font: { family: 'Inter', size: 11 } } },
    y: { grid: { color: 'rgba(56,100,180,0.06)' }, ticks: { color: '#4a5568', font: { family: 'Inter', size: 11 } } }
  }
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];

const loginTrendData = {
  labels: months,
  datasets: [
    {
      label: 'Total Logins',
      data: [420, 580, 610, 490, 720, 810, 695, 830, 760, 910, 874, 1020],
      borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)', fill: true, tension: 0.4,
    },
    {
      label: 'Suspicious Logins',
      data: [12, 18, 9, 24, 15, 28, 11, 35, 20, 42, 23, 19],
      borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', fill: true, tension: 0.4,
    }
  ]
};

const otpFrequency = {
  labels: weeks,
  datasets: [{
    label: 'OTP Requests',
    data: [8, 14, 6, 20, 11, 17, 9],
    backgroundColor: 'rgba(139,92,246,0.7)',
    borderColor: '#8b5cf6',
    borderWidth: 2,
    borderRadius: 6,
    borderSkipped: false,
  }]
};

const suspiciousData = {
  labels: months,
  datasets: [
    {
      label: 'Geo-Anomaly',
      data: [5, 8, 3, 11, 7, 14, 4, 16, 9, 20, 10, 8],
      backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 4,
    },
    {
      label: 'Brute Force',
      data: [3, 5, 2, 7, 4, 8, 3, 10, 6, 12, 7, 5],
      backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 4,
    },
    {
      label: 'Unknown Device',
      data: [4, 5, 4, 6, 4, 6, 4, 9, 5, 10, 6, 6],
      backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 4,
    },
  ]
};

const Reports = () => {
  const [period, setPeriod] = useState('monthly');

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--clr-accent-green)', width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdBarChart />
            </span>
            Reports & Analytics
          </h1>
          <p className="page-subtitle">Visualize login trends and security analysis</p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['daily', 'weekly', 'monthly'].map((p) => (
            <button
              key={p}
              id={`period-${p}-btn`}
              onClick={() => setPeriod(p)}
              className="btn btn-sm"
              style={{
                background: period === p ? 'var(--gradient-blue)' : 'rgba(255,255,255,0.06)',
                color: period === p ? 'white' : 'var(--clr-text-secondary)',
                border: period === p ? 'none' : '1px solid var(--clr-border)',
                textTransform: 'capitalize'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Avg. Daily Logins', value: '41.6', trend: '+8.2%', color: 'blue' },
          { label: 'Suspicious Rate', value: '1.9%', trend: '-0.3%', color: 'red' },
          { label: 'OTP Rate', value: '12.4%', trend: '+2.1%', color: 'purple' },
          { label: 'Detection Accuracy', value: '98.7%', trend: '+0.5%', color: 'green' },
        ].map((kpi) => (
          <div key={kpi.label} className={`glass-card stat-card ${kpi.color}`}>
            <div className="stat-value" style={{ fontSize: '1.7rem' }}>{kpi.value}</div>
            <div className="stat-label">{kpi.label}</div>
            <div className="stat-change up" style={{ marginTop: '8px' }}>
              <MdTrendingUp /> {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Login trend */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--clr-text-primary)' }}>
              Login Trends — Monthly Overview
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', marginTop: '4px' }}>
              Normal vs suspicious login activity over the past 12 months
            </p>
          </div>
          <div style={{ height: '280px', position: 'relative' }}>
            <Line data={loginTrendData} options={chartDefaults} />
          </div>
        </div>

        <div className="grid-cols-2">
          {/* Suspicious breakdown */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--clr-text-primary)' }}>
                Suspicious Activity Breakdown
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', marginTop: '4px' }}>
                Categorized anomaly types per month
              </p>
            </div>
            <div style={{ height: '260px', position: 'relative' }}>
              <Bar data={suspiciousData} options={{ ...chartDefaults, scales: { ...chartDefaults.scales, x: { ...chartDefaults.scales.x, stacked: true }, y: { ...chartDefaults.scales.y, stacked: true } } }} />
            </div>
          </div>

          {/* OTP frequency */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--clr-text-primary)' }}>
                OTP Request Frequency
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', marginTop: '4px' }}>
                Weekly OTP verification request counts
              </p>
            </div>
            <div style={{ height: '260px', position: 'relative' }}>
              <Bar data={otpFrequency} options={chartDefaults} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
