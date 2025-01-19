import { AccessibleTemplate } from '../../src/template/accessible-template'
import { FieldTemplate } from '../../src/template/field-template'
import { RecordAction } from '../../src/access/rbac'
import { RecordAccessibleValueObject } from '../../src/value-object/record-accessible-value-object'

describe('RecordAccessibleValueObject', () => {
  let template: AccessibleTemplate<FieldTemplate>

  beforeEach(() => {
    template = {
      name: 'SomeObject',
      title: 'SomeObject does something',
      fields: [],
      access: [{ role: 'customer', actions: [RecordAction.READ, RecordAction.CREATE], condition: {} }],
    }
  })

  test('successful access', () => {
    const data = { phone: '79998887766' }
    const valueObject = new RecordAccessibleValueObject(data, template)
    expect(valueObject.checkRecordAccess('customer', RecordAction.CREATE, {})).toBeNull()
  })

  test('failed access', () => {
    const data = { phone: '79998887766' }
    const valueObject = new RecordAccessibleValueObject(data, template)
    expect(valueObject.checkRecordAccess('customer', RecordAction.UPDATE, {})).toEqual({
      message: 'Forbidden',
      action: 'update',
      errors: [],
    })
  })
})
