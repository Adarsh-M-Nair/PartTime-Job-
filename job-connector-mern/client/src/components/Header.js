import React from 'react';
import { Briefcase, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-2">
                        <Briefcase className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-2xl font-bold text-gray-900">WorkBee</h1>
                    </div>
                    {user && (
                        <div className="flex items-center space-x-4">
                            <span className="hidden sm:block font-medium">{user.name}</span>
                            <button onClick={logout} className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
