import { Props } from '../props'
import { AccessibleTemplate } from '../template/accessible-template'
import { FieldTemplate } from '../template/field-template'
import { RBAC, RecordAction } from './rbac'
import { Access } from './access'
import { AccessError } from './access.error'

export class RecordAccess extends Access<AccessibleTemplate<FieldTemplate>> {
  public validate(role: string, action: RecordAction, values: Props): AccessError | null {
    for (const recordAccess of this.template.access) {
      if (this.matchRecordAccess(role, action, recordAccess)) return null
    }

    return { action, message: 'Forbidden', errors: [] }
  }

  private matchRecordAccess(role: string, action: RecordAction, recordAccess: RBAC): boolean {
    if (role !== recordAccess.role) return false
    if (!recordAccess.actions.includes(action)) return false
    return this.checkCondition(recordAccess.condition)
  }
}
