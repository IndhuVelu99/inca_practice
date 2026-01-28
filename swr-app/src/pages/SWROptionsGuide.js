import React, { useState } from 'react';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

const SWROptionsGuide = () => {
  const [activeTab, setActiveTab] = useState('revalidateOnFocus');

  // Example 1: revalidateOnFocus
  const { data: focusData, isLoading: focusLoading } = useSWR(
    'https://jsonplaceholder.typicode.com/posts/1',
    fetcher,
    {
      revalidateOnFocus: true, // Revalidate when window regains focus
      dedupingInterval: 2000,
    }
  );

  // Example 2: revalidateOnReconnect
  const { data: reconnectData } = useSWR(
    'https://jsonplaceholder.typicode.com/posts/2',
    fetcher,
    {
      revalidateOnReconnect: true, // Revalidate when network reconnects
      dedupingInterval: 1000,
    }
  );

  // Example 3: revalidateIfStale
  const { data: staleData, mutate: mutateStale } = useSWR(
    'https://jsonplaceholder.typicode.com/posts/3',
    fetcher,
    {
      revalidateIfStale: true, // Allow revalidation even if data is fresh
      focusThrottleInterval: 5000, // Throttle revalidation
    }
  );

  // Example 4: refreshInterval
  const { data: intervalData } = useSWR(
    'https://jsonplaceholder.typicode.com/posts/4',
    fetcher,
    {
      refreshInterval: 5000, // Poll every 5 seconds
      refreshWhenHidden: false, // Don't poll when tab is hidden
      refreshWhenOffline: false, // Don't poll when offline
    }
  );

  // Example 5: compare (custom comparison)
  const { data: compareData } = useSWR(
    'https://jsonplaceholder.typicode.com/posts/5',
    fetcher,
    {
      compare: (a, b) => {
        // Custom comparison: only revalidate if userId changed
        return a?.userId === b?.userId;
      },
    }
  );

  // Example 6: onSuccess, onError, onLoadingSlow callbacks
  const { data: callbackData, error: callbackError } = useSWR(
    'https://jsonplaceholder.typicode.com/posts/6',
    fetcher,
    {
      onSuccess: (data) => {
        console.log('Data loaded successfully:', data.title);
      },
      onError: (error) => {
        console.error('Error occurred:', error);
      },
      onLoadingSlow: (key, config) => {
        console.warn('Loading is taking longer than expected for:', key);
      },
      loadingTimeout: 3000, // Trigger onLoadingSlow after 3s
    }
  );

  // Example 7: shouldRetryOnError with custom logic
  const { data: retryData } = useSWR(
    'https://jsonplaceholder.typicode.com/posts/7',
    fetcher,
    {
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 1000, // Initial retry interval
    }
  );

  // Example 8: isPaused - conditional fetching
  const [pauseFetch, setPauseFetch] = useState(false);
  const { data: pausedData } = useSWR(
    'https://jsonplaceholder.typicode.com/posts/8',
    fetcher,
    {
      isPaused: () => pauseFetch, // Pause fetching when flag is true
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔧 SWR Options Deep Dive
          </h1>
          <p className="text-gray-600 text-lg">
            Learn all SWR configuration options with practical examples
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-4 rounded-lg shadow">
          {[
            { id: 'revalidateOnFocus', label: 'Revalidate Focus' },
            { id: 'revalidateOnReconnect', label: 'Reconnect' },
            { id: 'refreshInterval', label: 'Polling' },
            { id: 'callbacks', label: 'Callbacks' },
            { id: 'compare', label: 'Custom Compare' },
            { id: 'retry', label: 'Retry Strategy' },
            { id: 'pause', label: 'Pause Fetching' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === 'revalidateOnFocus' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📌 revalidateOnFocus
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Automatically revalidate data when the browser window regains focus. 
                  Perfect for keeping data fresh when users switch tabs.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
{`useSWR(url, fetcher, {
  revalidateOnFocus: true,
  dedupingInterval: 2000
})`}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="font-semibold text-green-900 mb-2">💡 Use Case:</p>
                  <p className="text-green-800 text-sm">
                    Dashboard apps where data changes frequently and users might switch between tabs/windows
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Live Example</h3>
              {focusLoading && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                  <span>Loading data...</span>
                </div>
              )}
              {focusData && (
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-bold text-gray-900">Post #{focusData.id}</h4>
                    <p className="text-gray-700 mt-2">{focusData.title}</p>
                  </div>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded">
                    ✨ Try switching to another tab and back. Data will revalidate!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'revalidateOnReconnect' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🔌 revalidateOnReconnect
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Automatically revalidate data when the network connection is restored. 
                  Essential for handling offline/online scenarios.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
{`useSWR(url, fetcher, {
  revalidateOnReconnect: true
})`}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded">
                  <p className="font-semibold text-orange-900 mb-2">💡 Use Case:</p>
                  <p className="text-orange-800 text-sm">
                    Mobile apps or apps used on unreliable connections where users go offline frequently
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Live Example</h3>
              {reconnectData && (
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-bold text-gray-900">Post #{reconnectData.id}</h4>
                    <p className="text-gray-700 mt-2">{reconnectData.title}</p>
                  </div>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded">
                    🌐 Disconnect your network and reconnect. Data will auto-refresh!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'refreshInterval' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ⏱️ refreshInterval (Polling)
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Automatically fetch data at regular intervals. Great for real-time data 
                  like stock prices, notifications, or live updates.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
{`useSWR(url, fetcher, {
  refreshInterval: 5000, // Every 5 seconds
  refreshWhenHidden: false,
  refreshWhenOffline: false
})`}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="font-semibold text-green-900 mb-2">💡 Use Case:</p>
                  <p className="text-green-800 text-sm">
                    Real-time dashboards, live feeds, stock tickers, or notification systems
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Live Example</h3>
              {intervalData && (
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-900">Post #{intervalData.id}</h4>
                      <span className="text-xs bg-green-200 text-green-900 px-2 py-1 rounded">
                        Polling every 5s
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">{intervalData.title}</p>
                  </div>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded">
                    ⏳ Data refreshes automatically every 5 seconds
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'callbacks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📞 Lifecycle Callbacks
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Hook into SWR's lifecycle with onSuccess, onError, and onLoadingSlow callbacks.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
{`useSWR(url, fetcher, {
  onSuccess: (data) => console.log(data),
  onError: (error) => console.error(error),
  onLoadingSlow: (key) => console.warn(key),
  loadingTimeout: 3000
})`}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <p className="font-semibold text-purple-900 mb-2">💡 Use Case:</p>
                  <p className="text-purple-800 text-sm">
                    Analytics tracking, custom error handling, or showing slow-loading warnings
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Live Example</h3>
              {callbackData && (
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-bold text-gray-900">Post #{callbackData.id}</h4>
                    <p className="text-gray-700 mt-2">{callbackData.title}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded text-sm">
                    <p className="text-green-900 font-semibold">✅ onSuccess callback triggered!</p>
                    <p className="text-green-700 mt-1">Check browser console for detailed logging</p>
                  </div>
                </div>
              )}
              {callbackError && (
                <div className="bg-red-50 p-3 rounded text-sm">
                  <p className="text-red-900 font-semibold">❌ onError callback triggered!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🔍 Custom Compare Function
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Control how SWR determines if cached data should be updated. 
                  Useful for deep comparisons or custom logic.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
{`useSWR(url, fetcher, {
  compare: (a, b) => {
    // Only revalidate if userId changed
    return a?.userId === b?.userId;
  }
})`}
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded">
                  <p className="font-semibold text-indigo-900 mb-2">💡 Use Case:</p>
                  <p className="text-indigo-800 text-sm">
                    When you want to control revalidation based on specific fields, not the whole object
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Live Example</h3>
              {compareData && (
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-bold text-gray-900">Post #{compareData.id}</h4>
                    <p className="text-gray-700 mt-2">{compareData.title}</p>
                    <p className="text-sm text-gray-600 mt-3">
                      <span className="font-semibold">User ID:</span> {compareData.userId}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded">
                    Only revalidates when userId changes with custom compare logic
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'retry' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🔄 Error Retry Strategy
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Configure how SWR handles errors and retries failed requests with exponential backoff.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
{`useSWR(url, fetcher, {
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 1000
})`}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded">
                  <p className="font-semibold text-red-900 mb-2">💡 Use Case:</p>
                  <p className="text-red-800 text-sm">
                    Handle network failures gracefully with automatic retries
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Live Example</h3>
              {retryData && (
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-bold text-gray-900">Post #{retryData.id}</h4>
                    <p className="text-gray-700 mt-2">{retryData.title}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded text-sm">
                    <p className="text-blue-900 font-semibold">🔄 Retry Settings:</p>
                    <p className="text-blue-700 mt-1">Max retries: 3 | Interval: 1000ms</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'pause' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ⏸️ Conditional Fetching (isPaused)
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Conditionally pause and resume fetching based on your application state.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
{`useSWR(url, fetcher, {
  isPaused: () => pauseFetch
})`}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded">
                  <p className="font-semibold text-yellow-900 mb-2">💡 Use Case:</p>
                  <p className="text-yellow-800 text-sm">
                    Only fetch data when a modal is open, or when user is on a specific page
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Live Example</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setPauseFetch(!pauseFetch)}
                  className={`w-full py-2 px-4 rounded font-semibold transition ${
                    pauseFetch
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {pauseFetch ? '⏸️ Paused - Click to Resume' : '▶️ Running - Click to Pause'}
                </button>
                {pausedData && !pauseFetch && (
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-bold text-gray-900">Post #{pausedData.id}</h4>
                    <p className="text-gray-700 mt-2">{pausedData.title}</p>
                    <p className="text-sm text-green-600 mt-2">✅ Fetching active</p>
                  </div>
                )}
                {pauseFetch && (
                  <div className="bg-gray-100 p-4 rounded text-center">
                    <p className="text-gray-700 font-semibold">⏸️ Fetching is paused</p>
                    <p className="text-sm text-gray-600 mt-2">Click resume button to continue</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SWROptionsGuide;
