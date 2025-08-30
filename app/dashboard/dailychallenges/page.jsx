"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function DailyQuestionCard() {
  const [question, setQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    async function fetchQuestion() {
      const res = await fetch("/api/daily-question");
      const data = await res.json();
      setQuestion(data);
    }
    fetchQuestion();
  }, []);

  if (!question) return <p>Loading daily challenge...</p>;

  return (
    <div className="p-6 border rounded-2xl shadow-lg bg-white max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">🔥 Daily Challenge</h2>
      <p className="mt-3 text-lg text-gray-700">{question.question}</p>

      <div className="mt-4">
        {!showAnswer ? (
          <Button onClick={() => setShowAnswer(true)} className="mt-2">Show Answer</Button>
        ) : (
          <div className="mt-2 p-3 rounded-lg bg-gray-100 border">
            <p className="text-gray-800 font-semibold">Answer:</p>
            <p className="text-gray-700">{question.answer}</p>
            <Button onClick={() => setShowAnswer(false)} variant="outline" size="sm" className="mt-2">
              Hide Answer
            </Button>
          </div>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-500">
        Category: <span className="font-medium">{question.category}</span> | Difficulty:{" "}
        <span className="font-medium">{question.difficulty}</span>
      </p>
    </div>
  );
}
