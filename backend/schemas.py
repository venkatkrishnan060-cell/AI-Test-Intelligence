from pydantic import BaseModel


class LogRequest(BaseModel):
    log: str


class AnalysisResponse(BaseModel):
    rootCause: str
    failureCategory: str
    severity: str
    suggestedFix: str
    jiraTitle: str
    jiraDescription: str


class TestCaseRequest(BaseModel):
    feature: str


class BugReportRequest(BaseModel):
    feature: str
    issue: str


class BugReportResponse(BaseModel):
    bugId: str
    title: str
    module: str
    environment: str
    severity: str
    priority: str
    preconditions: str
    steps: list[str]
    expectedResult: str
    actualResult: str
    rootCause: str
    suggestedFix: str