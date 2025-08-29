// app/api/locations/route.ts
import { NextRequest } from 'next/server'

const BACKEND_BASE = process.env.PHASE1_BASE || 'http://localhost:5000/api'

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams
    const queryString = searchParams.toString()
    
    const upstream = `${BACKEND_BASE}/locations/hierarchy${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(upstream, { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Backend /locations/hierarchy responded with ${response.status}: ${errorText}`)
      
      return Response.json({
        error: `Backend error: ${response.status}`,
        message: 'Could not fetch location data from backend'
      }, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data, { status: 200 })
    
  } catch (error) {
    console.error('Failed to connect to backend /locations/hierarchy:', error)
    return Response.json({
      error: 'Connection failed',
      message: 'Could not connect to backend server. Make sure it is running on port 5000.'
    }, { status: 503 })
  }
}