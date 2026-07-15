import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as XLSX from "xlsx";

function TestCaseGenerator() {

    const [feature, setFeature] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    // ==========================
    // Generate Test Cases
    // ==========================

    const generate = async () => {

        if (!feature) return;

        setLoading(true);

        try {

            const res = await axios.post(
                "http://127.0.0.1:8000/generate-testcases",
                {
                    feature
                }
            );

            setResult(res.data.testCases);

        } catch (err) {

            console.error(err);

            if (err.response) {
                alert(JSON.stringify(err.response.data));
            } else {
                alert(err.message);
            }

        }

        setLoading(false);
    };

    // ==========================
    // Export Excel
    // ==========================

    const exportExcel = () => {

        if (!result) {
            alert("Generate test cases first.");
            return;
        }

        const rows = [];

        const lines = result.split("\n");

        lines.forEach((line) => {

            if (line.trim().startsWith("|")) {

                const cols = line
                    .split("|")
                    .map(c => c.trim())
                    .filter(c => c !== "");

                // Skip separator row
                if (
                    cols.length > 0 &&
                    cols.every(col => col.includes("---"))
                ) {
                    return;
                }

                rows.push(cols);

            }

        });

        if (rows.length === 0) {
            alert("No markdown table found.");
            return;
        }

        const worksheet = XLSX.utils.aoa_to_sheet(rows);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Test Cases"
        );

        XLSX.writeFile(
            workbook,
            "AI_TestCases.xlsx"
        );

    };

    return (

        <div className="card">

            <h2>🧠 AI Test Case Generator</h2>

            <textarea
                placeholder="Example: Login Page with Email & Password"
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
            />

            <br /><br />

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "20px"
                }}
            >

                <button onClick={generate}>
                    {loading ? "Generating..." : "Generate Test Cases"}
                </button>

                {result && (
                    <button onClick={exportExcel}>
                        📊 Export Excel
                    </button>
                )}

            </div>

            <div className="testcase-output">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result}
                </ReactMarkdown>
            </div>

        </div>

    );

}

export default TestCaseGenerator;