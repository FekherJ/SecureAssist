export function normalizeRisk(risk) {
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
}
