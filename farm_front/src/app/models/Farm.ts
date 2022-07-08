import { Owner } from './Owner'
export interface Farm {
  id: string
  name: string
  geometry: {
    type: string
    coordinates: number[][][]
  }
  area: number
  centroid: number[]
  creation_date?: Date
  owner: Owner
  owner_id: string
}
