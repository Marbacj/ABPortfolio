'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type {
  PortfolioPerformance,
  PortfolioAllocation,
  QuoteData,
  RebalanceAdvice,
} from '@/types'

interface UsePortfolioDataReturn {
  performance: PortfolioPerformance | null
  allocation: PortfolioAllocation | null
  quotes: QuoteData[]
  rebalance: RebalanceAdvice | null
  loading: boolean
  error: string | null
  refresh: () => void
}

export function usePortfolioData(): UsePortfolioDataReturn {
  const [performance, setPerformance] = useState<PortfolioPerformance | null>(null)
  const [allocation, setAllocation] = useState<PortfolioAllocation | null>(null)
  const [quotes, setQuotes] = useState<QuoteData[]>([])
  const [rebalance, setRebalance] = useState<RebalanceAdvice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // 并行请求所有数据
      const [perfData, allocData, quoteData, rebalanceData] = await Promise.all([
        api.getPerformance(),
        api.getAllocation(),
        api.getQuotes(),
        api.getRebalanceAdvice(),
      ])

      setPerformance(perfData as PortfolioPerformance)
      setAllocation(allocData as PortfolioAllocation)
      setQuotes(quoteData as QuoteData[])
      setRebalance(rebalanceData as RebalanceAdvice)
    } catch (err) {
      const message = err instanceof Error ? err.message : '数据加载失败'
      setError(message)
      console.error('Failed to fetch portfolio data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()

    // 每 5 分钟自动刷新
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  return {
    performance,
    allocation,
    quotes,
    rebalance,
    loading,
    error,
    refresh: fetchData,
  }
}
