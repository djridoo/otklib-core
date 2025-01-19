import { Props } from '../props'

export enum RecordAction {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
}

export interface RBAC {
  role: string
  actions: RecordAction[]
  condition: Props
}
