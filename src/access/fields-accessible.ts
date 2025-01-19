import { Props } from '../props'
import { RecordAction } from './rbac'
import { AccessError } from './access.error'

export interface FieldsAccessible {
  checkFieldsAccess(role: string, action: RecordAction, previousData: Props): AccessError | null
}
