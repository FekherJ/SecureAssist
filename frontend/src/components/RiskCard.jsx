export default function RiskCard({ risk, index }) {
  return (
    <div className="risk-item" key={`${risk.title}-${index}`}>
      <div className="risk-header">
        <div>
          <h3>{risk.title}</h3>
          {risk.category && <p className="risk-category">{risk.category}</p>}
        </div>

        <span className={`severity severity-${risk.severity?.toLowerCase()}`}>
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

      {!risk.impact && !risk.recommendedControl && risk.explanation && (
        <p>{risk.explanation}</p>
      )}

      {!risk.impact && !risk.recommendedControl && !risk.explanation && (
        <p className="empty-state">No detailed impact or control returned.</p>
      )}
    </div>
  );
}
