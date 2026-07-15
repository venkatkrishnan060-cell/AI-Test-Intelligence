from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from schemas import (
    LogRequest,
    BugReportRequest
)
from ai_service import (
    analyze_test_log,
    generate_test_cases,
    generate_bug_report,
)

app = FastAPI(
    title="AI Test Intelligence Platform",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AI Test Intelligence Platform Running 🚀"}


# -------------------------
# Request Models
# -------------------------

class TestCaseRequest(BaseModel):
    feature: str


class BugReportRequest(BaseModel):
    feature: str
    issue: str


# -------------------------
# Log Analysis
# -------------------------

@app.post("/analyze-log")
def analyze_log(request: LogRequest):
    result = analyze_test_log(request.log)
    return result.model_dump()


# -------------------------
# Test Case Generator
# -------------------------

@app.post("/generate-testcases")
def generate_testcases(request: TestCaseRequest):
    return generate_test_cases(request.feature)


# -------------------------
# Bug Report Generator
# -------------------------

@app.post("/generate-bug-report")
def generate_bug(request: BugReportRequest):
    return generate_bug_report(
        request.feature,
        request.issue,
    )