import { NextResponse } from "next/server"

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL

export async function GET() {
  try {
    const response = await fetch(`${EXTERNAL_API_URL}/habits`)
    if (!response.ok) {
      throw new Error("Failed to fetch habits from external API")
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/habits:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const habit = await request.json()
    const response = await fetch(`${EXTERNAL_API_URL}/habits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(habit),
    })
    if (!response.ok) {
      throw new Error("Failed to add habit to external API")
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in POST /api/habits:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

