// app/locations/page.tsx
'use client'
import { useState, useEffect } from 'react'

// Bangladesh divisions and districts data
const BANGLADESH_LOCATIONS = {
  'Dhaka': {
    districts: ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
    color: 'bg-red-50 border-red-200 text-red-800'
  },
  'Chattogram': {
    districts: ['Chattogram', 'Bandarban', 'Brahmanbaria', 'Chandpur', 'Cumilla', 'Cox\'s Bazar', 'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
    color: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  'Rajshahi': {
    districts: ['Rajshahi', 'Bogura', 'Joypurhat', 'Naogaon', 'Natore', 'Chapainawabganj', 'Pabna', 'Sirajganj'],
    color: 'bg-green-50 border-green-200 text-green-800'
  },
  'Khulna': {
    districts: ['Khulna', 'Bagerhat', 'Chuadanga', 'Jessore', 'Jhenaidah', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  },
  'Barishal': {
    districts: ['Barishal', 'Barguna', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
    color: 'bg-purple-50 border-purple-200 text-purple-800'
  },
  'Sylhet': {
    districts: ['Sylhet', 'Habiganj', 'Moulvibazar', 'Sunamganj'],
    color: 'bg-indigo-50 border-indigo-200 text-indigo-800'
  },
  'Rangpur': {
    districts: ['Rangpur', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon'],
    color: 'bg-pink-50 border-pink-200 text-pink-800'
  },
  'Mymensingh': {
    districts: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],
    color: 'bg-teal-50 border-teal-200 text-teal-800'
  }
}

export default function LocationsPage() {
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [donorStats, setDonorStats] = useState<{[key: string]: number}>({})

  const filteredLocations = Object.entries(BANGLADESH_LOCATIONS).filter(([division, data]) => {
    if (!searchTerm) return true
    return division.toLowerCase().includes(searchTerm.toLowerCase()) ||
           data.districts.some(district => district.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  const totalDivisions = Object.keys(BANGLADESH_LOCATIONS).length
  const totalDistricts = Object.values(BANGLADESH_LOCATIONS).reduce((sum, div) => sum + div.districts.length, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Bangladesh Locations</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We cover all divisions and districts across Bangladesh. Find donors in your area or explore where you can help.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search divisions or districts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border p-6 text-center">
          <div className="text-3xl font-bold text-red-600">{totalDivisions}</div>
          <div className="text-gray-600 mt-1">Divisions Covered</div>
        </div>
        
        <div className="bg-white rounded-2xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{totalDistricts}</div>
          <div className="text-gray-600 mt-1">Districts Available</div>
        </div>
        
        <div className="bg-white rounded-2xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">24/7</div>
          <div className="text-gray-600 mt-1">Service Available</div>
        </div>
      </div>

      {/* Divisions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map(([division, data]) => (
          <div 
            key={division}
            className={`rounded-2xl border-2 p-6 transition-all cursor-pointer hover:shadow-lg ${
              selectedDivision === division ? data.color : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedDivision(selectedDivision === division ? null : division)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{division}</h3>
              <span className="text-2xl">
                {selectedDivision === division ? '📍' : '📌'}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Districts:</span>
                <span className="font-medium">{data.districts.length}</span>
              </div>
              
              {selectedDivision === division && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">Districts in {division}:</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {data.districts.map(district => (
                      <div key={district} className="text-gray-600 py-1">
                        • {district}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No locations found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}

      {/* Coverage Map Info */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-semibold text-gray-900">Complete Coverage</h3>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Our blood donor network spans across all 8 divisions and {totalDistricts} districts of Bangladesh. 
            Whether you're in a major city or a remote area, we're here to help connect you with life-saving donors.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {Object.keys(BANGLADESH_LOCATIONS).map(division => (
              <span 
                key={division} 
                className="inline-block bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 border"
              >
                {division}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}