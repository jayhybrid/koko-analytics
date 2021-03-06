'use strict'

const M = 1000000
const K = 1000
const REGEX_TRAILING_ZEROES = /\.0+$/

// format large numbers using M (millions) or K (thousands)
// numbers lower than 10.000 are left untouched
function formatPretty (num) {
  let decimals = 0

  if (num >= M) {
    num = num / M
    decimals = Math.max(0, 3 - String(Math.round(num)).length)
    return num.toFixed(decimals).replace(REGEX_TRAILING_ZEROES, '') + 'M'
  }

  // start showing numbers with K after 10K
  if (num >= K * 10) {
    num = num / K
    decimals = Math.max(0, 3 - (String(Math.round(num)).length))
    return num.toFixed(decimals).replace(REGEX_TRAILING_ZEROES, '') + 'K'
  }

  return String(num)
}

function formatPercentage (p) {
  if (p < 1 && p > -1) {
    p = Math.round(p * 100)
  }

  return p >= 0 ? `+${p}%` : `${p}%`
}

export default {
  formatPretty,
  formatPercentage
}
