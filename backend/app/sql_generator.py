from app.schema import get_schema
from app.gemini import call_gemini


def generate_sql(question: str) -> str:
    schema = get_schema()

    # Convert schema to readable format
    schema_text = "\n".join(
        [f"{col[1]} ({col[2]})" for col in schema]
    )

    prompt = f"""
You are an expert SQLite query generator.

Table name: timetable

Schema:
{schema_text}

STRICT RULES:
- Generate ONLY valid SQLite SQL.
- Do NOT explain anything.
- Do NOT use markdown.
- Do NOT invent columns.
- Use exact column names as shown.
- Wrap column names with spaces in double quotes.

Question:
{question}

SQL:
"""

    response = call_gemini(prompt)

    # Clean accidental markdown if model adds it
    response = response.replace("```sql", "").replace("```", "").strip()

    return response


if __name__ == "__main__":
    test_question = "What classes do I have on Monday?"
    print(generate_sql(test_question))