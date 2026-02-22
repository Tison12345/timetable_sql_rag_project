from app.sql_generator import generate_sql
from app.executor import run_sql
from app.explain import generate_explanation


def ask_question(question: str):
    sql = generate_sql(question)
    result = run_sql(sql)

    explanation = generate_explanation(question, sql, result)

    return {
        "generated_sql": sql,
        "result": result,
        "answer": explanation
    }


if __name__ == "__main__":
    q = "What classes do I have on Monday?"
    print(ask_question(q))