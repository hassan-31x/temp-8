/**
 * Color utility functions for dynamic background colors
 * Supports white (#ffffff), slate (#0f172a), and green (#44903C)
 */

export const getBackgroundColor = (colorValue: string): string => {
  switch (colorValue) {
    case 'white':
      return '#ffffff'
    case 'slate':
      return '#0f172a'
    case 'green':
      return '#44903C'
    default:
      return '#ffffff'
  }
}

export const getTextColor = (bgColorValue: string): string => {
  return bgColorValue === 'white' ? '#0f172a' : '#ffffff'
}

export const getSecondaryTextColor = (bgColorValue: string): string => {
  switch (bgColorValue) {
    case 'white':
      return '#64748b' // slate-500
    case 'slate':
      return '#cbd5e1' // slate-300
    case 'green':
      return '#d1fae5' // green-100
    default:
      return '#64748b'
  }
}

export const getGreenTintBgColor = (bgColorValue: string): string => {
  switch (bgColorValue) {
    case 'green':
      return 'rgba(68, 144, 60, 0.05)'
    case 'slate':
      return 'rgba(15, 23, 42, 0.05)'
    case 'white':
    default:
      return 'rgba(248, 250, 252, 1)'
  }
}
