import _ from 'lodash'
import { Props } from '../props'
import { RecordAction } from './rbac'
import { AccessError } from './access.error'

export abstract class Access<Template> {
  protected readonly template: Template
  protected readonly previousValues: Props

  public constructor(template: Template, previousValues: Props) {
    this.template = template
    this.previousValues = previousValues
  }

  public abstract validate(role: string, action: RecordAction, values: Props): AccessError | null

  protected checkCondition(condition: Props): boolean {
    for (const [key, value] of Object.entries(condition)) {
      if (!_.isEqual(value, this.previousValues[key])) return false
    }

    return true
  }
}
