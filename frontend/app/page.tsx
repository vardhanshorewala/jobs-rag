'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'

interface PastSearch {
  query: string;
  response: string;
  timestamp: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function PastSearches() {
  const [pastSearches, setPastSearches] = useState<PastSearch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPastSearches = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_URL}/query/history?limit=10`)
        if (!response.ok) {
          throw new Error('Failed to fetch past searches')
        }
        const data = await response.json()
        setPastSearches(data.history)
      } catch (err) {
        setError('An error occurred while fetching past searches')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPastSearches()
  }, [])

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8 bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-100">Past Searches</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-gray-800" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Query</TableHead>
                  <TableHead className="text-gray-300">Response</TableHead>
                  <TableHead className="text-gray-300">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastSearches.map((search, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-gray-300">{search.query}</TableCell>
                    <TableCell className="text-gray-300">
                      {search.response.length > 100
                        ? `${search.response.substring(0, 100)}...`
                        : search.response}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {new Date(search.timestamp).toLocaleString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <div className="mt-4">
        <Link href="/" className="text-blue-400 hover:underline flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Search
        </Link>
      </div>
    </main>
  )
}

