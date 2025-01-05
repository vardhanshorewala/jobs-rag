export interface JobSearchResult {
  title: string;
  organization: string;
  location: string;
  url: string;
  score: number;
}

export interface SearchResponse {
  answer: string;
  context: string[];
  session_id: string;
}

export interface StructuredAnswer {
  summary: string;
  top_jobs: {
    title: string;
    organization: string;
    location: string;
    url: string;
    highlights: string[];
  }[];
  additional_insights: string[];
}

