# NorthWind Resolve

NorthWind Resolve is an AI-powered complaint triage and resolution platform developed for the **CGI Challenge at Hack the Hill III**.

The platform helps utility agents analyze customer complaints, identify SLA risks, understand case context, and receive actionable resolution recommendations.

## Features

- AI complaint classification and prioritization
- SLA and risk assessment
- Root-cause analysis
- Resolution recommendations
- AI-generated customer responses
- Complaint and customer context dashboard
- Northwind data analytics
- Human approval and escalation workflow

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** FastAPI, Python
- **AI:** Google Gemini / LiteLLM
- **Data:** Python, Pandas, CSV
- **API:** REST

## Project Structure

- `ai/` — AI triage and recommendation engine
- `backend/app/` — FastAPI backend
- `frontend/` — Agent dashboard
- `data/` — Northwind synthetic datasets
- `tests/` — Project tests

## Run

Backend:
```bash
uvicorn backend.app.main:app --reload
