export interface ItemValidationError {
  name: string
  message: string
  invalidValues: string[]
  pattern?: string
  supportedValues?: string[]
}
