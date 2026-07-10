import { apiFetch } from "./client";

export async function getHealth() {
  return apiFetch("/health");
}