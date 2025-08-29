// app/donors/page.tsx
import DonorFilters from '@/components/DonorFilters'

type Donor = {
  id: string
  name: string
  phone: string
  group: string
  area: string
  division?: string
  district?: string
}

/** Coerce Next.js App Router searchParams entries into plain strings */
function coerceOne(v: unknown): string | undefined {
  if (Array.isArray(v)) return typeof v[0] === 'string' ? v[0] : undefined
  return typeof v === 'string' ? v : undefined
}

/** Always return an array regardless of backend payload shape */
function toArray(data: any): Donor[] {
  if (Array.isArray(data)) return data as Donor[]
  if (Array.isArray(data?.data)) return data.data as Donor[]
  if (Array.isArray(data?.donors)) return data.donors as Donor[]
  return []
}

async function getDonors(searchParams: { [k: string]: unknown }) {
  const group = coerceOne(searchParams.group)
  const area = coerceOne(searchParams.area)

  // Don't make API call if no search parameters
  if (!group && !area) {
    return []
  }

  const qs = new URLSearchParams()
  if (group) qs.set('group', group)
  if (area) qs.set('area', area)

  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || ''
    const url = `${base}/api/donors${qs.toString() ? `?${qs.toString()}` : ''}`

    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    })
    
    if (!res.ok) {
      console.error(`API responded with ${res.status}`)
      return []
    }
    
    const data = await res.json().catch(() => [])
    return toArray(data)
  } catch (error) {
    console.error('Failed to fetch donors:', error)
    return []
  }
}

export default async function DonorsPage({
  searchParams,
}: {
  searchParams: { [k: string]: unknown }
}) {
  const donors = await getDonors(searchParams)
  const hasSearchParams = Object.keys(searchParams).length > 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Find Blood Donors</h1>
        <p className="text-gray-600">
          Search for donors by blood group and location. Contact them directly for urgent needs.
        </p>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Filters</h2>
        <DonorFilters />
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {hasSearchParams && (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results
              {donors.length > 0 && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({donors.length} donor{donors.length !== 1 ? 's' : ''} found)
                </span>
              )}
            </h2>
          </div>
        )}

        {/* Results Grid */}
        {donors.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {donors.map((donor) => (
              <article key={donor.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{donor.name}</h3>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        🩸 <span className="ml-1">{donor.group}</span>
                      </span>
                      <span className="flex items-center">
                        📍 <span className="ml-1">{donor.area}</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* Blood Group Badge */}
                  <div className="flex-shrink-0 ml-4">
                    <span className="inline-flex items-center justify-center w-12 h-12 bg-red-100 text-red-800 rounded-full border-2 border-red-200 font-bold text-sm">
                      {donor.group}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Contact Number:</span>
                    <a 
                      href={`tel:${donor.phone}`}
                      className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      📞 <span className="ml-1">{donor.phone}</span>
                    </a>
                  </div>
                  
                  {(donor.division || donor.district) && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="text-sm text-gray-900">
                        {donor.district && `${donor.district}, `}{donor.division}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <a
                    href={`tel:${donor.phone}`}
                    className="flex-1 bg-red-600 text-white text-center py-2 rounded-xl font-medium hover:bg-red-700 transition-colors"
                  >
                    Call Now
                  </a>
                  <a
                    href={`sms:${donor.phone}?body=Hi, I urgently need ${donor.group} blood. Can you help?`}
                    className="flex-1 bg-gray-100 text-gray-700 text-center py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Send SMS
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : hasSearchParams ? (
          /* No Results */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No donors found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or check back later as new donors join our network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Become a Donor
              </a>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Try Different Search
              </button>
            </div>
          </div>
        ) : (
          /* No Search Yet */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🩸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Search</h3>
            <p className="text-gray-600 mb-6">
              Use the filters above to find blood donors by blood group and location.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                <a
                  key={group}
                  href={`/donors?group=${encodeURIComponent(group)}`}
                  className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Find {group} Donors
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Emergency Notice */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-red-800">🚨 Emergency Notice</h3>
          <p className="text-red-700 text-sm">
            In case of urgent blood requirements, please also contact your nearest hospital blood bank 
            or blood transfusion center for immediate assistance.
          </p>
        </div>
      </div>
    </div>
  )
}