/**
 * 投资组合相关类型定义
 */

export interface AssetAllocation {
  symbol: string
  name: string
  category: string
  current_weight: number
  target_weight: number
  current_value: number
  deviation: number
}

export interface PortfolioAllocation {
  total_value: number
  assets: AssetAllocation[]
  last_updated: string
}

export interface NavPoint {
  date: string
  nav: number
}

export interface PortfolioPerformance {
  start_date: string
  end_date: string
  total_return: number
  cagr: number
  max_drawdown: number
  volatility: number
  sharpe_ratio: number
  nav_series: NavPoint[]
}

export interface RebalanceAction {
  symbol: string
  action: 'buy' | 'sell' | 'hold'
  current_weight: number
  target_weight: number
  adjustment_pct: number
}

export interface RebalanceAdvice {
  needs_rebalance: boolean
  threshold: number
  actions: RebalanceAction[]
  summary: string
}

export interface QuoteData {
  symbol: string
  name: string
  price: number
  change: number
  change_percent: number
  volume?: number
  market_cap?: number
  timestamp: string
}

export interface BrokerInfo {
  name: string
  url: string
  region: string
}

// User Portfolio Types
export interface Transaction {
  id: number
  symbol: string
  type: 'BUY' | 'SELL'
  quantity: number
  price: number
  amount: number
  timestamp: string
}

export interface Holding {
  symbol: string
  quantity: number
  average_cost: number
  current_price: number
  market_value: number
  return_amount: number
  return_percent: number
}

export interface UserPortfolioSummary {
  total_market_value: number
  total_cost: number
  total_return: number
  total_return_percent: number
  holdings: Holding[]
}

export interface TransactionCreate {
  symbol: string
  type: 'BUY' | 'SELL'
  quantity: number
  price: number
}
