# Saathi - Job Search Platform

Saathi is a platform designed to help users find their next career opportunity using a robust search system powered by AI and vector databases.

---

## Features Overview

### Backend

- **FastAPI Server**: Lightweight API server for handling job searches and indexing operations.
- **Job Indexing**: Fetches and indexes job listings from the RapidAPI database, creating embeddings for advanced querying.
- **OpenAI Integration**: Utilizes OpenAI's GPT and embedding models for generating job insights and contextual responses.
- **Vector Search**: Implements ChromaDB for fast and scalable semantic job searches.
- **Query History**: Tracks user queries with session-based storage, enabling review of past searches.
- **Session ID**: Provides each query a unique session ID for future referencing.

---

### Frontend

- **Built with Next.js**: A responsive and interactive UI for seamless job searches.
- **TailwindCSS Styling**: Customizable and elegant dark-mode design with reusable components.
- **Job Insights**: Displays search results in structured cards with highlights, relevance scores, and actionable links.
- **Past Searches**: Allows users to view and revisit previous job queries via session-based storage.

---

## Tech Stack

- **Backend**: FastAPI, ChromaDB, SQLite, OpenAI API
- **Frontend**: Next.js, TailwindCSS
- **Deployment**: Vercel (Frontend) & Uvicorn (Backend)

---

## Usage

1. **Search Jobs**:

   - Input job title, skills, or company to find relevant job postings.
   - Structured results include job details, highlights, and application links.

2. **View Past Searches**:
   - Navigate to the "Past Searches" page to review query history.
   - Access previous session-based job search results.

---

## Setup

## Backend

1. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Add the required environment variables to the configuration file:

- `OPENAI_API_KEY`
- `RAPIDAPI_KEY`

3. Start the FastAPI server:

```bash
python run_app.py
```

## Frotend

Follow the same steps as starting a Next.js project:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
