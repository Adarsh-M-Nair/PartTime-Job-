import React, { useState } from 'react';
import { User, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register } = useAuth();
    const [userType, setUserType] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result;
            if (isLogin) {
                result = await login(email, password);
            } else {
                result = await register(email, password, userType, name);
            }

            if (!result.success) {
                setError(result.error);
            }
        } catch (error) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 md:mt-20">
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
                <p className="text-center text-gray-500 mb-8">{isLogin ? 'Sign in to find your next job.' : 'Join to post or find jobs.'}</p>
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name / Company Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                    </div>
                    {!isLogin && (
                         <div>
                            <span className="block text-sm font-medium text-gray-700 mb-2">I am a...</span>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setUserType('student')} className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-md transition-all ${userType === 'student' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'border-gray-300'}`}>
                                    <User className="w-5 h-5"/> Student
                                </button>
                                <button type="button" onClick={() => setUserType('employer')} className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-md transition-all ${userType === 'employer' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'border-gray-300'}`}>
                                    <Building className="w-5 h-5"/> Employer
                                </button>
                            </div>
                        </div>
                    )}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                    <p className="text-center text-sm">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
