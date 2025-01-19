import { Props } from '../props'
import { Template } from '../template/template'
import { AccessibleFieldTemplate } from '../template/accessible-field-template'
import { RBAC, RecordAction } from './rbac'
import { Access } from './access'
import { AccessError } from './access.error'
import { FieldAccessError } from './field-access.error'

export class FieldsAccess extends Access<Template<AccessibleFieldTemplate>> {
  public validate(role: string, action: RecordAction, values: Props): AccessError | null {
    const errors: FieldAccessError[] = []

    for (const fieldName of Object.keys(values)) {
      const error = this.validateProp(role, action, fieldName)
      if (error !== null) errors.push(error)
    }

    if (errors.length === 0) return null

    return {
      message: 'Forbidden',
      action,
      errors,
    }
  }

  private validateProp(role: string, action: RecordAction, fieldName: string): FieldAccessError | null {
    const field: AccessibleFieldTemplate | undefined = this.template.fields.find(({ name }) => name === fieldName)
    if (!field) return { name: fieldName, message: 'Forbidden' }

    for (const attributeAccess of field.access) {
      if (this.matchAttributeAccess(role, action, attributeAccess)) return null
    }

    return { name: fieldName, message: 'Forbidden' }
  }

  private matchAttributeAccess(role: string, action: RecordAction, attributeAccess: RBAC): boolean {
    if (role !== attributeAccess.role) return false
    if (!attributeAccess.actions.includes(action)) return false
    return this.checkCondition(<Props>attributeAccess.condition)
  }
}
