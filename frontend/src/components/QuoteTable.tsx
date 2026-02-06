'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn, formatCurrency, formatPercent, formatCompactNumber, getSymbolColor } from '@/lib/utils'
import type { QuoteData } from '@/types'

interface QuoteTableProps {
  quotes: QuoteData[]
  loading: boolean
}

export function QuoteTable({ quotes, loading }: QuoteTableProps) {
  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">实时行情</h3>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-800/50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : quotes.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-slate-500">
          暂无数据
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">
                  资产
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-slate-400">
                  最新价
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-slate-400">
                  涨跌幅
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-slate-400 hidden sm:table-cell">
                  成交量
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-slate-400 hidden md:table-cell">
                  市值
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => {
                const isPositive = quote.change_percent >= 0
                const color = getSymbolColor(quote.symbol)

                return (
                  <tr
                    key={quote.symbol}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    {/* 资产信息 */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                          style={{ backgroundColor: color }}
                        >
                          {quote.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-200 font-mono">
                            {quote.symbol}
                          </p>
                          <p className="text-xs text-slate-500 truncate max-w-[120px] sm:max-w-none">
                            {quote.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 价格 */}
                    <td className="py-4 px-2 text-right">
                      <span className="text-lg font-bold font-mono text-slate-200">
                        {formatCurrency(quote.price)}
                      </span>
                    </td>

                    {/* 涨跌幅 */}
                    <td className="py-4 px-2 text-right">
                      <div
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium font-mono',
                          isPositive
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                        )}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {formatPercent(quote.change_percent)}
                      </div>
                    </td>

                    {/* 成交量 */}
                    <td className="py-4 px-2 text-right hidden sm:table-cell">
                      <span className="text-slate-400 font-mono">
                        {quote.volume ? formatCompactNumber(quote.volume) : '--'}
                      </span>
                    </td>

                    {/* 市值 */}
                    <td className="py-4 px-2 text-right hidden md:table-cell">
                      <span className="text-slate-400 font-mono">
                        {quote.market_cap
                          ? `$${formatCompactNumber(quote.market_cap)}`
                          : '--'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 数据说明 */}
      <p className="text-xs text-slate-500 mt-4 text-center">
        数据来源: Yahoo Finance | 实时行情存在约15分钟延迟
      </p>
    </div>
  )
}
