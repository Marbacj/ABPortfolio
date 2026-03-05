'use client'

import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { cn, formatCurrency, formatPercent, getSymbolColor } from '@/lib/utils'
import type { Holding, UserPortfolioSummary } from '@/types'

interface HoldingsCardProps {
  summary: UserPortfolioSummary | null
  loading: boolean
}

export function HoldingsCard({ summary, loading }: HoldingsCardProps) {
  return (
    <div className="glass rounded-2xl p-6 card-hover h-full">
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="w-5 h-5 text-brand-400" />
        <h3 className="text-lg font-semibold text-slate-200">我的资产</h3>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-20 bg-slate-800/50 rounded-xl animate-pulse" />
          <div className="h-40 bg-slate-800/50 rounded-xl animate-pulse" />
        </div>
      ) : !summary || summary.holdings.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center text-slate-500 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
          <p>暂无持仓</p>
          <p className="text-xs mt-2">点击行情列表中的交易按钮开始记录</p>
        </div>
      ) : (
        <>
          {/* 总览卡片 */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700/50 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">总市值</p>
                <p className="text-2xl font-bold font-mono text-slate-100">
                  {formatCurrency(summary.total_market_value)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">总浮动盈亏</p>
                <div
                  className={cn(
                    'text-lg font-bold font-mono flex items-center justify-end gap-1',
                    summary.total_return >= 0 ? 'text-green-400' : 'text-red-400'
                  )}
                >
                  {summary.total_return >= 0 ? '+' : ''}
                  {formatCurrency(summary.total_return)}
                </div>
                <p
                  className={cn(
                    'text-xs font-mono',
                    summary.total_return_percent >= 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {formatPercent(summary.total_return_percent)}
                </p>
              </div>
            </div>
          </div>

          {/* 持仓列表 */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-slate-500 px-2">
              <span>资产</span>
              <span>持仓 / 市值</span>
              <span className="text-right">盈亏</span>
            </div>
            {summary.holdings.map((holding) => (
              <div
                key={holding.symbol}
                className="bg-slate-800/30 hover:bg-slate-800/50 rounded-lg p-3 transition-colors flex items-center justify-between"
              >
                {/* 资产名 */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{ backgroundColor: getSymbolColor(holding.symbol) }}
                  />
                  <div>
                    <p className="font-bold font-mono text-slate-200">{holding.symbol}</p>
                    <p className="text-xs text-slate-500">
                      成本: {formatCurrency(holding.average_cost)}
                    </p>
                  </div>
                </div>

                {/* 数量与市值 */}
                <div className="text-right">
                  <p className="text-sm font-mono text-slate-200">
                    {formatCurrency(holding.market_value)}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    {holding.quantity.toFixed(4)} 股
                  </p>
                </div>

                {/* 盈亏 */}
                <div className="text-right min-w-[80px]">
                  <p
                    className={cn(
                      'text-sm font-mono font-medium',
                      holding.return_amount >= 0 ? 'text-green-400' : 'text-red-400'
                    )}
                  >
                    {holding.return_amount >= 0 ? '+' : ''}
                    {formatCurrency(holding.return_amount)}
                  </p>
                  <div className="flex items-center justify-end gap-0.5">
                    {holding.return_percent >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <p
                      className={cn(
                        'text-xs font-mono',
                        holding.return_percent >= 0 ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      {Math.abs(holding.return_percent).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
