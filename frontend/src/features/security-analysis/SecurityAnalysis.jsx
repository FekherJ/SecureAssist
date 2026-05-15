import { useState } from "react";

import { analyzeProjectSecurity } from "../../api/securityApi";
import MetadataBadges from "../../components/MetadataBadges";
import RiskCard from "../../components/RiskCard";
import { normalizeRisk } from "../../utils/normalizeRisk";

export default function SecurityAnalysis() {
  const [projectDescription, setProjectDescription] = useState("");
  const [structuredAnalysis, setStructuredAnalysis] = useState(null);
  const [rawAnalysis, setRawAnalysis] = useState("");
  const [metadata, setMetadata] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStructuredAnalysis(null);
    setRawAnalysis("");
    setMetadata(null);

    try {
      const data = await analyzeProjectSecurity(projectDescription);

      setStructuredAnalysis(data.structuredAnalysis);
      setRawAnalysis(data.analysis);
      setMetadata({
        workflow: data.workflow,
        provider: data.provider,
        model: data.model,
        promptTemplate: data.promptTemplate,
      });
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

      <MetadataBadges metadata={metadata} />

      {structuredAnalysis ? (
        <section className="analysis-grid">
          <article className="analysis-card">
            <h2>Project Summary</h2>
            <p>
              {structuredAnalysis.projectSummary ||
                structuredAnalysis.summary ||
                "No project summary returned."}
            </p>
          </article>

          <article className="analysis-card">
            <h2>Main Security Risks</h2>

            {structuredAnalysis.mainSecurityRisks &&
            structuredAnalysis.mainSecurityRisks.length > 0 ? (
              <div className="risk-list">
                {structuredAnalysis.mainSecurityRisks.map((rawRisk, index) => {
                  const risk = normalizeRisk(rawRisk);

                  return (
                    <RiskCard
                      risk={risk}
                      index={index}
                      key={`${risk.title}-${index}`}
                    />
                  );
                })}
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
    </>
  );
}
