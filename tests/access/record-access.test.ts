import { AccessibleTemplate } from '../../src/template/accessible-template'
import { FieldTemplate } from '../../src/template/field-template'
import { RecordAction } from '../../src/access/rbac'
import { RecordAccess } from '../../src/access/record.access'

describe('RecordAccess', () => {
  let template: AccessibleTemplate<FieldTemplate>

  beforeEach(() => {
    template = {
      name: 'SomeObject',
      title: 'SomeObject does something',
      fields: [],
      access: [
        { role: 'customer', actions: [RecordAction.READ, RecordAction.CREATE], condition: {} },
        { role: 'customer', actions: [RecordAction.UPDATE], condition: { status: 'in-assembly' } },
        { role: 'executor', actions: [RecordAction.READ, RecordAction.CREATE], condition: {} },
        { role: 'executor', actions: [RecordAction.UPDATE], condition: { status: 'executor' } },
        { role: 'automation', actions: [RecordAction.READ, RecordAction.UPDATE], condition: { status: 'automation' } },
      ],
    }
  })

  describe('customer', () => {
    test('can read record', () => {
      const access = new RecordAccess(template, {})
      const value = { id: '1', customerId: '2', status: 'automation', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('customer', RecordAction.READ, value)).toBeNull()
    })

    test('can create record', () => {
      const access = new RecordAccess(template, {})
      const value = { driverName: 'Иванов Иван Иванович' }
      expect(access.validate('customer', RecordAction.CREATE, value)).toBeNull()
    })

    test('can update record if status is in-assembly', () => {
      const previousValues = { status: 'in-assembly' }
      const access = new RecordAccess(template, previousValues)
      const value = { driverName: 'Иванов Иван Иванович' }
      expect(access.validate('customer', RecordAction.UPDATE, value)).toBeNull()
    })

    test('can not update record if status is not in-assembly', () => {
      const previousValues = { status: 'executor' }
      const access = new RecordAccess(template, previousValues)
      const value = { driverName: 'Иванов Иван Иванович' }
      expect(access.validate('customer', RecordAction.UPDATE, value)).toEqual({
        action: 'update',
        errors: [],
        message: 'Forbidden',
      })
    })
  })

  describe('executor', () => {
    test('can read record', () => {
      const access = new RecordAccess(template, {})
      const value = { id: '1', customerId: '2', status: 'automation', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('executor', RecordAction.READ, value)).toBeNull()
    })

    test('can create record', () => {
      const access = new RecordAccess(template, {})
      const value = { customerId: '2', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('executor', RecordAction.CREATE, value)).toBeNull()
    })

    test('can update record if status is executor', () => {
      const previousValues = { status: 'executor' }
      const access = new RecordAccess(template, previousValues)
      const value = { driverName: 'Иванов Иван Иванович' }
      expect(access.validate('executor', RecordAction.UPDATE, value)).toBeNull()
    })

    test('can not update record if status is not executor', () => {
      const previousValues = { status: 'automation' }
      const access = new RecordAccess(template, previousValues)
      const value = { driverName: 'Иванов Иван Иванович' }
      expect(access.validate('executor', RecordAction.UPDATE, value)).toEqual({
        action: 'update',
        errors: [],
        message: 'Forbidden',
      })
    })
  })

  describe('automation', () => {
    test('can read record if status is automation', () => {
      const previousValues = { status: 'automation' }
      const access = new RecordAccess(template, previousValues)
      const value = { id: '1', customerId: '2', status: 'automation', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('automation', RecordAction.READ, value)).toBeNull()
    })

    test('can not read record if status is not automation', () => {
      const access = new RecordAccess(template, { status: 'executor' })
      const value = { id: '1', customerId: '2', status: 'automation', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('automation', RecordAction.READ, value)).toEqual({
        action: 'read',
        errors: [],
        message: 'Forbidden',
      })
    })

    test('can not create', () => {
      const access = new RecordAccess(template, {})
      const value = { customerId: '2', status: 'automation', driverName: 'Иванов Иван Иванович' }
      expect(access.validate('automation', RecordAction.CREATE, value)).toEqual({
        action: 'create',
        errors: [],
        message: 'Forbidden',
      })
    })

    test('can update record if status is automation', () => {
      const previousValues = { status: 'automation' }
      const access = new RecordAccess(template, previousValues)
      const value = { driverName: 'Иванов Иван Иванович' }
      expect(access.validate('automation', RecordAction.UPDATE, value)).toBeNull()
    })

    test('can not update record if status is not automation', () => {
      const previousValues = { status: 'executor' }
      const access = new RecordAccess(template, previousValues)
      const value = { driverName: 'Иванов Иван Иванович' }
      expect(access.validate('automation', RecordAction.UPDATE, value)).toEqual({
        action: 'update',
        errors: [],
        message: 'Forbidden',
      })
    })
  })
})
