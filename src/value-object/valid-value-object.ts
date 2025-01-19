import { Props } from '../props'
import { Template } from '../template/template'
import { ValidFieldTemplate } from '../template/valid-field-template'
import { Validator } from '../validation/validator'
import { Validable } from '../validation/validable'
import { ValidationError } from '../validation/validation-error'
import { ValueObject } from './value-object'

/**
 * @class
 * ValidValueObject class
 * Child class can extend ValidValueObject using "class SomeValueObject extends ValidValueObject {}"
 * In the child class we can implement other methods that implement business logic
 */
export class ValidValueObject extends ValueObject implements Validable {
  protected readonly template: Template<ValidFieldTemplate>

  public constructor(data: Props, template: Template<ValidFieldTemplate>) {
    super(data)
    this.template = template
  }

  /**
   * Can be override in child class
   * and use super.validate
   */
  public validate(): ValidationError | null {
    const validator = new Validator(this.template)
    return validator.validate(this.data)
  }
}
