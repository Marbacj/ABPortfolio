import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 Tailwind CSS 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化数字为百分比
 */
export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

/**
 * 格式化货币
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * 格式化大数字（带 K/M/B 后缀）
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

/**
 * 格式化日期
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * 获取资产类别对应的颜色
 */
export function getAssetColor(category: string): string {
  const colorMap: Record<string, string> = {
    '股票': '#3b82f6',
    '长期国债': '#10b981',
    '黄金': '#f59e0b',
    '现金等价物': '#6b7280',
  }
  return colorMap[category] || '#94a3b8'
}

/**
 * 获取资产代码对应的颜色
 */
export function getSymbolColor(symbol: string): string {
  const colorMap: Record<string, string> = {
    'SPY': '#3b82f6',
    'TLT': '#10b981',
    'GLD': '#f59e0b',
    'SHV': '#6b7280',
  }
  return colorMap[symbol] || '#94a3b8'
}
