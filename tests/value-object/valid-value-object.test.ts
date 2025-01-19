import { Template } from '../../src/template/template'
import { ValidFieldTemplate } from '../../src/template/valid-field-template'
import { ValidValueObject } from '../../src/value-object/valid-value-object'

describe('ValidEntity', () => {
  let template: Template<ValidFieldTemplate>

  beforeEach(() => {
    template = {
      name: 'SomeObject',
      title: 'SomeObject does something',
      fields: [
        {
          name: 'status',
          type: 'string',
          title: 'Status',
          required: false,
          validation: [],
          example: '1',
        },
        {
          name: 'phone',
          type: 'phone',
          title: 'Phone',
          required: true,
          validation: [],
          example: '79998887766',
        },
      ],
    }
  })

  test('successful validation', () => {
    const data = { phone: '79998887766' }
    const valueObject = new ValidValueObject(data, template)
    expect(valueObject.validate()).toBeNull()
  })

  test('failed validation', () => {
    const data = { phone: '' }
    const valueObject = new ValidValueObject(data, template)
    expect(valueObject.validate()).toEqual({
      message: 'Invalid object',
      errors: [{ invalidValues: [], message: 'Value is required', name: 'phone' }],
    })
  })
})
