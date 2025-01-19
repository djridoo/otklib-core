import { RecordAction } from './rbac'
import { FieldAccessError } from './field-access.error'

export interface AccessError {
  message: string
  action: RecordAction
  errors: FieldAccessError[]
}
