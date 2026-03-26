from app.schema import get_schema
from app.gemini import call_gemini


def generate_sql(question: str, table_name: str) -> str:
    schema = get_schema()

    # Convert schema to readable format
    schema_text = "\n".join(
        [f"{col[1]} ({col[2]})" for col in schema]
    )

    prompt = f"""
You are an expert SQLite query generator.

Table name: {table_name}

Schema:
{schema_text}

IMPORTANT NORMALIZATION RULES:

Before generating SQL, normalize the user query.

1. Convert abbreviated weekdays to full names:
Mon → Monday
Tue → Tuesday
Wed → Wednesday
Thu → Thursday
Fri → Friday
Sat → Saturday
Sun → Sunday

2. If the user gives a date (e.g., Feb 28, 28 Feb, 28/02):
   - Determine the weekday for that date.
   - Use the weekday name in the SQL query.

Example:
User: "What classes do I have on Feb 28?"
Interpret as:
"What classes do I have on Wednesday?"

3. If user asks about relative days:
- today → use current weekday
- tomorrow → calculate next weekday

4. The database column "Day" ALWAYS stores full weekday names:
Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday

5. When generating SQL:
- ALWAYS use full weekday names
- NEVER use abbreviations (Mon, Tue, etc.)

STRICT SQL RULES:
- Generate ONLY valid SQLite SQL
- Do NOT explain anything
- Do NOT include markdown
- Do NOT invent columns
- Wrap column names with spaces in double quotes

User Question:
{question}

SQL:
"""

    response = call_gemini(prompt)

    # Clean accidental markdown if model adds it
    response = response.replace("```sql", "").replace("```", "").strip()

    return response


if __name__ == "__main__":
    test_question = "What classes do I have on Mon?"
    print(generate_sql(test_question))