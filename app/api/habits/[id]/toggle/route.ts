import { NextRequest, NextResponse } from 'next/server'

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { date } = await req.json()
    const response = await fetch(`${EXTERNAL_API_URL}/habits/${id}/toggle`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    })
    if (!response.ok) {
      throw new Error('Failed to toggle habit completion in external API')
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in PUT /api/habits/[id]/toggle:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

