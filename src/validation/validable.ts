import { ValidationError } from './validation-error'

export interface Validable {
  validate(): ValidationError | null
}
