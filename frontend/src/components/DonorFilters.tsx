// components/DonorFilters.tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const POPULAR_AREAS = [
  'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh',
  'Gazipur', 'Narayanganj', 'Cumilla', 'Cox\'s Bazar', 'Jessore', 'Bogura', 'Dinajpur'
]

export default function DonorFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSearching, setIsSearching] = useState(false)
  
  const currentGroup = searchParams.get('group') || ''
  const currentArea = searchParams.get('area') || ''

  function updateFilters(newParams: Record<string, string>) {
    setIsSearching(true)
    
    const params = new URLSearchParams()
    
    // Set new parameters, removing empty ones
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value.trim()) {
        params.set(key, value.trim())
      }
    })
    
    // Keep existing parameters that weren't updated
    searchParams.forEach((value, key) => {
      if (!(key in newParams) && value) {
        params.set(key, value)
      }
    })
    
    const queryString = params.toString()
    router.push(`/donors${queryString ? `?${queryString}` : ''}`)
    
    // Reset searching state after a brief delay
    setTimeout(() => setIsSearching(false), 500)
  }

  function clearFilters() {
    setIsSearching(true)
    router.push('/donors')
    setTimeout(() => setIsSearching(false), 500)
  }

  const hasFilters = currentGroup || currentArea

  return (
    <div className="space-y-4">
      {/* Main Filters */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Blood Group Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
          <select 
            className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
            value={currentGroup}
            onChange={(e) => updateFilters({ group: e.target.value, area: currentArea })}
          >
            <option value="">Any blood group</option>
            {BLOOD_GROUPS.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        {/* Area Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Area/City</label>
          <input 
            type="text"
            className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Enter area, city, or district"
            defaultValue={currentArea}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                updateFilters({ group: currentGroup, area: e.currentTarget.value })
              }
            }}
            onBlur={(e) => updateFilters({ group: currentGroup, area: e.target.value })}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={clearFilters}
            disabled={!hasFilters || isSearching}
            className="flex-1 border border-gray-300 text-gray-700 rounded-xl px-4 py-2 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? 'Clearing...' : 'Clear All'}
          </button>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Blood Group Search</h3>
          <div className="flex flex-wrap gap-2">
            {BLOOD_GROUPS.map(group => (
              <button
                key={group}
                onClick={() => updateFilters({ group, area: currentArea })}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  currentGroup === group
                    ? 'bg-red-600 text-white'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Areas</h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_AREAS.slice(0, 8).map(area => (
              <button
                key={area}
                onClick={() => updateFilters({ group: currentGroup, area })}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  currentArea === area
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasFilters && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {currentGroup && (
                  <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Blood: {currentGroup}
                    <button
                      onClick={() => updateFilters({ group: '', area: currentArea })}
                      className="ml-1.5 text-red-600 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {currentArea && (
                  <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Area: {currentArea}
                    <button
                      onClick={() => updateFilters({ group: currentGroup, area: '' })}
                      className="ml-1.5 text-blue-600 hover:text-blue-700"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            </div>
            
            {isSearching && (
              <div className="text-sm text-gray-600 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                Searching...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}