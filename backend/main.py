from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from schemas import LogRequest
from ai_service import (
    analyze_test_log,
    generate_test_cases,
    generate_bug_report,
)

# ==========================================================
# FastAPI App
# ==========================================================

app = FastAPI(
    title="AI Test Intelligence Platform",
    version="2.0.0",
)

# ==========================================================
# CORS Configuration
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-test-intelligence.vercel.app",
        "https://ai-test-intelligence-3iboegmbf-mk-venkateswara-rao.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# Home
# ==========================================================

@app.get("/")
def home():
    return {
        "message": "AI Test Intelligence Platform Running 🚀"
    }

# ==========================================================
# Request Models
# ==========================================================

class TestCaseRequest(BaseModel):
    feature: str


class BugReportRequest(BaseModel):
    feature: str
    issue: str

# ==========================================================
# AI Log Analyzer
# ==========================================================

@app.post("/analyze-log")
def analyze_log(request: LogRequest):
    result = analyze_test_log(request.log)
    return result.model_dump()

# ==========================================================
# AI Test Case Generator
# ==========================================================

@app.post("/generate-testcases")
def generate_testcases(request: TestCaseRequest):
    return generate_test_cases(request.feature)

# ==========================================================
# AI Bug Report Generator
# ==========================================================

@app.post("/generate-bug-report")
def generate_bug(request: BugReportRequest):
    return generate_bug_report(
        request.feature,
        request.issue,
    )