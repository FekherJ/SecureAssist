import { useState } from 'react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('http://localhost:8000/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.detail || 'API error');
      } else {
        setResponse(data.response);
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>SecureAssist Prototype</h1>
        <p>Type a security prompt and let the AI service answer.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">Prompt</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the project security risk or ask the ISP assistant..."
          rows="8"
        />
        <button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? 'Running...' : 'Run Prompt'}
        </button>
      </form>

      {error && <div className="alert error">{error}</div>}
      {response && (
        <section className="response-box">
          <h2>AI Response</h2>
          <pre>{response}</pre>
        </section>
      )}
    </div>
  );
}
