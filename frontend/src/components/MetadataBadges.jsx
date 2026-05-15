export default function MetadataBadges({ metadata }) {
  if (!metadata) {
    return null;
  }

  return (
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
  );
}
