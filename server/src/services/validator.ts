import type { ValidationResult } from '../types'

export interface ColumnRule {
  seenValues: Map<string, number>
  numericCount: number
  totalCount: number
}

export function buildColumnRules(headers: string[]): Record<string, ColumnRule> {
  const rules: Record<string, ColumnRule> = {}
  for (const header of headers) {
    rules[header] = { seenValues: new Map(), numericCount: 0, totalCount: 0 }
  }
  return rules
}

export function validateRow(
  row: Record<string, string>,
  rowNumber: number,
  columnRules: Record<string, ColumnRule>,
): ValidationResult {
  const errors: string[] = []

  for (const [header, rule] of Object.entries(columnRules)) {
    const value = (row[header] ?? '').trim()

    if (!value) {
      errors.push(`Row ${rowNumber}: Missing value in column "${header}"`)
      continue
    }

    rule.totalCount++

    const prevCount = rule.seenValues.get(value) ?? 0
    if (prevCount > 0) {
      errors.push(`Row ${rowNumber}: Duplicate value "${value}" in column "${header}"`)
    }
    rule.seenValues.set(value, prevCount + 1)

    const isNumeric = !isNaN(Number(value))
    if (isNumeric) {
      rule.numericCount++
    }

    if (rule.totalCount >= 10 && rule.numericCount / rule.totalCount > 0.8 && !isNumeric) {
      errors.push(`Row ${rowNumber}: Non-numeric value "${value}" in column "${header}" (column is mostly numeric)`)
    }
  }

  return { valid: errors.length === 0, errors }
}
