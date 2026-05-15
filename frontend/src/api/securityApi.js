const API_BASE_URL = "http://localhost:8000";

export async function analyzeProjectSecurity(projectDescription) {
  const res = await fetch(`${API_BASE_URL}/api/security/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectDescription }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.detail || "API error");
  }

  return data;
}
