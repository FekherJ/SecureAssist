import { useState } from "react";

import Tabs from "./components/Tabs";
import AnalysisHistory from "./features/analysis-history/AnalysisHistory";
import PromptManagement from "./features/prompt-management/PromptManagement";
import SecurityAnalysis from "./features/security-analysis/SecurityAnalysis";

export default function App() {
  const [activeTab, setActiveTab] = useState("analysis");

  return (
    <div className="app-shell">
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "analysis" && <SecurityAnalysis />}
      {activeTab === "prompts" && <PromptManagement />}
      {activeTab === "history" && <AnalysisHistory />}
    </div>
  );
}
