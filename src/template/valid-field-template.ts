import { ValidatorOption } from '../validation/validator-option'
import { FieldTemplate } from './field-template'

export interface ValidFieldTemplate extends FieldTemplate {
  required: boolean
  validation: ValidatorOption[]
}
