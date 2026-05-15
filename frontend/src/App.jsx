import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8000";
const DEFAULT_USE_CASE = "ISP_SECURITY_ANALYSIS";

export default function App() {
  const [activeTab, setActiveTab] = useState("analysis");

  const [projectDescription, setProjectDescription] = useState("");
  const [structuredAnalysis, setStructuredAnalysis] = useState(null);
  const [rawAnalysis, setRawAnalysis] = useState("");
  const [metadata, setMetadata] = useState(null);

  const [prompts, setPrompts] = useState([]);
  const [promptsLoading, setPromptsLoading] = useState(false);
  const [promptsError, setPromptsError] = useState("");
  const [expandedPromptIds, setExpandedPromptIds] = useState([]);

  const [newPrompt, setNewPrompt] = useState({
    name: "ISP Security Analysis Prompt",
    version: "",
    useCase: DEFAULT_USE_CASE,
    template: "",
    isActive: false,
  });
  const [createPromptLoading, setCreatePromptLoading] = useState(false);
  const [createPromptError, setCreatePromptError] = useState("");
  const [createPromptSuccess, setCreatePromptSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPrompts = async () => {
    setPromptsLoading(true);
    setPromptsError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/prompts?useCase=${DEFAULT_USE_CASE}`,
      );

      const data = await res.json();

      if (!res.ok) {
        setPromptsError(data.error || data.detail || "Failed to load prompts");
      } else {
        setPrompts(data);
      }
    } catch (err) {
      setPromptsError(err.message || "Network error");
    } finally {
      setPromptsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "prompts") {
      loadPrompts();
    }
  }, [activeTab]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStructuredAnalysis(null);
    setRawAnalysis("");
    setMetadata(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/security/analyze`, {
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

  const handleActivatePrompt = async (promptId) => {
    setPromptsError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/prompts/${promptId}/activate`,
        {
          method: "PATCH",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setPromptsError(
          data.error || data.detail || "Failed to activate prompt",
        );
        return;
      }

      await loadPrompts();
    } catch (err) {
      setPromptsError(err.message || "Network error");
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

  const normalizeRisk = (risk) => {
    if (typeof risk === "string") {
      return {
        title: risk,
        category: "General",
        severity: "Medium",
        impact: "",
        recommendedControl: "",
      };
    }

    return {
      title:
        risk.title ||
        risk.risk ||
        risk.name ||
        risk.description ||
        "Security risk",
      category: risk.category || risk.type || "General",
      severity: risk.severity || risk.level || "Medium",
      impact: risk.impact || risk.explanation || risk.description || "",
      recommendedControl:
        risk.recommendedControl ||
        risk.recommendation ||
        risk.mitigation ||
        risk.control ||
        "",
    };
  };

  const renderSecurityAnalysis = () => (
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

                      {!risk.impact && !risk.recommendedControl && (
                        <p className="empty-state">
                          No detailed impact or control returned.
                        </p>
                      )}
                    </div>
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

  const togglePromptPreview = (promptId) => {
    setExpandedPromptIds((currentIds) =>
      currentIds.includes(promptId)
        ? currentIds.filter((id) => id !== promptId)
        : [...currentIds, promptId],
    );
  };

  const handleNewPromptChange = (event) => {
    const { name, value, type, checked } = event.target;

    setNewPrompt((currentPrompt) => ({
      ...currentPrompt,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreatePrompt = async (event) => {
    event.preventDefault();
    setCreatePromptLoading(true);
    setCreatePromptError("");
    setCreatePromptSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/prompts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrompt),
      });

      const data = await res.json();

      if (!res.ok) {
        setCreatePromptError(
          data.error || data.detail || "Failed to create prompt",
        );
        return;
      }

      setCreatePromptSuccess(`Prompt ${data.version} created successfully.`);
      setNewPrompt({
        name: "ISP Security Analysis Prompt",
        version: "",
        useCase: DEFAULT_USE_CASE,
        template: "",
        isActive: false,
      });

      await loadPrompts();
    } catch (err) {
      setCreatePromptError(err.message || "Network error");
    } finally {
      setCreatePromptLoading(false);
    }
  };

  const renderPromptManagement = () => (
    <>
      <header>
        <h1>Prompt Management</h1>
        <p>
          Review and activate PostgreSQL-backed prompt templates used by the
          security analysis workflow.
        </p>
      </header>

      <div className="toolbar">
        <button type="button" onClick={loadPrompts} disabled={promptsLoading}>
          {promptsLoading ? "Refreshing..." : "Refresh prompts"}
        </button>
      </div>

      {promptsError && <div className="alert error">{promptsError}</div>}

      <section className="create-prompt-card">
        <h2>Create New Prompt Version</h2>

        <form onSubmit={handleCreatePrompt} className="prompt-form">
          <label htmlFor="promptName">Name</label>
          <input
            id="promptName"
            name="name"
            value={newPrompt.name}
            onChange={handleNewPromptChange}
            placeholder="ISP Security Analysis Prompt"
          />

          <label htmlFor="promptVersion">Version</label>
          <input
            id="promptVersion"
            name="version"
            value={newPrompt.version}
            onChange={handleNewPromptChange}
            placeholder="v3"
          />

          <label htmlFor="promptUseCase">Use case</label>
          <input
            id="promptUseCase"
            name="useCase"
            value={newPrompt.useCase}
            onChange={handleNewPromptChange}
            placeholder="ISP_SECURITY_ANALYSIS"
          />

          <label htmlFor="promptTemplate">Template</label>
          <textarea
            id="promptTemplate"
            name="template"
            value={newPrompt.template}
            onChange={handleNewPromptChange}
            placeholder="Write the prompt template here. Use {{projectDescription}} where the project description should be injected."
            rows="8"
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="isActive"
              checked={newPrompt.isActive}
              onChange={handleNewPromptChange}
            />
            Activate this prompt immediately
          </label>

          <button
            type="submit"
            disabled={
              createPromptLoading ||
              !newPrompt.name.trim() ||
              !newPrompt.version.trim() ||
              !newPrompt.useCase.trim() ||
              !newPrompt.template.trim()
            }
          >
            {createPromptLoading ? "Creating..." : "Create prompt version"}
          </button>
        </form>

        {createPromptError && (
          <div className="alert error">{createPromptError}</div>
        )}
        {createPromptSuccess && (
          <div className="alert success">{createPromptSuccess}</div>
        )}
      </section>

      <section className="prompt-list">
        {promptsLoading && <p className="empty-state">Loading prompts...</p>}

        {!promptsLoading && prompts.length === 0 && (
          <p className="empty-state">No prompt template found.</p>
        )}

        {prompts.map((prompt) => (
          <article className="prompt-card" key={prompt.id}>
            <div className="prompt-card-header">
              <div>
                <h2>{prompt.name}</h2>
                <p>{prompt.useCase}</p>
              </div>

              <span
                className={
                  prompt.isActive ? "status-active" : "status-inactive"
                }
              >
                {prompt.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="prompt-meta">
              <span>Version: {prompt.version}</span>
              <span>ID: {prompt.id}</span>
            </div>

            <div className="prompt-actions">
              <button
                type="button"
                onClick={() => togglePromptPreview(prompt.id)}
              >
                {expandedPromptIds.includes(prompt.id)
                  ? "Hide prompt"
                  : "Show prompt"}
              </button>

              {!prompt.isActive && (
                <button
                  type="button"
                  onClick={() => handleActivatePrompt(prompt.id)}
                >
                  Activate this prompt
                </button>
              )}
            </div>

            {expandedPromptIds.includes(prompt.id) && (
              <pre className="prompt-template-preview">{prompt.template}</pre>
            )}
          </article>
        ))}
      </section>
    </>
  );

  return (
    <div className="app-shell">
      <nav className="tabs">
        <button
          type="button"
          className={activeTab === "analysis" ? "tab-active" : ""}
          onClick={() => setActiveTab("analysis")}
        >
          Security Analysis
        </button>
        <button
          type="button"
          className={activeTab === "prompts" ? "tab-active" : ""}
          onClick={() => setActiveTab("prompts")}
        >
          Prompt Management
        </button>
      </nav>

      {activeTab === "analysis"
        ? renderSecurityAnalysis()
        : renderPromptManagement()}
    </div>
  );
}
