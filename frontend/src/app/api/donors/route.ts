// app/api/donors/route.ts
import { NextRequest } from 'next/server'

const BACKEND_BASE = process.env.PHASE1_BASE || 'http://localhost:5000/api'

function toArray(data: any): any[] {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data?.donors)) return data.data.donors
  if (Array.isArray(data?.donors)) return data.donors
  if (Array.isArray(data?.data)) return data.data
  return []
}

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams
  
  // Convert frontend params to backend params for search endpoint
  const backendParams = new URLSearchParams()
  
  // Map 'group' to 'bloodGroup' for backend
  if (searchParams.get('group')) {
    backendParams.set('bloodGroup', searchParams.get('group') as string)
  }
  
  // Map 'area' to 'division' or 'district' (backend uses division, district, thana)
  if (searchParams.get('area')) {
    backendParams.set('division', searchParams.get('area') as string)
  }
  if (searchParams.get('division')) {
    backendParams.set('division', searchParams.get('division') as string)
  }
  if (searchParams.get('district')) {
    backendParams.set('district', searchParams.get('district') as string)
  }
  if (searchParams.get('thana')) {
    backendParams.set('thana', searchParams.get('thana') as string)
  }

  const queryString = backendParams.toString()
  const upstream = `${BACKEND_BASE}/donors/search${queryString ? `?${queryString}` : ''}`

  try {
    const response = await fetch(upstream, { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Backend /donors/search responded with ${response.status}: ${errorText}`)
      
      return Response.json({
        error: `Backend error: ${response.status}`,
        message: 'Could not fetch donors from backend'
      }, { status: response.status })
    }

    const data = await response.json()
    
    // Return the donors array from the backend response structure
    return Response.json(toArray(data), { status: 200 })
    
  } catch (error) {
    console.error('Failed to connect to backend /donors/search:', error)
    return Response.json({
      error: 'Connection failed',
      message: 'Could not connect to backend server. Make sure it is running on port 5000.'
    }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const upstream = `${BACKEND_BASE}/donors/register`
    
    const response = await fetch(upstream, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body,
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error(`Backend /donors/register responded with ${response.status}:`, data)
    }
    
    return Response.json(data, { status: response.status })
    
  } catch (error) {
    console.error('Failed to connect to backend /donors/register:', error)
    return Response.json({ 
      status: 'error', 
      message: 'Could not connect to backend server. Make sure it is running on port 5000.' 
    }, { status: 503 })
  }
}