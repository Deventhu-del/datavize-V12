import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const { messages, model = "gpt-4o", chatId, stream = false } = await request.json();

    // Get API key from environment
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    // Prepare the request to OpenRouter
    const openRouterRequest = {
      model,
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant. When providing responses, use markdown formatting to make your answers clear and well-structured. Use headings, lists, code blocks, tables, and other markdown elements when appropriate to organize information effectively."
        },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        }))
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: stream,
    };

    // Make request to OpenRouter
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "AI Agent Chat",
      },
      body: JSON.stringify(openRouterRequest),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get response from OpenRouter" },
        { status: response.status }
      );
    }

    // If streaming is requested, return the stream
    if (stream) {
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // For non-streaming requests, return JSON response
    const data = await response.json();
    
    // Extract the assistant's response
    const assistantMessage = data.choices?.[0]?.message;
    if (!assistantMessage) {
      return NextResponse.json(
        { error: "Invalid response from OpenRouter" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      content: assistantMessage.content,
      model: data.model,
      usage: data.usage,
    });

  } catch (error) {
    console.error("Error in OpenRouter API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
