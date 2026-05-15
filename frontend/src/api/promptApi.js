const API_BASE_URL = "http://localhost:8000";
const DEFAULT_USE_CASE = "ISP_SECURITY_ANALYSIS";

export async function fetchPrompts(useCase = DEFAULT_USE_CASE) {
  const res = await fetch(`${API_BASE_URL}/api/prompts?useCase=${useCase}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.detail || "Failed to load prompts");
  }

  return data;
}

export async function activatePrompt(promptId) {
  const res = await fetch(`${API_BASE_URL}/api/prompts/${promptId}/activate`, {
    method: "PATCH",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.detail || "Failed to activate prompt");
  }

  return data;
}

export async function createPrompt(prompt) {
  const res = await fetch(`${API_BASE_URL}/api/prompts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prompt),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.detail || "Failed to create prompt");
  }

  return data;
}

export async function deletePrompt(promptId) {
  const res = await fetch(`${API_BASE_URL}/api/prompts/${promptId}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.detail || "Failed to delete prompt");
  }

  return data;
}
