import _ from 'lodash'
import { Props, PropValue } from '../props'
import { Template } from '../template/template'
import { ValidFieldTemplate } from '../template/valid-field-template'
import { ValidatorOption } from './validator-option'
import { ValidationError } from './validation-error'
import { ItemValidationError } from './item-validation-error'

export class Validator {
  private template: Template<ValidFieldTemplate>

  public static validationMap = {}

  constructor(template: Template<ValidFieldTemplate>) {
    this.template = template
  }

  public validate(values: Props): ValidationError | null {
    const errors: ItemValidationError[] = []

    for (const field of this.template.fields) {
      const error = this.validateRequired(field, values[field.name]) || this.validateProp(field, values[field.name])
      if (error !== null) errors.push(error)
    }

    if (errors.length === 0) return null

    return {
      message: 'Invalid object',
      errors,
    }
  }

  public static addValidator(name: string, validator) {
    this.validationMap[name] = validator
  }

  private validateProp(field: ValidFieldTemplate, value: PropValue): ItemValidationError | null {
    const invalidValues: PropValue[] = []
    const values = Array.isArray(value) ? value : [value]

    for (const itemValue of values) {
      for (const option of field.validation) {
        if (!this.checkOption(itemValue, option)) invalidValues.push(itemValue)
      }
    }

    if (invalidValues.length === 0) return null

    return {
      name: field.name,
      message: 'Invalid value',
      invalidValues: _.uniq(invalidValues as any),
    }
  }

  private validateRequired(field: ValidFieldTemplate, value: PropValue): ItemValidationError | null {
    const values = (Array.isArray(value) ? value : [value]).filter((v) => !!v)

    if (!field.required || values.length > 0) return null

    return {
      name: field.name,
      message: 'Value is required',
      invalidValues: [],
    }
  }

  private checkOption(value: PropValue, option: ValidatorOption): boolean {
    if (!(option.method in Validator.validationMap)) return true
    return Validator.validationMap[option.method](value, option.config)
  }
}
