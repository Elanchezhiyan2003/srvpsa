"use client";

import { create } from "zustand";

interface ExamAnswer {
  selected: string[];
  markedForReview: boolean;
}

interface ExamState {
  currentQuestion: number;
  answers: Record<string, ExamAnswer>;
  autoSavedAt: string;
  setCurrentQuestion: (index: number) => void;
  answerQuestion: (questionId: string, optionId: string, multi?: boolean) => void;
  markForReview: (questionId: string) => void;
  reset: () => void;
}

export const useExamStore = create<ExamState>((set) => ({
  currentQuestion: 0,
  answers: {},
  autoSavedAt: "Just now",
  setCurrentQuestion: (index) => set({ currentQuestion: index }),
  answerQuestion: (questionId, optionId, multi = false) =>
    set((state) => {
      const existing = state.answers[questionId] ?? { selected: [], markedForReview: false };
      const selected = multi
        ? existing.selected.includes(optionId)
          ? existing.selected.filter((id) => id !== optionId)
          : [...existing.selected, optionId]
        : [optionId];

      return {
        answers: {
          ...state.answers,
          [questionId]: { ...existing, selected }
        },
        autoSavedAt: "Now"
      };
    }),
  markForReview: (questionId) =>
    set((state) => {
      const existing = state.answers[questionId] ?? { selected: [], markedForReview: false };
      return {
        answers: {
          ...state.answers,
          [questionId]: { ...existing, markedForReview: !existing.markedForReview }
        },
        autoSavedAt: "Now"
      };
    }),
  reset: () => set({ currentQuestion: 0, answers: {}, autoSavedAt: "Just now" })
}));
