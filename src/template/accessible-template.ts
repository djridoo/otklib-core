import { RBAC } from '../access/rbac'
import { Template } from './template'

export interface AccessibleTemplate<FieldTemplate> extends Template<FieldTemplate> {
  access: RBAC[]
}
