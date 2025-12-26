import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Shield, FileText, Activity, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Overview' },
        { to: '/policies', icon: Shield, label: 'Policies' },
        { to: '/audit', icon: FileText, label: 'Audit Logs' },
        { to: '/analytics', icon: Activity, label: 'Analytics' },
    ];

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col">
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    ZTSAP Admin
                </h1>
                <p className="text-xs text-slate-400 mt-1">Zero Trust Platform</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            clsx(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                                isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
                            )
                        }
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 text-red-400 hover:bg-red-900/20 w-full px-4 py-3 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
