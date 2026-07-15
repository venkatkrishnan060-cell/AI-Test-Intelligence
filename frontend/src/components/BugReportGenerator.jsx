import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function BugReportGenerator() {
  const [feature, setFeature] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  // ==========================
  // Generate Bug Report
  // ==========================

  const generateBug = async () => {
    if (!feature || !issue) {
      alert("Please enter Feature and Issue.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "https://ai-test-intelligence.onrender.com/generate-bug-report",
        {
          feature,
          issue,
        }
      );

      setReport(res.data);
    } catch (err) {
      console.error(err);
      alert("Unable to generate bug report.");
    }

    setLoading(false);
  };

  // ==========================
  // Download PDF
  // ==========================

  const downloadPDF = () => {
    if (!report) return;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("AI Test Intelligence Platform", 20, y);

    y += 10;

    doc.setFontSize(16);
    doc.text("Professional Bug Report", 20, y);

    y += 15;

    doc.setFontSize(12);

    doc.text(`Bug ID: ${report.bugId}`, 20, y);
    y += 10;

    doc.text(`Title: ${report.title}`, 20, y);
    y += 10;

    doc.text(`Module: ${report.module}`, 20, y);
    y += 10;

    doc.text(`Environment: ${report.environment}`, 20, y);
    y += 10;

    doc.text(`Severity: ${report.severity}`, 20, y);
    y += 10;

    doc.text(`Priority: ${report.priority}`, 20, y);
    y += 10;

    doc.text("Preconditions:", 20, y);
    y += 8;

    const pre = doc.splitTextToSize(report.preconditions, 170);
    doc.text(pre, 25, y);

    y += pre.length * 7 + 5;

    doc.text("Steps to Reproduce:", 20, y);
    y += 8;

    report.steps.forEach((step, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${step}`, 165);
      doc.text(lines, 25, y);
      y += lines.length * 7;
    });

    y += 5;

    doc.text("Expected Result:", 20, y);
    y += 8;

    const expected = doc.splitTextToSize(report.expectedResult, 170);
    doc.text(expected, 25, y);

    y += expected.length * 7 + 5;

    doc.text("Actual Result:", 20, y);
    y += 8;

    const actual = doc.splitTextToSize(report.actualResult, 170);
    doc.text(actual, 25, y);

    y += actual.length * 7 + 5;

    doc.text("Root Cause:", 20, y);
    y += 8;

    const root = doc.splitTextToSize(report.rootCause, 170);
    doc.text(root, 25, y);

    y += root.length * 7 + 5;

    doc.text("Suggested Fix:", 20, y);
    y += 8;

    const fix = doc.splitTextToSize(report.suggestedFix, 170);
    doc.text(fix, 25, y);

    doc.save(`${report.bugId}.pdf`);
  };

  const copyReport = async () => {

  if (!report) return;

  const text = `
Bug ID: ${report.bugId}

Title: ${report.title}

Module: ${report.module}

Environment: ${report.environment}

Severity: ${report.severity}

Priority: ${report.priority}

Preconditions:
${report.preconditions}

Steps:
${report.steps.join("\n")}

Expected Result:
${report.expectedResult}

Actual Result:
${report.actualResult}

Root Cause:
${report.rootCause}

Suggested Fix:
${report.suggestedFix}
`;

  await navigator.clipboard.writeText(text);

  alert("✅ Bug report copied to clipboard.");
};

  return (
    <div className="card">
      <h2>🐞 AI Bug Report Generator</h2>

      <input
        type="text"
        placeholder="Feature (Example: Login Page)"
        value={feature}
        onChange={(e) => setFeature(e.target.value)}
      />

      <br />
      <br />

      <textarea
        placeholder="Describe the observed issue..."
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
      />

      <br />
      <br />

      <button onClick={generateBug}>
        {loading
          ? "🤖 Generating Professional Bug Report..."
          : "🐞 Generate Bug Report"}
      </button>

      <br />
      <br />

      {report && (
        <>
                    <div
            style={{
                marginBottom: "20px",
                display: "flex",
                gap: "15px",
            }}
            >

            <button onClick={downloadPDF}>
                📄 Download PDF
            </button>

            <button onClick={copyReport}>
                📋 Copy Report
            </button>

            </div>

          <div className="bug-report-card">
            <h2>🐞 AI Bug Report</h2>

            <div className="bug-item">
              <strong>🆔 Bug ID</strong>
              <p>{report.bugId}</p>
            </div>

            <div className="bug-item">
              <strong>📝 Title</strong>
              <p>{report.title}</p>
            </div>

            <div className="bug-item">
              <strong>📦 Module</strong>
              <p>{report.module}</p>
            </div>

            <div className="bug-item">
              <strong>🌍 Environment</strong>
              <p>{report.environment}</p>
            </div>

            <div className="bug-item">
              <strong>🔥 Severity</strong>
              <span
                className={`severity-badge ${report.severity.toLowerCase()}`}
              >
                {report.severity}
              </span>
            </div>

            <div className="bug-item">
              <strong>⭐ Priority</strong>
              <span
                className={`priority-badge ${report.priority.toLowerCase()}`}
              >
                {report.priority}
              </span>
            </div>

            <div className="bug-item">
              <strong>📋 Preconditions</strong>
              <p>{report.preconditions}</p>
            </div>

            <div className="bug-item">
              <strong>👣 Steps to Reproduce</strong>

              <ol>
                {report.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="bug-item">
              <strong>✅ Expected Result</strong>
              <p>{report.expectedResult}</p>
            </div>

            <div className="bug-item">
              <strong>❌ Actual Result</strong>
              <p>{report.actualResult}</p>
            </div>

            <div className="bug-item">
              <strong>🔍 Root Cause</strong>
              <p>{report.rootCause}</p>
            </div>

            <div className="bug-item">
              <strong>🛠 Suggested Fix</strong>
              <p>{report.suggestedFix}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BugReportGenerator;