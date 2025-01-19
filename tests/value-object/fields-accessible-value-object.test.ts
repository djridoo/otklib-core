import { Template } from '../../src/template/template'
import { AccessibleFieldTemplate } from '../../src/template/accessible-field-template'
import { RecordAction } from '../../src/access/rbac'
import { FieldsAccessibleValueObject } from '../../src/value-object/fields-accessible-value-object'

describe('FieldsAccessibleValueObject', () => {
  let template: Template<AccessibleFieldTemplate>

  beforeEach(() => {
    template = {
      name: 'SomeObject',
      title: 'SomeObject does something',
      fields: [
        {
          name: 'status',
          type: 'string',
          title: 'Status',
          example: '1',
          access: [
            { role: 'customer', actions: [RecordAction.READ], condition: {} },
            { role: 'executor', actions: [RecordAction.READ], condition: {} },
          ],
        },
        {
          name: 'phone',
          type: 'phone',
          title: 'Phone',
          example: '79998887766',
          access: [
            { role: 'customer', actions: [RecordAction.READ, RecordAction.CREATE], condition: {} },
            { role: 'executor', actions: [RecordAction.READ, RecordAction.CREATE, RecordAction.UPDATE], condition: {} },
          ],
        },
      ],
    }
  })

  test('successful access', () => {
    const data = { phone: '79998887766' }
    const valueObject = new FieldsAccessibleValueObject(data, template)
    expect(valueObject.checkFieldsAccess('customer', RecordAction.CREATE, {})).toBeNull()
  })

  test('failed access', () => {
    const data = { phone: '79998887766' }
    const valueObject = new FieldsAccessibleValueObject(data, template)
    expect(valueObject.checkFieldsAccess('customer', RecordAction.UPDATE, {})).toEqual({
      message: 'Forbidden',
      action: 'update',
      errors: [{ message: 'Forbidden', name: 'phone' }],
    })
  })
})
