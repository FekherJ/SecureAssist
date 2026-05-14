import { useState } from "react";

export default function App() {
  const [projectDescription, setProjectDescription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setAnalysis("");
    setMetadata(null);

    try {
      const res = await fetch("http://localhost:8000/api/security/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectDescription }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.detail || "API error");
      } else {
        setAnalysis(data.analysis);
        setMetadata({
          workflow: data.workflow,
          provider: data.provider,
          model: data.model,
        });
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>SecureAssist - ISP Security Assistant</h1>
        <p>
          Describe a project and generate an initial security analysis using a
          local AI model.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <label htmlFor="projectDescription">Project description</label>
        <textarea
          id="projectDescription"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="Example: A banking team wants to expose a new internal API that allows applications to access customer transaction history."
          rows="8"
        />

        <button type="submit" disabled={loading || !projectDescription.trim()}>
          {loading ? "Analyzing..." : "Run ISP Security Analysis"}
        </button>
      </form>

      {error && <div className="alert error">{error}</div>}

      {analysis && (
        <section className="response-box">
          <h2>Security Analysis Result</h2>

          {metadata && (
            <div className="metadata">
              <span>Workflow: {metadata.workflow}</span>
              <span>Provider: {metadata.provider}</span>
              <span>Model: {metadata.model}</span>
            </div>
          )}

          <pre>{analysis}</pre>
        </section>
      )}
    </div>
  );
}
