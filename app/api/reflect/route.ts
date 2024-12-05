import { NextResponse } from "next/server"
import { Groq } from "groq-sdk"

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
    try {
        const { content } = await req.json()

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are an AI assistant that helps users reflect on their journal entries. Provide insightful and supportive reflections based on the user's input. Format your response in HTML, using appropriate tags for paragraphs, emphasis, and structure. Use bullet points for key insights and bold or italicize important keywords.",
                },
                {
                    role: "user",
                    content: `Please provide a thoughtful reflection on this journal entry, formatted in HTML with bullet points and emphasized keywords: "${content}"`,
                },
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.5,
            max_tokens: 500,
            top_p: 1,
            stream: false,
            stop: null,
        })

        const reflection = completion.choices[0]?.message?.content || "<p>Unable to generate reflection.</p>"

        return NextResponse.json({ reflection })
    } catch (error) {
        console.error("Error in reflect API:", error)
        return NextResponse.json({ error: "Failed to generate reflection" }, { status: 500 })
    }
}

