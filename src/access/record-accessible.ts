import { Props } from '../props'
import { RecordAction } from './rbac'
import { AccessError } from './access.error'

export interface RecordAccessible {
  checkRecordAccess(role: string, action: RecordAction, previousData: Props): AccessError | null
}
