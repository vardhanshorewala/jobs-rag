import { useState } from 'react'
import { JobSearchResult, SearchResponse, StructuredAnswer } from '@/types/JobSearchResult'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/query'

export function useSearchResults() {
  const [results, setResults] = useState<JobSearchResult[]>([])
  const [structuredAnswer, setStructuredAnswer] = useState<StructuredAnswer | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const search = async (query: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_query: query, top_k: 5 }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch results')
      }

      const data: SearchResponse = await response.json()
      
      const parsedAnswer: StructuredAnswer = JSON.parse(data.answer)
      setStructuredAnswer(parsedAnswer)
      setSessionId(data.session_id)

      const parsedResults: JobSearchResult[] = data.context.map(jobString => {
        const lines = jobString.split('\n')
        const title = lines[0].split(': ')[1]
        const organization = lines[1].split(': ')[1]
        const location = lines[2].split(': ')[1].replace(/,/g, '').replace(/\s+/g, ' ')
        const url = lines[3].split(': ')[1]
        const score = parseFloat(lines[4].split(': ')[1])

        return { title, organization, location, url, score }
      })

      setResults(parsedResults)
      
      router.push(`/?session=${data.session_id}`)
    } catch (err) {
      setError('An error occurred while fetching results')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return { results, structuredAnswer, sessionId, isLoading, error, search }
}

