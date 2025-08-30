import { db } from "@/utils/db";
import { DailyQuestion } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { chatSession } from "@/utils/GeminiAIModal"; // Gemini API

// function to get today's daily question
export async function getDailyQuestion() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // check if today's question exists
  const existing = await db
    .select()
    .from(DailyQuestion)
    .where(eq(DailyQuestion.questionDate, today));

  if (existing.length > 0) {
    return existing[0]; // return today's question
  }

  // if not exists, generate from Gemini
  const prompt = `Generate a coding interview question with its answer, category, and difficulty. Format JSON: { "question": "...", "answer": "...", "category": "...", "difficulty": "Easy/Medium/Hard" }`;

  const response = await chatSession.sendMessage(prompt);
  const rawText = await response.response.text();

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    const match = rawText.match(/\{[\s\S]*\}/);
    data = match ? JSON.parse(match[0]) : null;
  }

  if (!data) {
    throw new Error("Gemini failed to return valid JSON");
  }

  // insert new daily question
  const inserted = await db
    .insert(DailyQuestion)
    .values({
      question: data.question,
      answer: data.answer,
      category: data.category,
      difficulty: data.difficulty,
      createdBy: "Gemini AI",
      questionDate: today,
    })
    .returning();

  return inserted[0];
}
