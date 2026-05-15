const API_BASE_URL = "http://localhost:8000";

export async function fetchSecurityAnalysisHistory() {
  const res = await fetch(`${API_BASE_URL}/api/security/history`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || data.detail || "Failed to load security analysis history",
    );
  }

  return data;
}

export async function fetchSecurityAnalysisHistoryItem(id) {
  const res = await fetch(`${API_BASE_URL}/api/security/history/${id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error ||
        data.detail ||
        "Failed to load security analysis history item",
    );
  }

  return data;
}
