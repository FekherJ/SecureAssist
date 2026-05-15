import { useEffect, useState } from "react";

import {
  activatePrompt,
  createPrompt,
  fetchPrompts,
  deletePrompt,
} from "../../api/promptApi";
import CreatePromptForm from "../../components/CreatePromptForm";
import PromptCard from "../../components/PromptCard";

const DEFAULT_USE_CASE = "ISP_SECURITY_ANALYSIS";

export default function PromptManagement() {
  const [prompts, setPrompts] = useState([]);
  const [expandedPromptIds, setExpandedPromptIds] = useState([]);
  const [promptsLoading, setPromptsLoading] = useState(false);
  const [promptsError, setPromptsError] = useState("");

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

  const loadPrompts = async () => {
    setPromptsLoading(true);
    setPromptsError("");

    try {
      const data = await fetchPrompts(DEFAULT_USE_CASE);

      setPrompts(
        [...data].sort((a, b) => {
          if (a.isActive === b.isActive) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }

          return a.isActive ? -1 : 1;
        }),
      );
    } catch (err) {
      setPromptsError(err.message || "Network error");
    } finally {
      setPromptsLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  const handleActivatePrompt = async (promptId) => {
    setPromptsError("");

    try {
      await activatePrompt(promptId);
      await loadPrompts();
    } catch (err) {
      setPromptsError(err.message || "Network error");
    }
  };

  const handleDeletePrompt = async (promptId) => {
    setPromptsError("");

    const confirmed = window.confirm(
      "Delete this inactive prompt version? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePrompt(promptId);
      await loadPrompts();
    } catch (err) {
      setPromptsError(err.message || "Network error");
    }
  };

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
      const data = await createPrompt(newPrompt);

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

  return (
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

      <CreatePromptForm
        newPrompt={newPrompt}
        loading={createPromptLoading}
        error={createPromptError}
        success={createPromptSuccess}
        onChange={handleNewPromptChange}
        onSubmit={handleCreatePrompt}
      />

      <section className="prompt-list">
        {promptsLoading && <p className="empty-state">Loading prompts...</p>}

        {!promptsLoading && prompts.length === 0 && (
          <p className="empty-state">No prompt template found.</p>
        )}

        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            isExpanded={expandedPromptIds.includes(prompt.id)}
            onTogglePreview={togglePromptPreview}
            onActivate={handleActivatePrompt}
            onDelete={handleDeletePrompt}
          />
        ))}
      </section>
    </>
  );
}
