'use client'

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { QuoteData } from '@/types'

interface TradeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  quote: QuoteData
}

export function TradeModal({ isOpen, onClose, onSuccess, quote }: TradeModalProps) {
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY')
  const [quantity, setQuantity] = useState<string>('')
  const [price, setPrice] = useState<string>(quote.price.toString())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setPrice(quote.price.toString())
      setQuantity('')
      setError(null)
      setType('BUY')
    }
  }, [isOpen, quote])

  if (!isOpen) return null

  const totalAmount = parseFloat(quantity || '0') * parseFloat(price || '0')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.createTransaction({
        symbol: quote.symbol,
        type,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
      })
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || '交易失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-100">交易 {quote.symbol}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 交易方向切换 */}
        <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setType('BUY')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              type === 'BUY'
                ? 'bg-green-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            买入
          </button>
          <button
            onClick={() => setType('SELL')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              type === 'SELL'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            卖出
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">价格 (USD)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-brand-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">数量</label>
            <input
              type="number"
              step="0.0001"
              min="0.0001"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-brand-500 font-mono"
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex justify-between items-center py-2 text-sm">
            <span className="text-slate-400">预估总额</span>
            <span className="font-mono text-slate-200 font-bold">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || parseFloat(quantity || '0') <= 0}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
              loading
                ? 'bg-slate-700 cursor-not-allowed'
                : type === 'BUY'
                ? 'bg-green-600 hover:bg-green-500'
                : 'bg-red-600 hover:bg-red-500'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                提交中...
              </div>
            ) : (
              `${type === 'BUY' ? '买入' : '卖出'} ${quote.symbol}`
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
