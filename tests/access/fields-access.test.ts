import { Template } from '../../src/template/template'
import { AccessibleFieldTemplate } from '../../src/template/accessible-field-template'
import { RecordAction } from '../../src/access/rbac'
import { FieldsAccess } from '../../src/access/fields.access'

describe('FieldsAccess', () => {
  let template: Template<AccessibleFieldTemplate>

  beforeEach(() => {
    template = {
      name: 'SomeObject',
      title: 'SomeObject does something',
      fields: [
        {
          name: 'id',
          type: 'string',
          title: 'ID',
          example: '1',
          access: [
            { role: 'customer', actions: [RecordAction.READ], condition: {} },
            { role: 'executor', actions: [RecordAction.READ], condition: {} },
            { role: 'automation', actions: [RecordAction.READ], condition: { status: 'automation' } },
          ],
        },
        {
          name: 'customerId',
          type: 'string',
          title: 'Customer ID',
          example: '1',
          access: [
            { role: 'customer', actions: [RecordAction.READ], condition: {} },
            { role: 'executor', actions: [RecordAction.READ, RecordAction.CREATE], condition: {} },
            { role: 'automation', actions: [RecordAction.READ], condition: { status: 'automation' } },
          ],
        },
        {
          name: 'status',
          type: 'string',
          title: 'Order Status',
          example: '1',
          access: [
            { role: 'customer', actions: [RecordAction.READ], condition: {} },
            { role: 'executor', actions: [RecordAction.READ, RecordAction.CREATE], condition: {} },
            { role: 'executor', actions: [RecordAction.UPDATE], condition: { status: 'executor' } },
            { role: 'automation', actions: [RecordAction.READ, RecordAction.UPDATE], condition: { status: 'automation' } },
          ],
          defaultValue: 'automation',
        },
        {
          name: 'driverName',
          type: 'string',
          title: 'Driver Name',
          example: 'Ivanov Ivan Ivanovich',
          access: [
            { role: 'customer', actions: [RecordAction.READ, RecordAction.CREATE], condition: {} },
            { role: 'customer', actions: [RecordAction.UPDATE], condition: { status: 'clarify-data' } },
            { role: 'executor', actions: [RecordAction.READ, RecordAction.CREATE], condition: {} },
            { role: 'executor', actions: [RecordAction.UPDATE], condition: { status: 'executor' } },
            { role: 'automation', actions: [RecordAction.READ, RecordAction.UPDATE], condition: { status: 'automation' } },
          ],
        },
      ],
    }
  })

  describe('customer', () => {
    test('can read all fields', () => {
      const access = new FieldsAccess(template, {})
      const value = { id: '1', customerId: '2', status: 'automation', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('customer', RecordAction.READ, value)).toBeNull()
    })

    test('can create permitted fields', () => {
      const access = new FieldsAccess(template, {})
      const value = { driverName: 'Иванов Иван Иванович' }
      expect(access.validate('customer', RecordAction.CREATE, value)).toBeNull()
    })

    test('can not create not permitted fields', () => {
      const access = new FieldsAccess(template, {})
      const value = { id: '1', customerId: '2', status: 'automation', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('customer', RecordAction.CREATE, value)).toEqual({
        message: 'Forbidden',
        action: 'create',
        errors: [
          { message: 'Forbidden', name: 'id' },
          { message: 'Forbidden', name: 'customerId' },
          { message: 'Forbidden', name: 'status' },
        ],
      })
    })

    test('can update permitted fields if status is clarify-data', () => {
      const previousValues = { status: 'clarify-data' }
      const access = new FieldsAccess(template, previousValues)
      const value = { driverName: 'Иванов Иван Иванович' }
      expect(access.validate('customer', RecordAction.UPDATE, value)).toBeNull()
    })

    test('can not update permitted fields if status is not clarify-data', () => {
      const previousValues = { status: 'executor' }
      const access = new FieldsAccess(template, previousValues)
      const value = { driverName: 'Иванов Иван Иванович' }
      expect(access.validate('customer', RecordAction.UPDATE, value)).toEqual({
        action: 'update',
        errors: [{ message: 'Forbidden', name: 'driverName' }],
        message: 'Forbidden',
      })
    })

    test('can not update not permitted fields', () => {
      const access = new FieldsAccess(template, {})
      const value = { id: '1', customerId: '500', status: 'automation', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('customer', RecordAction.UPDATE, value)).toEqual({
        action: 'update',
        errors: [
          { message: 'Forbidden', name: 'id' },
          { message: 'Forbidden', name: 'customerId' },
          { message: 'Forbidden', name: 'status' },
          { message: 'Forbidden', name: 'driverName' },
        ],
        message: 'Forbidden',
      })
    })
  })

  describe('executor', () => {
    test('can read all fields', () => {
      const access = new FieldsAccess(template, {})
      const value = { id: '1', customerId: '2', status: 'automation', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('executor', RecordAction.READ, value)).toBeNull()
    })

    test('can create permitted fields', () => {
      const access = new FieldsAccess(template, {})
      const value = { customerId: '2', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('executor', RecordAction.CREATE, value)).toBeNull()
    })

    test('can not create not permitted fields', () => {
      const access = new FieldsAccess(template, {})
      const value = { id: '1', customerId: '2', status: 'automation', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('executor', RecordAction.CREATE, value)).toEqual({
        message: 'Forbidden',
        action: 'create',
        errors: [{ message: 'Forbidden', name: 'id' }],
      })
    })

    test('can update permitted fields if status is executor', () => {
      const previousValues = { status: 'executor' }
      const access = new FieldsAccess(template, previousValues)
      const value = { driverName: 'Иванов Иван Иванович' }
      expect(access.validate('executor', RecordAction.UPDATE, value)).toBeNull()
    })

    test('can not update permitted fields if status is not executor', () => {
      const previousValues = { status: 'automation' }
      const access = new FieldsAccess(template, previousValues)
      const value = { driverName: 'Иванов Иван Иванович' }
      expect(access.validate('executor', RecordAction.UPDATE, value)).toEqual({
        action: 'update',
        errors: [{ message: 'Forbidden', name: 'driverName' }],
        message: 'Forbidden',
      })
    })

    test('can not update not permitted fields if status is executor', () => {
      const previousValues = { status: 'executor' }
      const access = new FieldsAccess(template, previousValues)
      const value = { id: '1', customerId: '500', status: 'automation', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('executor', RecordAction.UPDATE, value)).toEqual({
        action: 'update',
        errors: [
          { message: 'Forbidden', name: 'id' },
          { message: 'Forbidden', name: 'customerId' },
        ],
        message: 'Forbidden',
      })
    })
  })

  describe('automation', () => {
    test('can read all fields if status is automation', () => {
      const previousValues = { status: 'automation' }
      const access = new FieldsAccess(template, previousValues)
      const value = { id: '1', customerId: '2', status: 'automation', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('automation', RecordAction.READ, value)).toBeNull()
    })

    test('can not read all fields if status is not automation', () => {
      const access = new FieldsAccess(template, { status: 'executor' })
      const value = { id: '1', customerId: '2', status: 'automation', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('automation', RecordAction.READ, value)).toEqual({
        action: 'read',
        errors: [
          { message: 'Forbidden', name: 'id' },
          { message: 'Forbidden', name: 'customerId' },
          { message: 'Forbidden', name: 'status' },
          { message: 'Forbidden', name: 'driverName' },
        ],
        message: 'Forbidden',
      })
    })

    test('can not create', () => {
      const access = new FieldsAccess(template, {})
      const value = { customerId: '2', status: 'automation', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('automation', RecordAction.CREATE, value)).toEqual({
        action: 'create',
        errors: [
          { message: 'Forbidden', name: 'customerId' },
          { message: 'Forbidden', name: 'status' },
          { message: 'Forbidden', name: 'driverName' },
        ],
        message: 'Forbidden',
      })
    })

    test('can update permitted fields if status is automation', () => {
      const previousValues = { status: 'automation' }
      const access = new FieldsAccess(template, previousValues)
      const value = { driverName: 'Иванов Иван Иванович' }
      expect(access.validate('automation', RecordAction.UPDATE, value)).toBeNull()
    })

    test('can not update permitted fields if status is not automation', () => {
      const previousValues = { status: 'executor' }
      const access = new FieldsAccess(template, previousValues)
      const value = { driverName: 'Иванов Иван Иванович' }
      expect(access.validate('automation', RecordAction.UPDATE, value)).toEqual({
        action: 'update',
        errors: [{ message: 'Forbidden', name: 'driverName' }],
        message: 'Forbidden',
      })
    })

    test('can not update not permitted fields if status is automation', () => {
      const previousValues = { status: 'automation' }
      const access = new FieldsAccess(template, previousValues)
      const value = { id: '1', customerId: '500', driverName: 'Иванов Иван Иванович', status: 'done' }
      expect(access.validate('automation', RecordAction.UPDATE, value)).toEqual({
        action: 'update',
        errors: [
          { message: 'Forbidden', name: 'id' },
          { message: 'Forbidden', name: 'customerId' },
        ],
        message: 'Forbidden',
      })
    })
  })
})
