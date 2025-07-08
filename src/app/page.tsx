'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import dynamic from 'next/dynamic';

// Type definitions
interface UserData {
  accuracy: number;
  company: string;
  employeeNo: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  userId: string;
}

interface CompanyData {
  company: string;
  value: number;
}

interface LoginTrendData {
  time: string;
  count: number;
}

// Mock data with proper typing
const mockDataList: UserData[] = [
  { accuracy: 20, company: '0999', employeeNo: '67217', latitude: 13.7091284, longitude: 100.8615894, timestamp: 'July 8, 2025 at 7:03:02 AM UTC+7', userId: '1250101530974' },
  { accuracy: 20, company: '0999', employeeNo: '67218', latitude: 13.7091284, longitude: 100.8615894, timestamp: 'July 8, 2025 at 7:04:15 AM UTC+7', userId: '1250101530975' },
  { accuracy: 20, company: '0999', employeeNo: '67219', latitude: 13.7091284, longitude: 100.8615894, timestamp: 'July 8, 2025 at 7:05:47 AM UTC+7', userId: '1250101530976' },
  { accuracy: 20, company: '1234', employeeNo: '80001', latitude: 13.7091284, longitude: 100.8615894, timestamp: 'July 8, 2025 at 7:06:10 AM UTC+7', userId: '1250101531974' },
  { accuracy: 20, company: '1234', employeeNo: '80002', latitude: 13.7091284, longitude: 100.8615894, timestamp: 'July 8, 2025 at 7:07:28 AM UTC+7', userId: '1250101531975' },
  { accuracy: 20, company: '1234', employeeNo: '80003', latitude: 13.7091284, longitude: 100.8615894, timestamp: 'July 8, 2025 at 7:08:40 AM UTC+7', userId: '1250101531976' },
  { accuracy: 20, company: '5678', employeeNo: '90001', latitude: 13.7091284, longitude: 100.8615894, timestamp: 'July 8, 2025 at 7:09:12 AM UTC+7', userId: '1250101532974' },
  { accuracy: 20, company: '5678', employeeNo: '90002', latitude: 13.7091284, longitude: 100.8615894, timestamp: 'July 8, 2025 at 7:10:55 AM UTC+7', userId: '1250101532975' },
  { accuracy: 20, company: '5678', employeeNo: '90003', latitude: 13.7091284, longitude: 100.8615894, timestamp: 'July 8, 2025 at 7:12:20 AM UTC+7', userId: '1250101532976' },
  { accuracy: 20, company: '5678', employeeNo: '90004', latitude: 13.7091284, longitude: 100.8615894, timestamp: 'July 8, 2025 at 7:13:45 AM UTC+7', userId: '1250101532977' }
] as const;

// Color palette with proper typing
const COLORS: readonly string[] = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'] as const;

// Utility functions
const formatTimeRange = (minutes: number): string => {
  const start = minutes.toString().padStart(2, '0');
  const end = Math.min(minutes + 4, 59).toString().padStart(2, '0');
  return `${start}–${end}`;
};

const parseTimestamp = (timestamp: string): Date => {
  return new Date(timestamp);
};

const DashboardPage: React.FC = () => {
  // Memoized data processing
  const userByCompany = useMemo((): CompanyData[] => {
    const companyCount = mockDataList.reduce((acc, user) => {
      acc[user.company] = (acc[user.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(companyCount)
      .map(([company, value]) => ({ company, value }))
      .sort((a, b) => b.value - a.value); // Sort by count descending
  }, []);

  const loginTimeTrend = useMemo((): LoginTrendData[] => {
    const timeGroups = mockDataList.reduce((acc, user) => {
      const date = parseTimestamp(user.timestamp);
      const minutes = date.getMinutes();
      const roundedMinutes = Math.floor(minutes / 5) * 5;
      const hour = date.getHours();
      const timeKey = `${hour}:${formatTimeRange(roundedMinutes)}`;
      
      acc[timeKey] = (acc[timeKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(timeGroups)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => a.time.localeCompare(b.time)); // Sort by time
  }, []);

  const recentLogins = useMemo((): UserData[] => {
    return [...mockDataList].sort((a, b) => 
      parseTimestamp(b.timestamp).getTime() - parseTimestamp(a.timestamp).getTime()
    );
  }, []);

  // Statistics
  const totalUsers = mockDataList.length;
  const uniqueCompanies = userByCompany.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 E-hong Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time employee login monitoring system
          </p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users Today</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Companies</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueCompanies}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average per Company</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(totalUsers / uniqueCompanies).toFixed(1)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Company Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Company Distribution</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={userByCompany} 
                    dataKey="value" 
                    nameKey="company" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100}
                    label={({ company, percent }) => 
                      `${company}: ${((percent ?? 0) * 100).toFixed(1)}%`
                    }
                  >
                    {userByCompany.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} คน`, 'จำนวนพนักงาน']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Company Breakdown</h3>
              {userByCompany.map((item, index) => (
                <div key={item.company} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">บริษัท {item.company}</span>
                  </div>
                  <span className="text-gray-600">{item.value} คน</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Login Time Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Login Time Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={loginTimeTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                allowDecimals={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} คน`, 'จำนวนการ Login']}
                labelFormatter={(label: string) => `เวลา: ${label} นาที`}
              />
              <Bar 
                dataKey="count" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]}
                name="จำนวนการ Login"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Logins Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Logins</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 font-medium text-gray-700">เวลา Login</th>
                  <th className="py-3 px-4 font-medium text-gray-700">รหัสพนักงาน</th>
                  <th className="py-3 px-4 font-medium text-gray-700">บริษัท</th>
                  <th className="py-3 px-4 font-medium text-gray-700">ความแม่นยำ</th>
                  <th className="py-3 px-4 font-medium text-gray-700">User ID</th>
                </tr>
              </thead>
              <tbody>
                {recentLogins.map((entry, index) => (
                  <tr 
                    key={`${entry.userId}-${index}`} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-900">
                      {parseTimestamp(entry.timestamp).toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{entry.employeeNo}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                        {entry.company}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{entry.accuracy}%</td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-xs">{entry.userId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;