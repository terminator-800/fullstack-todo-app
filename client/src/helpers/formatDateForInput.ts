// src/helpers/formatDateForInput.ts
export function formatDateForInput(dateStr?: string): string {
  if (!dateStr) return "";
  return dateStr.split("T")[0]; // "2026-07-24T00:00:00.000Z" → "2026-07-24"
}