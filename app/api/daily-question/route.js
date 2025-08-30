import { NextResponse } from "next/server";
import { db } from "@/utils/db"; 
import { DailyQuestion } from "@/utils/schema"; 
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];

    // check if today's question exists
    const existing = await db
      .select()
      .from(DailyQuestion)
      .where(eq(DailyQuestion.questionDate, today));

    if (existing.length > 0) {
      return NextResponse.json(existing[0]);
    }

    // If not found -> generate new question
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a coding interview style daily challenge with:
    - question
    - answer
    - category (DSA/Algo/System Design/etc.)
    - difficulty (Easy, Medium, Hard).
    Respond strictly in JSON format:
    {
      "question": "...",
      "answer": "...",
      "category": "...",
      "difficulty": "..."
    }`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    }

    const inserted = await db
      .insert(DailyQuestion)
      .values({
        question: parsed.question,
        answer: parsed.answer,
        category: parsed.category,
        difficulty: parsed.difficulty,
        createdBy: "Gemini AI",
        questionDate: today,
      })
      .returning();

    return NextResponse.json(inserted[0]);
  } catch (err) {
    console.error("Error in /api/daily-question:", err);
    return NextResponse.json(
      { error: "Failed to fetch daily challenge" },
      { status: 500 }
    );
  }
}
