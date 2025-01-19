import { RBAC } from '../access/rbac'
import { FieldTemplate } from './field-template'

export interface AccessibleFieldTemplate extends FieldTemplate {
  access: RBAC[]
}
