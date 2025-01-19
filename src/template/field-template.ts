import { PropValue } from '../props'

export interface FieldTemplate {
  name: string
  type: string
  title: string
  example: string
  defaultValue?: PropValue
}
