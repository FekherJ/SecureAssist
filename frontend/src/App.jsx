import { useState } from "react";

export default function App() {
  const [projectDescription, setProjectDescription] = useState("");
  const [structuredAnalysis, setStructuredAnalysis] = useState(null);
  const [rawAnalysis, setRawAnalysis] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStructuredAnalysis(null);
    setRawAnalysis("");
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
        setStructuredAnalysis(data.structuredAnalysis);
        setRawAnalysis(data.analysis);
        setMetadata({
          workflow: data.workflow,
          provider: data.provider,
          model: data.model,
          promptTemplate: data.promptTemplate,
        });
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const renderList = (items) => {
    if (!items || items.length === 0) {
      return <p className="empty-state">No item returned.</p>;
    }

    return (
      <ul>
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    );
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

      {metadata && (
        <div className="metadata">
          <span>Workflow: {metadata.workflow}</span>
          <span>Provider: {metadata.provider}</span>
          <span>Model: {metadata.model}</span>

          {metadata.promptTemplate && (
            <span>
              Prompt: {metadata.promptTemplate.name}{" "}
              {metadata.promptTemplate.version}
            </span>
          )}
        </div>
      )}

      {structuredAnalysis ? (
        <section className="analysis-grid">
          <article className="analysis-card">
            <h2>Project Summary</h2>
            <p>{structuredAnalysis.projectSummary}</p>
          </article>

          <article className="analysis-card">
            <h2>Main Security Risks</h2>

            {structuredAnalysis.mainSecurityRisks &&
            structuredAnalysis.mainSecurityRisks.length > 0 ? (
              <div className="risk-list">
                {structuredAnalysis.mainSecurityRisks.map((risk, index) => (
                  <div className="risk-item" key={`${risk.title}-${index}`}>
                    <div className="risk-header">
                      <div>
                        <h3>{risk.title}</h3>
                        {risk.category && (
                          <p className="risk-category">{risk.category}</p>
                        )}
                      </div>
                      <span
                        className={`severity severity-${risk.severity?.toLowerCase()}`}
                      >
                        {risk.severity}
                      </span>
                    </div>

                    {risk.impact && (
                      <div className="risk-detail">
                        <strong>Impact:</strong>
                        <p>{risk.impact}</p>
                      </div>
                    )}

                    {risk.recommendedControl && (
                      <div className="risk-detail">
                        <strong>Recommended control:</strong>
                        <p>{risk.recommendedControl}</p>
                      </div>
                    )}

                    {!risk.impact &&
                      !risk.recommendedControl &&
                      risk.explanation && <p>{risk.explanation}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No risk returned.</p>
            )}
          </article>

          <article className="analysis-card">
            <h2>ISP Questions</h2>
            {renderList(structuredAnalysis.ispQuestions)}
          </article>

          <article className="analysis-card">
            <h2>Missing Documents</h2>
            {renderList(structuredAnalysis.missingDocuments)}
          </article>

          <article className="analysis-card">
            <h2>Recommended Actions</h2>
            {renderList(structuredAnalysis.recommendedActions)}
          </article>
        </section>
      ) : (
        rawAnalysis && (
          <section className="response-box">
            <h2>Raw AI Response</h2>
            <pre>{rawAnalysis}</pre>
          </section>
        )
      )}
    </div>
  );
}
