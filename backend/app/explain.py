# from app.gemini import call_gemini


# def generate_explanation(question: str, sql: str, result: list) -> str:
#     if not result:
#         return "No results found."

#     prompt = f"""
# You are a helpful academic timetable assistant.

# User question:
# {question}

# The SQL query used:
# {sql}

# The database result (JSON):
# {result}

# Convert this into a clean, natural, friendly response.
# use the result fully because some fields are multivalued , use all the values in a field
# Format example:
# "You have 3 classes on Monday:

# 1. Course Name (Start Time - End Time)
# 2. Course Name (Start Time - End Time)"

# Do NOT show SQL.
# Be clear and concise.
# """

#     return call_gemini(prompt)

import json
from app.gemini import call_gemini

def generate_explanation(question: str, sql: str, result: list) -> str:
    if not result:
        return "No results found."

    result_json = json.dumps(result, indent=2)

    prompt = f"""
You are a helpful academic timetable assistant.

User question:
{question}

The SQL query used:
{sql}

The database result (JSON):
{result_json}

Convert this into a clean, natural, friendly response.
Use ALL values carefully because some fields may contain multiple values.
Group logically if needed.

Format example:
"You have 3 classes on Monday:

1. Course Name (Start Time - End Time)
2. Course Name (Start Time - End Time)"

Do NOT show SQL.
Be clear, concise, and human-like.
"""

    return call_gemini(prompt)