import React, { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

const SWRHooksExamples = () => {
  const [activeTab, setActiveTab] = useState('dependent');
  const [postId, setPostId] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Example 1: Dependent fetching (conditional requests)
  const { data: post } = useSWR(
    postId ? `https://jsonplaceholder.typicode.com/posts/${postId}` : null,
    fetcher
  );

  const { data: comments } = useSWR(
    postId ? `https://jsonplaceholder.typicode.com/posts/${postId}/comments` : null,
    fetcher
  );

  // Example 2: Multiple requests (SWR Array)
  const { data: posts } = useSWR(
    'https://jsonplaceholder.typicode.com/posts?_limit=5',
    fetcher
  );

  const { data: users } = useSWR(
    'https://jsonplaceholder.typicode.com/users?_limit=5',
    fetcher
  );

  // Example 3: useSWRConfig for global mutation
  const { mutate: globalMutate } = useSWRConfig();

  // Example 4: Search with debounce
  const { data: searchResults } = useSWR(
    searchTerm ? `https://jsonplaceholder.typicode.com/posts?q=${searchTerm}` : null,
    fetcher
  );

  // Example 5: Error handling with retry
  const { data: unreliableData, error: unreliableError, mutate: retryUnreliable } = useSWR(
    'https://jsonplaceholder.typicode.com/posts/1',
    fetcher,
    {
      onError: (error) => {
        console.log('Error occurred, will retry...');
      },
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🪝 Advanced SWR Hooks Examples
          </h1>
          <p className="text-gray-600 text-lg">
            Real-world patterns and advanced usage scenarios
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-4 rounded-lg shadow">
          {[
            { id: 'dependent', label: '🔗 Dependent Requests' },
            { id: 'parallel', label: '⚡ Parallel Requests' },
            { id: 'search', label: '🔍 Search Pattern' },
            { id: 'mutation', label: '📝 Mutation Handling' },
            { id: 'global', label: '🌍 Global Config' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DEPENDENT REQUESTS */}
        {activeTab === 'dependent' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🔗 Dependent Requests
                </h2>
                <p className="text-gray-700 mb-4">
                  Fetch data based on previous results. Only fetch comments when you have a post.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                  <p className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
{`// Only fetch when postId is set
const { data: comments } = useSWR(
  postId ? \`/posts/\${postId}/comments\` : null,
  fetcher
)`}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Select Post:</p>
                    <select
                      value={postId}
                      onChange={(e) => setPostId(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {[1, 2, 3, 4, 5].map((id) => (
                        <option key={id} value={id}>
                          Post {id}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                {/* Post Data */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Post Data</h3>
                  {post ? (
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded">
                        <p className="text-xs text-gray-600">Title</p>
                        <p className="font-bold text-gray-900">{post.title}</p>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <p className="text-xs text-gray-600">Body</p>
                        <p className="text-sm text-gray-700">{post.body.substring(0, 100)}...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">Loading post...</div>
                  )}
                </div>

                {/* Comments Data */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Comments (Dependent)</h3>
                  {post && comments ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {comments.slice(0, 3).map((comment) => (
                        <div key={comment.id} className="bg-white p-2 rounded text-sm">
                          <p className="font-semibold text-gray-900">{comment.name}</p>
                          <p className="text-gray-700 text-xs mt-1">{comment.body.substring(0, 60)}...</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {post ? 'Loading comments...' : 'Select a post first'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-bold text-gray-900">Step 1: Select Post</p>
                  <p className="text-gray-700 text-sm mt-2">Choose a post from the dropdown</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-bold text-gray-900">Step 2: Fetch Dependents</p>
                  <p className="text-gray-700 text-sm mt-2">Comments are fetched only after post is loaded</p>
                </div>
                <div className="border-l-4 border-pink-500 pl-4">
                  <p className="font-bold text-gray-900">Step 3: Display</p>
                  <p className="text-gray-700 text-sm mt-2">Both post and comments render together</p>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded mt-4">
                <p className="font-semibold text-green-900 mb-2">✨ Benefits:</p>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Avoids unnecessary requests</li>
                  <li>• Enforces data dependencies</li>
                  <li>• Improves performance</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* PARALLEL REQUESTS */}
        {activeTab === 'parallel' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  ⚡ Parallel Requests
                </h2>
                <p className="text-gray-700 mb-4">
                  Fetch multiple resources simultaneously without waiting for one to complete.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                  <p className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
{`// Multiple independent requests
const { data: posts } = useSWR('/posts', fetcher)
const { data: users } = useSWR('/users', fetcher)
const { data: comments } = useSWR('/comments', fetcher)

// All fetch in parallel!`}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded">
                  <p className="font-semibold text-green-900 mb-2">💡 Use When:</p>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Loading multiple independent data sources</li>
                    <li>• No dependencies between requests</li>
                    <li>• Want fastest total load time</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                {/* Posts */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">📝 Posts</h3>
                  {posts ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {posts.map((p) => (
                        <div key={p.id} className="bg-white p-2 rounded text-sm">
                          <p className="font-bold text-gray-900">Post {p.id}</p>
                          <p className="text-gray-700 text-xs truncate">{p.title}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="animate-pulse space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Users */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">👥 Users</h3>
                  {users ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {users.map((u) => (
                        <div key={u.id} className="bg-white p-2 rounded text-sm">
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-gray-700 text-xs truncate">{u.email}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="animate-pulse space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">⏱️ Performance Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded">
                  <p className="font-bold text-red-900 mb-2">❌ Sequential</p>
                  <p className="text-red-800 text-sm">
                    Wait for posts → Wait for users → Wait for comments = Slow
                  </p>
                  <p className="font-mono text-xs mt-2 text-red-700">Total: ~3s</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="font-bold text-green-900 mb-2">✅ Parallel</p>
                  <p className="text-green-800 text-sm">
                    Fetch all at once = Fast (concurrent requests)
                  </p>
                  <p className="font-mono text-xs mt-2 text-green-700">Total: ~1s</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH PATTERN */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🔍 Search Pattern
                </h2>
                <p className="text-gray-700 mb-4">
                  Only fetch when search term changes. Avoid unnecessary requests while typing.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                  <p className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
{`// Only fetch when searchTerm exists
const { data: results } = useSWR(
  searchTerm ? \`/search?q=\${searchTerm}\` : null,
  fetcher
)`}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block mb-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Search Posts:</p>
                    <input
                      type="text"
                      placeholder="Type to search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </label>
                </div>

                <div className="bg-orange-50 p-4 rounded">
                  <p className="font-semibold text-orange-900 mb-2">💡 Tips:</p>
                  <ul className="text-orange-800 text-sm space-y-1">
                    <li>• Avoid fetching if searchTerm is empty</li>
                    <li>• In real apps, add debounce</li>
                    <li>• Show loading state</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Results</h3>
                {searchTerm ? (
                  searchResults ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        searchResults.slice(0, 5).map((result) => (
                          <div key={result.id} className="bg-white p-3 rounded">
                            <p className="font-bold text-gray-900">Post {result.id}</p>
                            <p className="text-sm text-gray-700 mt-1">{result.title}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No results found for "{searchTerm}"
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-block">
                        <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                      </div>
                      <p className="text-gray-600 mt-4">Searching...</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    🔍 Type something to search
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Real-World Example</h3>
              <div className="bg-code-bg p-4 rounded border border-gray-300 font-mono text-sm whitespace-pre-wrap break-words text-gray-800">
{`import { useState } from 'react'
import useSWR from 'swr'

function SearchComponent() {
  const [query, setQuery] = useState('')
  
  // Only fetch when query is not empty
  const { data, isLoading } = useSWR(
    query ? \`/api/search?q=\${encodeURIComponent(query)}\` : null,
    fetcher,
    { 
      dedupingInterval: 500 // Debounce 500ms
    }
  )
  
  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {isLoading && <p>Searching...</p>}
      {data && <Results items={data} />}
    </div>
  )
}`}
              </div>
            </div>
          </div>
        )}

        {/* MUTATION HANDLING */}
        {activeTab === 'mutation' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  📝 Mutation Handling
                </h2>
                <p className="text-gray-700 mb-4">
                  Handle form submissions and data updates with optimistic UI.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                  <p className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
{`const { mutate } = useSWR(url, fetcher)

async function updateData(newData) {
  // Optimistic update
  mutate(newData, false)
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(newData)
    })
    
    // Revalidate with server data
    mutate()
  } catch (error) {
    // Revert on error
    mutate()
  }
}`}
                  </p>
                </div>

                <div className="bg-indigo-50 p-4 rounded">
                  <p className="font-semibold text-indigo-900 mb-2">✨ Benefits:</p>
                  <ul className="text-indigo-800 text-sm space-y-1">
                    <li>• Instant UI feedback</li>
                    <li>• Handles failures gracefully</li>
                    <li>• Keeps cache in sync</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Example Flow</h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border-l-4 border-yellow-500">
                    <p className="font-bold text-gray-900 text-sm">1. User submits form</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                    <p className="font-bold text-gray-900 text-sm">2. Update UI optimistically</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                    <p className="font-bold text-gray-900 text-sm">3. Send to server</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-green-500">
                    <p className="font-bold text-gray-900 text-sm">4. Success: Confirm</p>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-red-500">
                    <p className="font-bold text-gray-900 text-sm">5. Error: Revert & Show message</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mutation Patterns Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-2">Optimistic</h4>
                  <p className="text-sm text-gray-700 mb-3">Update first, sync later</p>
                  <div className="bg-green-50 p-2 rounded text-xs text-green-800">
                    ✅ Fast UI<br/>
                    ⚠️ Need rollback
                  </div>
                </div>
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-2">Pessimistic</h4>
                  <p className="text-sm text-gray-700 mb-3">Wait for server, then update</p>
                  <div className="bg-orange-50 p-2 rounded text-xs text-orange-800">
                    ✅ Safe<br/>
                    ⚠️ Slower
                  </div>
                </div>
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-2">Hybrid</h4>
                  <p className="text-sm text-gray-700 mb-3">Optimistic + fallback</p>
                  <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                    ✅ Best of both<br/>
                    ✅ Recommended
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GLOBAL CONFIG */}
        {activeTab === 'global' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🌍 Global Configuration
                </h2>
                <p className="text-gray-700 mb-4">
                  Set defaults for all useSWR hooks in your app with SWRConfig.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                  <p className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
{`// In App.js
import { SWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig value={{
      refreshInterval: 10000,
      dedupingInterval: 60000,
      errorRetryCount: 3,
    }}>
      <YourApp />
    </SWRConfig>
  )
}

// All useSWR hooks inherit these settings`}
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded">
                  <p className="font-semibold text-purple-900 mb-2">🎯 Best Practices:</p>
                  <ul className="text-purple-800 text-sm space-y-1">
                    <li>• Set defaults in root component</li>
                    <li>• Override per-hook if needed</li>
                    <li>• Consistent behavior across app</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Global Config Options</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {[
                    { key: 'refreshInterval', value: '5000', desc: 'Polling interval (ms)' },
                    { key: 'dedupingInterval', value: '2000', desc: 'Dedup requests (ms)' },
                    { key: 'focusThrottleInterval', value: '5000', desc: 'Throttle on focus' },
                    { key: 'errorRetryCount', value: '5', desc: 'Max retries' },
                    { key: 'errorRetryInterval', value: '5000', desc: 'Retry interval' },
                    { key: 'shouldRetryOnError', value: 'true', desc: 'Auto retry' },
                  ].map((option, idx) => (
                    <div key={idx} className="bg-white p-3 rounded">
                      <p className="font-mono font-bold text-gray-900 text-sm">{option.key}</p>
                      <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
                      <p className="text-xs text-purple-700 mt-1">Default: {option.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Global vs Local Config</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-bold text-blue-900 mb-2">Global (SWRConfig)</h4>
                  <div className="bg-white p-2 rounded text-xs text-gray-700 font-mono">
                    <p>• Applies to ALL hooks</p>
                    <p>• Set once in root</p>
                    <p>• Can be overridden</p>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <h4 className="font-bold text-green-900 mb-2">Local (useSWR options)</h4>
                  <div className="bg-white p-2 rounded text-xs text-gray-700 font-mono">
                    <p>• Only this hook</p>
                    <p>• Overrides global</p>
                    <p>• Hook-specific needs</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded mt-4 border-l-4 border-indigo-500">
                <p className="font-bold text-indigo-900 mb-2">📌 Pro Tip:</p>
                <p className="text-indigo-800 text-sm">
                  Use global config for sensible defaults, then override at the hook level for specific needs.
                  This keeps your code DRY and maintainable.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SWRHooksExamples;
