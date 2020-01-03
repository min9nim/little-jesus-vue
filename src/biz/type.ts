export interface IStudent {
  _id: string
  name: string
  teacher: {
    _id: string
    name: string
  }
}
export interface ITeacher {
  _id: string
  name: string
  students: IStudent[]
}
export interface IPointMenu {
  _id: string
  label: string
  type: string
  defaultValue: string
  hidden: boolean
  disable: boolean
}
export interface IPoint {
  _id?: string
  owner: {
    _id: string
    name: string
    teacher: {
      _id?: string
      name: string
    }
  }
  date?: string
  attendance?: boolean
  visitcall?: boolean
  meditation?: number
  invitation?: number
  recitation?: boolean
  items: any[]
  etc: string
}

export interface IPublicState {
  teacherId?: string
  teachers: ITeacher[]
  points: IPoint[]
}
