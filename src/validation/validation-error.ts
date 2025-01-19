import { ItemValidationError } from './item-validation-error'

export interface ValidationError {
  message: string
  errors: ItemValidationError[]
}
