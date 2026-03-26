from app.sql_generator import generate_sql
from app.executor import run_sql
from app.explain import generate_explanation


def ask_question(question: str, branch: str, semester: int):

    # 🔥 Build table name
    table_name = f"timetable_sem{semester}_{branch.lower()}"

    # Generate SQL using correct table
    sql = generate_sql(question, table_name)

    # Execute SQL
    result = run_sql(sql)

    # Generate explanation
    explanation = generate_explanation(question, sql, result)

    return {
        "generated_sql": sql,
        "result": result,
        "answer": explanation
    }