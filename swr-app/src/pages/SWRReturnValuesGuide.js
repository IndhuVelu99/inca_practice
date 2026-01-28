import React, { useState } from 'react';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

const SWRReturnValuesGuide = () => {
  const [activeSection, setActiveSection] = useState('data');
  const [userId, setUserId] = useState(1);

  // Main example hook
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Example: Manual mutation
  const handleManualMutation = async () => {
    // Mutate with optimistic update
    const optimisticData = { ...data, name: 'Updating...' };
    mutate(optimisticData, false);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Revalidate from API
    mutate();
  };

  // Example: Error handling
  const handleErrorRetry = () => {
    mutate(); // Retry fetching
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📤 SWR Return Values & Methods
          </h1>
          <p className="text-gray-600 text-lg">
            Master all return values: data, error, isLoading, isValidating, and mutate
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-4 rounded-lg shadow">
          {[
            { id: 'data', label: '📦 data' },
            { id: 'error', label: '❌ error' },
            { id: 'isLoading', label: '⏳ isLoading' },
            { id: 'isValidating', label: '🔄 isValidating' },
            { id: 'mutate', label: '🔧 mutate' },
            { id: 'states', label: '🔀 State Combinations' },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded font-semibold transition ${
                activeSection === section.id
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* User Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">Select a User:</h3>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((id) => (
              <button
                key={id}
                onClick={() => setUserId(id)}
                className={`px-4 py-2 rounded font-semibold transition ${
                  userId === id
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                User {id}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current State Panel */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Current State</h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded border-l-4 border-blue-500">
                <p className="text-sm font-semibold text-blue-900">data:</p>
                <p className="text-gray-800 mt-1 font-mono text-sm">
                  {data ? JSON.stringify(data).substring(0, 150) + '...' : 'undefined'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 rounded border-l-4 ${error ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-300'}`}>
                  <p className="text-xs font-semibold text-gray-700">error:</p>
                  <p className="text-sm mt-1 font-mono">{error ? 'Error occurred' : 'null'}</p>
                </div>

                <div className={`p-3 rounded border-l-4 ${isLoading ? 'bg-yellow-50 border-yellow-500' : 'bg-gray-50 border-gray-300'}`}>
                  <p className="text-xs font-semibold text-gray-700">isLoading:</p>
                  <p className="text-sm mt-1 font-mono">{isLoading.toString()}</p>
                </div>

                <div className={`p-3 rounded border-l-4 ${isValidating ? 'bg-purple-50 border-purple-500' : 'bg-gray-50 border-gray-300'}`}>
                  <p className="text-xs font-semibold text-gray-700">isValidating:</p>
                  <p className="text-sm mt-1 font-mono">{isValidating.toString()}</p>
                </div>

                <div className="p-3 rounded border-l-4 border-green-500 bg-green-50">
                  <p className="text-xs font-semibold text-gray-700">mutate:</p>
                  <p className="text-sm mt-1 font-mono">Function</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Status</h3>
            <div className="space-y-3">
              {isLoading && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                  <p className="text-yellow-900 font-semibold flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                    Loading...
                  </p>
                </div>
              )}
              {isValidating && !isLoading && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                  <p className="text-blue-900 font-semibold flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    Validating...
                  </p>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded">
                  <p className="text-red-900 font-semibold flex items-center">
                    <span className="text-lg mr-2">❌</span>
                    Error
                  </p>
                </div>
              )}
              {data && !error && !isLoading && (
                <div className="bg-green-50 border border-green-200 p-3 rounded">
                  <p className="text-green-900 font-semibold flex items-center">
                    <span className="text-lg mr-2">✅</span>
                    Ready
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        {activeSection === 'data' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 data</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-blue-900 mb-2">What is it?</p>
                    <p className="text-blue-800 text-sm">
                      The resolved data from the fetch call. It's undefined while loading,
                      and contains the API response once successful.
                    </p>
                  </div>

                  <div className="bg-code-bg p-4 rounded-lg border border-gray-300 font-mono text-sm">
                    <pre className="text-gray-800 whitespace-pre-wrap break-words">{`// The data returned from fetcher
const { data } = useSWR(url, fetcher);

// Initially: undefined
// While loading: undefined  
// After success: { id: 1, name: "..." }
// On error: undefined`}</pre>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-semibold text-green-900 mb-2">💡 Common Patterns:</p>
                    <ul className="text-green-800 text-sm space-y-2">
                      <li>• Check if data exists before rendering</li>
                      <li>• Use optional chaining: data?.field</li>
                      <li>• Combine with isLoading for proper UI</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-4">Live Example: User Data</h3>
                  {isLoading && (
                    <div className="text-center py-8">
                      <div className="inline-block">
                        <div className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
                      </div>
                      <p className="text-gray-600 mt-4">Loading user data...</p>
                    </div>
                  )}
                  {data && (
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded">
                        <p className="text-sm text-gray-600">ID</p>
                        <p className="font-bold text-lg text-gray-900">{data.id}</p>
                      </div>
                      <div className="bg-white p-4 rounded">
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-bold text-lg text-gray-900">{data.name}</p>
                      </div>
                      <div className="bg-white p-4 rounded">
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-bold text-gray-900">{data.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'error' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">❌ error</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="font-semibold text-red-900 mb-2">What is it?</p>
                    <p className="text-red-800 text-sm">
                      Contains the error object when the fetch fails. It's undefined 
                      on success or while loading.
                    </p>
                  </div>

                  <div className="bg-code-bg p-4 rounded-lg border border-gray-300 font-mono text-sm">
                    <pre className="text-gray-800 whitespace-pre-wrap break-words">{`// Error handling
const { error } = useSWR(url, fetcher);

if (error) {
  return <div>Failed to load: {error.message}</div>
}

// Never show both error and data
// If error exists, data is undefined`}</pre>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="font-semibold text-orange-900 mb-2">💡 Best Practices:</p>
                    <ul className="text-orange-800 text-sm space-y-2">
                      <li>• Always check error before rendering</li>
                      <li>• Show user-friendly error messages</li>
                      <li>• Provide retry option with mutate()</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-4">Error Handling Example</h3>
                  {error && (
                    <div className="space-y-4">
                      <div className="bg-red-100 border-2 border-red-400 p-4 rounded">
                        <p className="font-bold text-red-900 text-lg">⚠️ Error Occurred</p>
                        <p className="text-red-800 mt-2 text-sm">{error.message}</p>
                      </div>
                      <button
                        onClick={handleErrorRetry}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                      >
                        🔄 Retry
                      </button>
                    </div>
                  )}
                  {data && !error && (
                    <div className="bg-green-100 border-2 border-green-400 p-4 rounded text-center">
                      <p className="text-green-900 font-bold">✅ No Error</p>
                      <p className="text-green-800 text-sm mt-2">Data loaded successfully!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'isLoading' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">⏳ isLoading</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="font-semibold text-yellow-900 mb-2">What is it?</p>
                    <p className="text-yellow-800 text-sm">
                      Boolean flag that is true when data hasn't been fetched yet and 
                      there's no cache. False once data is loaded (even if it's being revalidated).
                    </p>
                  </div>

                  <div className="bg-code-bg p-4 rounded-lg border border-gray-300 font-mono text-sm">
                    <pre className="text-gray-800 whitespace-pre-wrap break-words">{`// Show skeleton during initial load
if (isLoading) {
  return <SkeletonLoader />
}

// Key difference from isValidating:
// isLoading: Initial fetch (no cache)
// isValidating: Refetch (have cache)`}</pre>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-blue-900 mb-2">💡 Use Cases:</p>
                    <ul className="text-blue-800 text-sm space-y-2">
                      <li>• Show skeleton loaders</li>
                      <li>• Disable form buttons during load</li>
                      <li>• Show loading spinners</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-4">Loading State Demo</h3>
                  {isLoading ? (
                    <div className="space-y-3">
                      <div className="bg-white rounded p-3 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                      </div>
                      <div className="bg-white rounded p-3 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                      </div>
                      <p className="text-center text-yellow-900 text-sm font-semibold">
                        isLoading = true
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white rounded p-4 text-center">
                      <p className="text-gray-900 font-semibold">isLoading = false</p>
                      <p className="text-sm text-gray-600 mt-2">Data is available!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'isValidating' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🔄 isValidating</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="font-semibold text-purple-900 mb-2">What is it?</p>
                    <p className="text-purple-800 text-sm">
                      Boolean flag that is true whenever SWR is revalidating 
                      (fetching in the background). This includes initial load AND revalidations.
                    </p>
                  </div>

                  <div className="bg-code-bg p-4 rounded-lg border border-gray-300 font-mono text-sm">
                    <pre className="text-gray-800 whitespace-pre-wrap break-words">{`// isValidating covers more cases
const { isValidating } = useSWR(url, fetcher);

// True when:
// - Initial load (isLoading=true, isValidating=true)
// - Revalidation (isLoading=false, isValidating=true)
// - Focus revalidation
// - Interval polling

// False when: not fetching`}</pre>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="font-semibold text-indigo-900 mb-2">💡 Key Difference:</p>
                    <ul className="text-indigo-800 text-sm space-y-2">
                      <li>• isLoading: only for INITIAL load</li>
                      <li>• isValidating: initial + ALL revalidations</li>
                      <li>• Use isValidating for real-time updates</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-4">Validating State Demo</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">isLoading</span>
                        <span className={`px-3 py-1 rounded font-bold text-sm ${
                          isLoading ? 'bg-yellow-200 text-yellow-900' : 'bg-gray-200 text-gray-900'
                        }`}>
                          {isLoading.toString()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">isValidating</span>
                        <span className={`px-3 py-1 rounded font-bold text-sm ${
                          isValidating ? 'bg-blue-200 text-blue-900' : 'bg-gray-200 text-gray-900'
                        }`}>
                          {isValidating.toString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => mutate()}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition mt-4"
                    >
                      🔄 Force Revalidate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'mutate' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🔧 mutate()</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-semibold text-green-900 mb-2">What is it?</p>
                    <p className="text-green-800 text-sm">
                      Function to manually trigger revalidation or update cache. 
                      Essential for handling mutations (POST, PUT, DELETE).
                    </p>
                  </div>

                  <div className="bg-code-bg p-4 rounded-lg border border-gray-300 font-mono text-sm">
                    <pre className="text-gray-800 whitespace-pre-wrap break-words">{`// Basic usage
mutate() // Revalidate from API

// Optimistic update
mutate(newData, false)

// Update and revalidate
mutate(newData, true)

// Custom mutation function
mutate(async () => {
  const res = await fetch(url, { 
    method: 'POST', 
    body: data 
  })
  return res.json()
})`}</pre>
                  </div>

                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="font-semibold text-teal-900 mb-2">💡 Common Patterns:</p>
                    <ul className="text-teal-800 text-sm space-y-2">
                      <li>• Optimistic UI updates</li>
                      <li>• Handle form submissions</li>
                      <li>• Sync multiple requests</li>
                      <li>• Rollback on error</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-4">Mutate Demo</h3>
                  <div className="space-y-4">
                    {data && (
                      <div className="bg-white p-4 rounded">
                        <p className="text-sm text-gray-600">Current Name</p>
                        <p className="font-bold text-lg text-gray-900">{data.name}</p>
                      </div>
                    )}

                    <button
                      onClick={handleManualMutation}
                      disabled={isValidating}
                      className={`w-full font-bold py-2 px-4 rounded transition ${
                        isValidating
                          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {isValidating ? '⏳ Updating...' : '📝 Mutate Data'}
                    </button>

                    <div className="bg-white p-3 rounded text-sm text-gray-700">
                      <p className="font-semibold mb-2">What happens:</p>
                      <ol className="list-decimal list-inside space-y-1 text-gray-600">
                        <li>Optimistic update shown immediately</li>
                        <li>After 1s, revalidates from API</li>
                        <li>Real data is restored</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'states' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🔀 State Combinations</h2>
              <p className="text-gray-700 mb-6">
                Understanding how isLoading, isValidating, data, and error combine:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: 'Initial Load',
                    isLoading: true,
                    isValidating: true,
                    data: 'undefined',
                    error: 'null',
                    ui: '⏳ Show skeleton loader',
                  },
                  {
                    name: 'Load Complete',
                    isLoading: false,
                    isValidating: false,
                    data: '{ ... }',
                    error: 'null',
                    ui: '✅ Show data',
                  },
                  {
                    name: 'Revalidating',
                    isLoading: false,
                    isValidating: true,
                    data: '{ ... }',
                    error: 'null',
                    ui: '🔄 Show data + refresh icon',
                  },
                  {
                    name: 'Error on Load',
                    isLoading: true,
                    isValidating: true,
                    data: 'undefined',
                    error: 'Error',
                    ui: '❌ Show error message',
                  },
                  {
                    name: 'Error on Revalidate',
                    isLoading: false,
                    isValidating: true,
                    data: '{ ... }',
                    error: 'Error',
                    ui: '⚠️ Show stale data + error',
                  },
                  {
                    name: 'Manual Pause',
                    isLoading: false,
                    isValidating: false,
                    data: '{ ... }',
                    error: 'null',
                    ui: '🎯 Show cached data',
                  },
                ].map((state, idx) => (
                  <div key={idx} className="border-2 border-gray-300 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-3">{state.name}</h3>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">isLoading:</span>
                        <span className={`font-mono font-bold ${state.isLoading ? 'text-red-600' : 'text-green-600'}`}>
                          {state.isLoading ? 'true' : 'false'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">isValidating:</span>
                        <span className={`font-mono font-bold ${state.isValidating ? 'text-blue-600' : 'text-green-600'}`}>
                          {state.isValidating ? 'true' : 'false'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">data:</span>
                        <span className="font-mono text-gray-800">{state.data}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">error:</span>
                        <span className="font-mono text-gray-800">{state.error}</span>
                      </div>
                    </div>
                    <div className="bg-gray-100 p-2 rounded text-xs text-gray-700">
                      {state.ui}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SWRReturnValuesGuide;
