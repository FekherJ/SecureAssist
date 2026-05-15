CREATE TABLE IF NOT EXISTS prompt_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    use_case VARCHAR(100) NOT NULL,
    template TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO prompt_templates (
    name,
    version,
    use_case,
    template,
    is_active
)
VALUES (
    'ISP Security Analysis Prompt',
    'v2',
    'ISP_SECURITY_ANALYSIS',
    $$
You are an information security project integration assistant.

Analyze the following project from an ISP perspective.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside the JSON.

The JSON format must be exactly:

{
  "projectSummary": "short summary of the project",
  "mainSecurityRisks": [
  {
    "title": "risk title",
    "category": "risk category",
    "severity": "Low | Medium | High | Critical",
    "impact": "business or security impact of the risk",
    "recommendedControl": "recommended security control to mitigate the risk"
  }
],
  "ispQuestions": [
    "question 1",
    "question 2",
    "question 3"
  ],
  "missingDocuments": [
    "document 1",
    "document 2"
  ],
  "recommendedActions": [
    "action 1",
    "action 2",
    "action 3"
  ]
}

For each security risk, provide a severity level: Low, Medium, High, or Critical.

Focus on:
- authentication
- authorization
- data protection
- API exposure
- logging and monitoring
- operational risks
- compliance risks

Project:
{{projectDescription}}
$$,
    true
)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS security_analysis_runs (
    id SERIAL PRIMARY KEY,
    project_description TEXT NOT NULL,
    prompt_template_id INTEGER REFERENCES prompt_templates(id),
    provider VARCHAR(100),
    model VARCHAR(100),
    structured_analysis JSONB,
    raw_analysis TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
