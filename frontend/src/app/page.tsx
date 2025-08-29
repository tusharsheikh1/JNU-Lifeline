// app/page.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BloodGroupStats {
  [key: string]: number
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

function getBloodGroupColor(group: string): string {
  const colorMap: { [key: string]: string } = {
    'A+': 'bg-red-100 text-red-800 border-red-200',
    'A-': 'bg-red-50 text-red-700 border-red-100', 
    'B+': 'bg-blue-100 text-blue-800 border-blue-200',
    'B-': 'bg-blue-50 text-blue-700 border-blue-100',
    'AB+': 'bg-purple-100 text-purple-800 border-purple-200',
    'AB-': 'bg-purple-50 text-purple-700 border-purple-100',
    'O+': 'bg-green-100 text-green-800 border-green-200',
    'O-': 'bg-green-50 text-green-700 border-green-100'
  }
  return colorMap[group] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export default function HomePage() {
  const [stats, setStats] = useState<BloodGroupStats>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const response = await fetch('/api/donors/stats')
      const data = await response.json()
      
      if (response.ok && data.status === 'success' && data.data) {
        setStats(data.data)
        setError(null)
      } else {
        // Handle backend errors
        const errorMessage = data.message || `Backend returned ${response.status}`
        setError(`Failed to load statistics: ${errorMessage}`)
        console.error('Stats API error:', data)
      }
    } catch (err) {
      const errorMessage = 'Cannot connect to backend server. Make sure it is running on port 5000.'
      setError(errorMessage)
      console.error('Stats fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalDonors = Object.values(stats).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Find Blood Donors Fast
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect with verified blood donors in Bangladesh. Register as a donor or search for donors by blood group and location.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/donors"
            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            🔍 Search Donors
          </Link>
          <Link 
            href="/register"
            className="inline-flex items-center justify-center px-6 py-3 border border-red-600 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors"
          >
            ❤️ Become a Donor
          </Link>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Available Donors by Blood Group</h2>
          {totalDonors > 0 && (
            <p className="text-gray-600 mt-2">
              {totalDonors} verified donors ready to help
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-600">Loading statistics from database...</p>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="text-center space-y-4">
              <div className="text-4xl">⚠️</div>
              <h3 className="text-lg font-semibold text-yellow-800">Backend Connection Issue</h3>
              <p className="text-yellow-700 text-sm max-w-md mx-auto">{error}</p>
              <button 
                onClick={fetchStats}
                className="px-4 py-2 bg-yellow-600 text-white rounded-xl font-medium hover:bg-yellow-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : totalDonors === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <div className="text-center space-y-4">
              <div className="text-4xl">📊</div>
              <h3 className="text-lg font-semibold text-gray-800">No Data Yet</h3>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                No donors have registered yet. Be the first to join our network!
              </p>
              <Link 
                href="/register"
                className="inline-block px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Register Now
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BLOOD_GROUPS.map(group => (
              <div 
                key={group} 
                className={`p-6 rounded-2xl border-2 text-center ${getBloodGroupColor(group)}`}
              >
                <div className="text-2xl font-bold">{group}</div>
                <div className="text-sm opacity-75 mt-1">Blood Group</div>
                <div className="text-3xl font-bold mt-2">
                  {stats[group] || 0}
                </div>
                <div className="text-sm opacity-75">
                  {stats[group] === 1 ? 'donor' : 'donors'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Search Section */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Need Blood Urgently?</h3>
          <p className="text-gray-600">
            Search for donors by blood group and get contact information instantly
          </p>
          <Link 
            href="/donors?group=O%2B"
            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            Find O+ Donors →
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center space-y-3">
          <div className="text-3xl">🩸</div>
          <h3 className="text-lg font-semibold">Verified Donors</h3>
          <p className="text-gray-600 text-sm">
            All donors are verified with contact information and blood group confirmation
          </p>
        </div>
        
        <div className="text-center space-y-3">
          <div className="text-3xl">⚡</div>
          <h3 className="text-lg font-semibold">Fast Search</h3>
          <p className="text-gray-600 text-sm">
            Find donors by blood group and location in seconds
          </p>
        </div>
        
        <div className="text-center space-y-3">
          <div className="text-3xl">🇧🇩</div>
          <h3 className="text-lg font-semibold">Bangladesh Wide</h3>
          <p className="text-gray-600 text-sm">
            Covering all divisions and districts across Bangladesh
          </p>
        </div>
      </div>
    </div>
  )
}