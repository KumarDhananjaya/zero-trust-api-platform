import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Activity, Users, ShieldAlert, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className={`p-4 rounded-lg bg-opacity-10 ${color.bg}`}>
            <Icon className={`${color.text}`} size={24} />
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const DashboardPage = () => {
    const { token } = useAuth();

    // Placeholder stats
    const stats = [
        { title: 'Total Requests', value: '1,234', icon: Activity, color: { bg: 'bg-blue-500', text: 'text-blue-600' } },
        { title: 'Active Users', value: '56', icon: Users, color: { bg: 'bg-purple-500', text: 'text-purple-600' } },
        { title: 'Threats Blocked', value: '12', icon: ShieldAlert, color: { bg: 'bg-red-500', text: 'text-red-600' } },
        { title: 'System Health', value: '98%', icon: CheckCircle, color: { bg: 'bg-green-500', text: 'text-green-600' } },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-8">System Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((s) => <StatCard key={s.title} {...s} />)}
            </div>

            <div className="flex space-x-6">
                <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Live Traffic</h3>
                    <div className="h-64 bg-slate-50 rounded flex items-center justify-center text-slate-400">
                        [Chart Placeholder: Requests/sec]
                    </div>
                </div>
                <div className="w-96 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Alerts</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center space-x-3 text-sm p-3 bg-red-50 rounded border border-red-100">
                                <ShieldAlert size={16} className="text-red-500" />
                                <span className="text-red-700">Excessive rate limit from 10.0.0.{i + 20}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
