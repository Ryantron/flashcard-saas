import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards based on the subject of the text. 
Make sure to create exactly 12 flashcards.
Both front and back should be one sentence long. 
Front of the card should be test question based on the given subject.
Back of the card should be answers to its respective front questions.
You MUST respond with JSON objects, and nothing else.
You MUST return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

// Configure OpenAI client with base URL and API key
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, // Use environment variable for API key
});

export async function POST(req) {
  const data = await req.text();

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: data },
    ],
    model: "meta-llama/llama-3.1-8b-instruct:free",
    response_format: { type: "json_object" },
  });

  // Parse the JSON response from the OpenAI API
  const flashcards = JSON.parse(completion.choices[0].message.content);

  // Return the flashcards as a JSON response
  return NextResponse.json(flashcards.flashcards);
}
