import os
import time
from dotenv import load_dotenv
from google import genai
from google.genai.errors import ClientError, ServerError

from schemas import (
    AnalysisResponse,
    BugReportResponse,
)

# ==========================================================
# Load Environment
# ==========================================================

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = "gemini-3.1-flash-lite"


# ==========================================================
# AI LOG ANALYZER
# ==========================================================

def analyze_test_log(log: str):

    prompt = f"""
You are a Senior QA Automation Engineer.

Analyze the following software test failure log.

Return ONLY these fields:

- rootCause
- failureCategory
- severity
- suggestedFix
- jiraTitle
- jiraDescription

Test Log:

{log}
"""

    retries = 3

    for attempt in range(retries):

        try:

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": AnalysisResponse,
                    "temperature": 0.2,
                },
            )

            return response.parsed

        except ClientError as e:

            message = str(e)

            if "RESOURCE_EXHAUSTED" in message:

                return AnalysisResponse(
                    rootCause="Gemini API quota exceeded.",
                    failureCategory="AI Service",
                    severity="Low",
                    suggestedFix="Please try again later or upgrade your Gemini API plan.",
                    jiraTitle="Gemini API Quota Exceeded",
                    jiraDescription=message,
                )

            return AnalysisResponse(
                rootCause="Gemini Client Error",
                failureCategory="AI Service",
                severity="Low",
                suggestedFix="Check your API key and Gemini configuration.",
                jiraTitle="Gemini Client Error",
                jiraDescription=message,
            )

        except ServerError as e:

            if attempt < retries - 1:
                time.sleep(3)
                continue

            return AnalysisResponse(
                rootCause="Gemini service temporarily unavailable.",
                failureCategory="AI Service",
                severity="Low",
                suggestedFix="Please try again after a few minutes.",
                jiraTitle="Gemini Server Error",
                jiraDescription=str(e),
            )

        except Exception as e:

            return AnalysisResponse(
                rootCause="Unexpected AI Error",
                failureCategory="AI Service",
                severity="Low",
                suggestedFix="Check backend logs.",
                jiraTitle="Unexpected AI Error",
                jiraDescription=str(e),
            )


# ==========================================================
# AI TEST CASE GENERATOR
# ==========================================================

def generate_test_cases(feature: str):

    prompt = f"""
You are a Senior QA Automation Engineer.

Generate comprehensive software test cases.

Feature:

{feature}

Generate at least 10 test cases.

Return the output as a Markdown table.

Columns:

| Test ID | Scenario | Steps | Expected Result | Priority |
"""

    retries = 3

    for attempt in range(retries):

        try:

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config={
                    "temperature": 0.2,
                },
            )

            return {
                "testCases": response.text
            }

        except ClientError as e:

            message = str(e)

            if "RESOURCE_EXHAUSTED" in message:

                return {
                    "testCases": "⚠ Gemini API daily quota exceeded. Please try again later."
                }

            return {
                "testCases": message
            }

        except ServerError:

            if attempt < retries - 1:
                time.sleep(3)
                continue

            return {
                "testCases": "⚠ Gemini server is temporarily unavailable."
            }

        except Exception as e:

            return {
                "testCases": str(e)
            }


# ==========================================================
# AI BUG REPORT GENERATOR
# ==========================================================

def generate_bug_report(feature: str, issue: str):

    prompt = f"""
You are a Senior QA Automation Engineer.

Generate a professional software bug report.

Feature:
{feature}

Observed Issue:
{issue}

Return ONLY valid JSON.

Fields:

- bugId
- title
- module
- environment
- severity
- priority
- preconditions
- steps (array)
- expectedResult
- actualResult
- rootCause
- suggestedFix

Do not return markdown.
Do not return explanation.
Return JSON only.
"""

    retries = 3

    for attempt in range(retries):

        try:

            response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": BugReportResponse,
            "temperature": 0.2,
        },
    )

            return response.parsed.model_dump()

        except ClientError as e:

            message = str(e)

            if "RESOURCE_EXHAUSTED" in message:

                return {
                    "report": "⚠ Gemini API daily quota exceeded. Please try again later."
                }

            return {
                "report": message
            }

        except ServerError:

            if attempt < retries - 1:
                time.sleep(3)
                continue

            return {
                "report": "⚠ Gemini server is temporarily unavailable."
            }

        except Exception as e:

            return {
                "report": str(e)
            }