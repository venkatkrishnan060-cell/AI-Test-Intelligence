import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Charts from "./components/Charts";
import History from "./components/History";
import TestCaseGenerator from "./components/TestCaseGenerator";
import BugReportGenerator from "./components/BugReportGenerator";

function App() {
  const [log, setLog] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [history, setHistory] = useState(() => {
  const saved = localStorage.getItem("analysisHistory");
  return saved ? JSON.parse(saved) : [];
});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      setLog(e.target.result);
    };

    reader.readAsText(file);
  };

  const analyzeLog = async () => {
    if (!log.trim()) {
      alert("Please paste or upload a log first.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
       "https://ai-test-intelligence.onrender.com/analyze-log",
        {
          log: log,
        }
      );

      setResult(response.data);
      const newHistory = [
  {
    id: Date.now(),
    date: new Date().toLocaleString(),
    title: response.data.jiraTitle,
    severity: response.data.severity,
    data: response.data,
  },
  ...history,
];

setHistory(newHistory);

localStorage.setItem(
  "analysisHistory",
  JSON.stringify(newHistory)
);
    } catch (error) {
      console.error(error);
      alert("Error while analyzing log.");
    } finally {
      setLoading(false);
    }
  };

  const copyJira = async () => {
    if (!result) {
      alert("No analysis available.");
      return;
    }

    const jiraText = `
JIRA TITLE
${result.jiraTitle}

SEVERITY
${result.severity}

FAILURE CATEGORY
${result.failureCategory}

ROOT CAUSE
${result.rootCause}

SUGGESTED FIX
${result.suggestedFix}

DESCRIPTION
${result.jiraDescription}
`;

    await navigator.clipboard.writeText(jiraText);

    alert("✅ Jira copied successfully!");
  };

  const downloadPDF = () => {
    if (!result) {
      alert("No analysis available.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("AI TEST INTELLIGENCE REPORT", 20, 20);

    let y = 40;

    doc.setFontSize(12);

    doc.text(`Root Cause:`, 20, y);
    y += 8;
    doc.text(result.rootCause, 20, y);

    y += 15;
    doc.text(`Failure Category:`, 20, y);
    y += 8;
    doc.text(result.failureCategory, 20, y);

    y += 15;
    doc.text(`Severity:`, 20, y);
    y += 8;
    doc.text(result.severity, 20, y);

    y += 15;
    doc.text(`Suggested Fix:`, 20, y);
    y += 8;
    doc.text(result.suggestedFix, 20, y);

    y += 15;
    doc.text(`Jira Title:`, 20, y);
    y += 8;
    doc.text(result.jiraTitle, 20, y);

    y += 15;
    doc.text(`Jira Description:`, 20, y);
    y += 8;

    const lines = doc.splitTextToSize(result.jiraDescription, 170);
    doc.text(lines, 20, y);

    doc.save("AI_Test_Intelligence_Report.pdf");
  };

  return (
    <div className="container">
      <h1 className="title">
        🤖 AI Test Intelligence Platform
      </h1>

      <p className="subtitle">
    Analyze Playwright, Selenium & API Test Failures using AI
      </p>

            <Dashboard history={history} />

      <Charts history={history} />

      <TestCaseGenerator/>
      <BugReportGenerator />

          <History
      history={history}
      setResult={setResult}
      search={search}
      setSearch={setSearch}
    />
      <button
  onClick={() => {
    localStorage.removeItem("analysisHistory");
    setHistory([]);
  }}
>
  🗑 Clear History
</button>

<div className="card">

        <h2>📂 Upload or Paste Log</h2>

        <input
          type="file"
          accept=".txt,.log,.json"
          onChange={handleFileUpload}
        />

        <br /><br />

        <textarea
          placeholder="Paste Playwright / Selenium / API Log..."
          value={log}
          onChange={(e) => setLog(e.target.value)}
        />

        <br /><br />

        <button onClick={analyzeLog}>
          {loading ? "🤖 AI is Analyzing..." : "🚀 Analyze with AI"}
        </button>

      </div>

      <div className="card">

        <h2>📋 AI Analysis</h2>

        {!result ? (

          <p>No analysis yet.</p>

        ) : (

          <>

            <div className="analysis-item">
              <h3>🔍 Root Cause</h3>
              <p>{result.rootCause}</p>
            </div>

            <div className="analysis-item">
              <h3>📂 Failure Category</h3>
              <p>{result.failureCategory}</p>
            </div>

            <div className="analysis-item">
              <h3>⚠️ Severity</h3>
              <p>{result.severity}</p>
            </div>

            <div className="analysis-item">
              <h3>🛠 Suggested Fix</h3>
              <p>{result.suggestedFix}</p>
            </div>

            <div className="analysis-item">
              <h3>🐞 Jira Title</h3>
              <p>{result.jiraTitle}</p>
            </div>

            <div className="analysis-item">
              <h3>📝 Jira Description</h3>
              <p>{result.jiraDescription}</p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "25px",
                flexWrap: "wrap",
              }}
            >
              <button onClick={copyJira}>
                📋 Copy Jira
              </button>

              <button onClick={downloadPDF}>
                📄 Download PDF
              </button>
            </div>

          </>

        )}

      </div>

      <div className="footer">
        Built with ❤️ using React + FastAPI + Gemini AI
      </div>

    </div>
  );
}

export default App;