'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useSearchResults } from '@/hooks/useSearchResults'
import { SearchIcon, Loader2, MapPin, Briefcase, ExternalLink, CheckCircle } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from 'next/link'
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  const [query, setQuery] = useState('')
  const { results, structuredAnswer, sessionId, isLoading, error, search } = useSearchResults()
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const sessionFromUrl = searchParams?.get('session')
    if (sessionFromUrl) {
      console.log(`Session ID from URL: ${sessionFromUrl}`)
    }
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    search(query)
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8 bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-100">Saathi</CardTitle>
          <CardDescription className="text-gray-400">
            Find your next career opportunity
            {sessionId && <span className="ml-2">Session ID: {sessionId}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                placeholder="Enter job title, skills, or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 bg-gray-900 text-gray-100 border-gray-700 focus:border-blue-500"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SearchIcon className="mr-2 h-4 w-4" />}
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {error && (
        <Card className="mb-8 border-red-500 bg-black">
          <CardContent className="text-red-500 p-4">{error}</CardContent>
        </Card>
      )}
      
      {structuredAnswer && (
        <Card className="mb-8 bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-100">Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">{structuredAnswer.summary}</p>
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {structuredAnswer.top_jobs.map((job, index) => (
                  <Card key={index} className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-100">{job.title}</CardTitle>
                      <CardDescription className="text-gray-400 flex items-center">
                        <Briefcase className="mr-1 h-4 w-4" /> {job.organization}
                        <MapPin className="ml-4 mr-1 h-4 w-4" /> {job.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside text-gray-300 mb-4">
                        {job.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start mb-2">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline flex items-center"
                      >
                        <ExternalLink className="mr-1 h-4 w-4" /> Apply Now
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Additional Insights</h3>
                <ul className="list-disc list-inside text-gray-300">
                  {structuredAnswer.additional_insights.map((insight, index) => (
                    <li key={index} className="mb-2">{insight}</li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      

      <div className="mt-4 text-center">
        <Link href="/past-searches" className="text-blue-400 hover:underline">
          View Past Searches
        </Link>
      </div>
    </main>
  )
}

