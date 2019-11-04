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
export interface IPoint {
  _id?: string
  owner: {
    _id: string
    name: string
  }
  date?: string
  attendance: boolean
  visitcall: boolean
  meditation: number
  invitation: number
  recitation: boolean
  etc: string
}

export interface IGlobalState {
  teacherId?: string
  teachers: ITeacher[]
  points: IPoint[]
}
