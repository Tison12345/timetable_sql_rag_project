from fastapi import FastAPI
from pydantic import BaseModel
from app.pipeline import ask_question
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 🔥 Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # later restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    question: str


@app.post("/process")
def ask(query: Query):
    response = ask_question(query.question)
    return response

