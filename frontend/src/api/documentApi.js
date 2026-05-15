const API_BASE_URL = "http://localhost:8000";

export async function fetchDocuments() {
  const res = await fetch(`${API_BASE_URL}/api/documents`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.detail || "Failed to load documents");
  }

  return data;
}

export async function createDocument(document) {
  const res = await fetch(`${API_BASE_URL}/api/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(document),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.detail || "Failed to create document");
  }

  return data;
}

export async function deleteDocument(documentId) {
  const res = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.detail || "Failed to delete document");
  }

  return data;
}
