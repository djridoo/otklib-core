import { Props } from './props'
import { Validable } from './validation/validable'
import { FieldsAccessible } from './access/fields-accessible'
import { RecordAccessible } from './access/record-accessible'
import { RecordAction } from './access/rbac'
import { AccessException } from './exception/access-exception'
import { ValidationException } from './exception/validation-exception'

/**
 * @abstract
 * Abstract UseCase<InputInterface, OutputInterface> class
 * can extend child class using "class SomeUseCase extends UseCase<SomeInputInterface, SomeOutputInterface> {}"
 * In the child class we can implement other methods that implement business logic
 */
export abstract class UseCase<InputInterface, OutputInterface> {
  /**
   * You can pass user and other data
   * using constructor(private user: User, ...) {}
   * in the child class
   */

  public abstract execute(input: InputInterface): Promise<OutputInterface>

  /**
   * Can be override in child class
   * and use super.validate
   */
  protected validate(entity: Validable) {
    const error = entity.validate()
    if (error !== null) throw new ValidationException(error.message, error.errors)
  }

  /**
   * Can be override in child class
   * and use super.checkFieldsAccess
   */
  protected checkFieldsAccess(entity: FieldsAccessible, role: string, action: RecordAction, previousData: Props = {}) {
    const error = entity.checkFieldsAccess(role, action, previousData)
    if (error !== null) throw new AccessException(error.message, error.errors)
  }

  /**
   * Can be override in child class
   * and use super.checkRecordAccess
   */
  protected checkRecordAccess(entity: RecordAccessible, role: string, action: RecordAction, previousData: Props = {}) {
    const error = entity.checkRecordAccess(role, action, previousData)
    if (error !== null) throw new AccessException(error.message, error.errors)
  }
}
