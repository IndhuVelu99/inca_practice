import React, { useState } from 'react';
import useSWR from 'swr';
import './App.css';

// Import page components
import SWRDataFetcher from './pages/SWRDataFetcher';
import SWROptionsGuide from './pages/SWROptionsGuide';
import SWRReturnValuesGuide from './pages/SWRReturnValuesGuide';
import SWRHooksExamples from './pages/SWRHooksExamples';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const pages = [
    { id: 'home', label: '🏠 Home', icon: '📊' },
    { id: 'options', label: '⚙️ SWR Options', icon: '🔧' },
    { id: 'returns', label: '📤 Return Values', icon: '📊' },
    { id: 'hooks', label: '🪝 Advanced Hooks', icon: '🪝' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-gradient">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl">📚</span>
              <h1 className="text-xl font-bold text-gray-900">SWR Learning Center</h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-1">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPage(page.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    currentPage === page.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {currentPage === 'home' && <SWRDataFetcher />}
      {currentPage === 'options' && <SWROptionsGuide />}
      {currentPage === 'returns' && <SWRReturnValuesGuide />}
      {currentPage === 'hooks' && <SWRHooksExamples />}
    </div>
  );
}

export default App;
