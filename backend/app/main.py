from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.pipeline import ask_question
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 🔥 Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # update if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ Updated Request Model
class Query(BaseModel):
    question: str
    branch: str
    semester: int


# ✅ API Endpoint
@app.post("/process")
def ask(query: Query):
    try:
        # 🔥 Normalize inputs
        branch = query.branch.lower()
        semester = query.semester

        # ✅ Basic validation
        if branch not in ["cse", "ds", "ece"]:
            raise HTTPException(status_code=400, detail="Invalid branch")

        if semester not in range(1, 9):
            raise HTTPException(status_code=400, detail="Invalid semester")

        # 🔥 Call pipeline with all inputs
        response = ask_question(
            question=query.question,
            branch=branch,
            semester=semester
        )

        return response

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))