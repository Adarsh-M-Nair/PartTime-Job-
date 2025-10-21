import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import AppContent from './components/AppContent';


// Main App Component
export default function App() {
    return (
        <AuthProvider>
            <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
                <Header />
                <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                    <AppContent />
                </main>
            </div>
        </AuthProvider>
    );
}
