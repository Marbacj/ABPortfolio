/**
 * API 客户端
 */

import type { 
  PortfolioPerformance,
  PortfolioAllocation,
  RebalanceAdvice,
  QuoteData,
  BrokerInfo,
  HistoricalData,
  TransactionCreate,
  Transaction,
  Holding,
  UserPortfolioSummary
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // 获取投资组合业绩
  async getPerformance(startDate?: string, endDate?: string): Promise<PortfolioPerformance> {
    const params = new URLSearchParams()
    if (startDate) params.set('start_date', startDate)
    if (endDate) params.set('end_date', endDate)
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.fetch(`/api/portfolio/performance${query}`)
  }

  // 获取资产配置
  async getAllocation(): Promise<PortfolioAllocation> {
    return this.fetch('/api/portfolio/allocation')
  }

  // 获取再平衡建议
  async getRebalanceAdvice(threshold?: number): Promise<RebalanceAdvice> {
    const query = threshold ? `?threshold=${threshold}` : ''
    return this.fetch(`/api/portfolio/rebalance${query}`)
  }

  // 获取实时行情
  async getQuotes(symbols?: string[]): Promise<QuoteData[]> {
    const query = symbols?.length ? `?symbols=${symbols.join(',')}` : ''
    return this.fetch(`/api/market/quote${query}`)
  }

  // 获取历史数据
  async getHistoricalData(symbols?: string[], startDate?: string, endDate?: string): Promise<HistoricalData> {
    const params = new URLSearchParams()
    if (symbols?.length) params.set('symbols', symbols.join(','))
    if (startDate) params.set('start_date', startDate)
    if (endDate) params.set('end_date', endDate)
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.fetch(`/api/market/history${query}`)
  }

  // 获取券商链接
  async getBrokerLinks(): Promise<{ brokers: BrokerInfo[] }> {
    return this.fetch('/api/market/broker-links')
  }

  // User API
  async createTransaction(data: TransactionCreate): Promise<Transaction> {
    return this.fetch('/api/user/transaction', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getHoldings(): Promise<Holding[]> {
    return this.fetch('/api/user/holdings')
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.fetch('/api/user/transactions')
  }

  async getUserPortfolioSummary(): Promise<UserPortfolioSummary> {
    return this.fetch('/api/user/summary')
  }
}

export const api = new ApiClient(API_BASE_URL)
