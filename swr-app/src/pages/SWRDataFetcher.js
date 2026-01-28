import React, { useState } from 'react';
import useSWR from 'swr';
import '../App.css';

// Fetcher function for SWR
const fetcher = (...args) => fetch(...args).then(res => res.json());

// Sample API endpoint - JSONPlaceholder is a fake REST API
const API_URL = 'https://jsonplaceholder.typicode.com';

function SWRDataFetcher() {
  const [selectedUserId, setSelectedUserId] = useState(1);
  const [tab, setTab] = useState('posts'); // 'posts' or 'comments'

  // Fetch users
  const { data: users, error: usersError, isLoading: usersLoading } = useSWR(
    `${API_URL}/users`,
    fetcher
  );

  // Fetch posts for selected user
  const { data: posts, error: postsError, isLoading: postsLoading } = useSWR(
    tab === 'posts' ? `${API_URL}/posts?userId=${selectedUserId}` : null,
    fetcher
  );

  // Fetch comments for selected user
  const { data: comments, error: commentsError, isLoading: commentsLoading } = useSWR(
    tab === 'comments' ? `${API_URL}/comments?postId=1` : null,
    fetcher
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
            📊 SWR Data Fetcher
          </h1>
          <p className="text-center text-gray-600">
            Interactive application showcasing SWR with Tailwind CSS styling
          </p>
        </div>

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar - User Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">👥</span> Users
              </h2>
              
              {usersLoading && (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              )}

              {usersError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-red-700 text-sm">Failed to load users</p>
                </div>
              )}

              {users && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                        selectedUserId === user.id
                          ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      <div className="font-semibold text-sm">{user.name}</div>
                      <div className={`text-xs ${selectedUserId === user.id ? 'text-indigo-100' : 'text-gray-600'}`}>
                        @{user.username}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setTab('posts')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  tab === 'posts'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-indigo-600'
                }`}
              >
                📝 Posts
              </button>
              <button
                onClick={() => setTab('comments')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  tab === 'comments'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-indigo-600'
                }`}
              >
                💬 Comments
              </button>
            </div>

            {/* Posts Tab */}
            {tab === 'posts' && (
              <div className="space-y-4">
                {postsLoading && (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-gray-200 rounded-lg h-40 animate-pulse"></div>
                    ))}
                  </div>
                )}

                {postsError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
                    <p className="text-red-700 font-semibold">Error loading posts</p>
                  </div>
                )}

                {posts && posts.length === 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
                    <p className="text-yellow-700">No posts found for this user</p>
                  </div>
                )}

                {posts && posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-indigo-500"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 flex-1 pr-4">
                        {post.title}
                      </h3>
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                        #{post.id}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{post.body}</p>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-sm text-gray-600">
                      <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      User ID: {post.userId}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comments Tab */}
            {tab === 'comments' && (
              <div className="space-y-4">
                {commentsLoading && (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-gray-200 rounded-lg h-28 animate-pulse"></div>
                    ))}
                  </div>
                )}

                {commentsError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
                    <p className="text-red-700 font-semibold">Error loading comments</p>
                  </div>
                )}

                {comments && comments.slice(0, 5).map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-green-500"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{comment.name}</h4>
                      <span className="text-xs text-gray-500">Comment #{comment.id}</span>
                    </div>
                    <p className="text-gray-700 mb-3 leading-relaxed">{comment.body}</p>
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      📧 {comment.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>Built with React, SWR, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}

export default SWRDataFetcher;
