'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'

interface PastSearch {
  id: number
  query: string
  timestamp: string
  resultCount: number
}

export default function PastSearches() {
  const [pastSearches, setPastSearches] = useState<PastSearch[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPastSearches = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockPastSearches: PastSearch[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        query: `Past search query ${i + 1}`,
        timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        resultCount: Math.floor(Math.random() * 100) + 1
      }))
      setPastSearches(mockPastSearches)
      setIsLoading(false)
    }

    fetchPastSearches()
  }, [])

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8 bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-100">Past Searches</CardTitle>
        </CardHeader>
      </Card>

      <ScrollArea className="h-[600px] rounded-md border border-gray-800 p-4 bg-black">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-2/3 bg-gray-800 mb-2" />
                  <Skeleton className="h-4 w-1/3 bg-gray-800" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {pastSearches.map((search) => (
              <Card key={search.id} className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <p className="text-lg font-semibold text-gray-100 mb-2">{search.query}</p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {new Date(search.timestamp).toLocaleString()}
                    </span>
                    <span>{search.resultCount} results</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
      <div className="mt-4">
        <Link href="/" className="text-blue-400 hover:underline flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Search
        </Link>
      </div>
    </main>
  )
}

