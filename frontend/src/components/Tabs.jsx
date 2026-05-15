export default function Tabs({ activeTab, onTabChange }) {
  return (
    <nav className="tabs">
      <button
        type="button"
        className={activeTab === "analysis" ? "tab-active" : ""}
        onClick={() => onTabChange("analysis")}
      >
        Security Analysis
      </button>

      <button
        type="button"
        className={activeTab === "prompts" ? "tab-active" : ""}
        onClick={() => onTabChange("prompts")}
      >
        Prompt Management
      </button>

      <button
        type="button"
        className={activeTab === "history" ? "tab-active" : ""}
        onClick={() => onTabChange("history")}
      >
        Analysis History
      </button>

      <button
        type="button"
        className={activeTab === "documents" ? "tab-active" : ""}
        onClick={() => onTabChange("documents")}
      >
        Document Management
      </button>
    </nav>
  );
}
