import { Props } from '../props'
import { RecordAccess } from '../access/record.access'
import { RecordAccessible } from '../access/record-accessible'
import { RecordAction } from '../access/rbac'
import { AccessibleTemplate } from '../template/accessible-template'
import { FieldTemplate } from '../template/field-template'
import { AccessError } from '../access/access.error'
import { ValueObject } from './value-object'

/**
 * @class
 * RecordAccessibleValueObject class
 * Child class can extend RecordAccessibleValueObject using "class SomeValueObject extends RecordAccessibleValueObject {}"
 * In the child class we can implement other methods that implement business logic
 */
export class RecordAccessibleValueObject extends ValueObject implements RecordAccessible {
  public readonly template: AccessibleTemplate<FieldTemplate>

  public constructor(data: Props, template: AccessibleTemplate<FieldTemplate>) {
    super(data)
    this.template = template
  }

  /**
   * Can be override in child class
   * and use super.checkRecordAccess
   */
  public checkRecordAccess(role: string, action: RecordAction, previousData: Props): AccessError | null {
    const access = new RecordAccess(this.template, previousData)
    return access.validate(role, action, this.data)
  }
}
