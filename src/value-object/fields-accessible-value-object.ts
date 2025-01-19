import { Props } from '../props'
import { FieldsAccess } from '../access/fields.access'
import { FieldsAccessible } from '../access/fields-accessible'
import { RecordAction } from '../access/rbac'
import { Template } from '../template/template'
import { AccessibleFieldTemplate } from '../template/accessible-field-template'
import { AccessError } from '../access/access.error'
import { ValueObject } from './value-object'

/**
 * @class
 * FieldsAccessibleValueObject class
 * Child class can extend FieldsAccessibleValueObject using "class SomeValueObject extends FieldsAccessibleValueObject {}"
 * In the child class we can implement other methods that implement business logic
 */
export class FieldsAccessibleValueObject extends ValueObject implements FieldsAccessible {
  public readonly template: Template<AccessibleFieldTemplate>

  public constructor(data: Props, template: Template<AccessibleFieldTemplate>) {
    super(data)
    this.template = template
  }

  /**
   * Can be override in child class
   * and use super.checkFieldsAccess
   */
  public checkFieldsAccess(role: string, action: RecordAction, previousData: Props): AccessError | null {
    const access = new FieldsAccess(this.template, previousData)
    return access.validate(role, action, this.data)
  }
}
