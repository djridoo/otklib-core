import { PropValue, Props } from '../props'

/**
 * @class
 * ValueObject class
 * Child class can extend ValueObject using "class SomeValueObject extends ValueObject {}"
 * In the child class we can implement other methods that implement business logic
 */
export class ValueObject {
  protected readonly data: Props = {}

  public constructor(data: Props) {
    this.data = data
  }

  /**
   * Can be override in child class
   * and use super.value
   */
  public get value(): Props {
    return this.data
  }

  /**
   * field getter
   * can be override
   */
  public get(fieldName: string): PropValue | PropValue[] {
    return this.data[fieldName]
  }

  /**
   * field setter
   * can be override
   */
  public set(fieldName: string, value: PropValue | PropValue[]) {
    this.data[fieldName] = value
  }
}
