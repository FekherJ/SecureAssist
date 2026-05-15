import { useEffect, useState } from "react";

import { fetchSecurityAnalysisHistory } from "../../api/securityHistoryApi";
import RiskCard from "../../components/RiskCard";
import { normalizeRisk } from "../../utils/normalizeRisk";

export default function AnalysisHistory() {
  const [history, setHistory] = useState([]);
  const [expandedRunIds, setExpandedRunIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchSecurityAnalysisHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const toggleRun = (runId) => {
    setExpandedRunIds((currentIds) =>
      currentIds.includes(runId)
        ? currentIds.filter((id) => id !== runId)
        : [...currentIds, runId],
    );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Unknown date";
    }

    return new Date(dateValue).toLocaleString();
  };

  return (
    <>
      <header>
        <h1>Analysis History</h1>
        <p>
          Review previously generated security analyses saved in PostgreSQL.
        </p>
      </header>

      <div className="toolbar">
        <button type="button" onClick={loadHistory} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh history"}
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <section className="history-list">
        {loading && <p className="empty-state">Loading history...</p>}

        {!loading && history.length === 0 && (
          <p className="empty-state">No analysis history found.</p>
        )}

        {history.map((run) => {
          const isExpanded = expandedRunIds.includes(run.id);
          const analysis = run.structuredAnalysis || {};

          return (
            <article className="history-card" key={run.id}>
              <div className="history-card-header">
                <div>
                  <h2>Analysis #{run.id}</h2>
                  <p>{formatDate(run.createdAt)}</p>
                </div>

                <span className="history-model">
                  {run.provider} / {run.model}
                </span>
              </div>

              <div className="history-description">
                <strong>Project description:</strong>
                <p>{run.projectDescription}</p>
              </div>

              <div className="prompt-meta">
                <span>Prompt template ID: {run.promptTemplateId}</span>
              </div>

              <div className="prompt-actions">
                <button type="button" onClick={() => toggleRun(run.id)}>
                  {isExpanded ? "Hide analysis" : "Show analysis"}
                </button>
              </div>

              {isExpanded && (
                <div className="history-details">
                  <article className="analysis-card">
                    <h2>Project Summary</h2>
                    <p>
                      {analysis.projectSummary ||
                        analysis.summary ||
                        "No project summary returned."}
                    </p>
                  </article>

                  <article className="analysis-card">
                    <h2>Main Security Risks</h2>

                    {analysis.mainSecurityRisks &&
                    analysis.mainSecurityRisks.length > 0 ? (
                      <div className="risk-list">
                        {analysis.mainSecurityRisks.map((rawRisk, index) => {
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
                    {analysis.ispQuestions &&
                    analysis.ispQuestions.length > 0 ? (
                      <ul>
                        {analysis.ispQuestions.map((question, index) => (
                          <li key={`${question}-${index}`}>{question}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="empty-state">No question returned.</p>
                    )}
                  </article>

                  <article className="analysis-card">
                    <h2>Missing Documents</h2>
                    {analysis.missingDocuments &&
                    analysis.missingDocuments.length > 0 ? (
                      <ul>
                        {analysis.missingDocuments.map((document, index) => (
                          <li key={`${document}-${index}`}>{document}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="empty-state">
                        No missing document returned.
                      </p>
                    )}
                  </article>

                  <article className="analysis-card">
                    <h2>Recommended Actions</h2>
                    {analysis.recommendedActions &&
                    analysis.recommendedActions.length > 0 ? (
                      <ul>
                        {analysis.recommendedActions.map((action, index) => (
                          <li key={`${action}-${index}`}>{action}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="empty-state">No action returned.</p>
                    )}
                  </article>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </>
  );
}
