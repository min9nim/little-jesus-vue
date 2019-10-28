import {reactive, computed} from '@vue/composition-api'
import {req} from '@/utils'
import {propEq} from 'ramda'
import moment from 'moment'
import {qCreatePoint, qTeachers, qPoints} from '@/biz/query'
import {MessageBox} from 'element-ui'

export interface IStudent {
  _id: string
  name: string
}
export interface ITeacher {
  _id: string
  name: string
  students: IStudent[]
}
export interface IPoint {
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

export interface IUseHandleSave {
  state: IState
  globalState: IGlobalState
}

export interface IState {
  date: string
  loading: boolean
  pointInit: boolean
}

export interface IGlobalState {
  teacherId?: string
  teachers: ITeacher[]
  points: IPoint[]
}

export function useState(): IState {
  return reactive({
    teachers: [] as ITeacher[],
    date: moment()
      .startOf('week')
      .format('YYYYMMDD'),
    loading: false,
    pointInit: false,
  })
}

let globalState: IGlobalState
export function useGlobalState(): IGlobalState {
  if (globalState) {
    return globalState
  }
  globalState = reactive({
    teacherId: localStorage.getItem('teacherId') || '',
    teachers: [] as ITeacher[],
    points: [],
  })
  return globalState
}

export function useBeforeMount({state}: any) {
  return async () => {
    state.loading = true
    await initTeachers(state)
    await initPoints(state)
    state.loading = false
  }
}
export async function initPoints(state: IState) {
  const result: any = await req(qPoints, {
    date: state.date,
    teacherId: globalState.teacherId,
  })
  const points: IPoint[] = result.res

  if (points.length > 0) {
    globalState.points = points
    state.pointInit = true
    return
  }
  const teacher: ITeacher | undefined = globalState.teachers.find(
    propEq('_id', globalState.teacherId),
  )
  if (!teacher) {
    throw Error('Teacher not found')
  }
  globalState.points = teacher.students.map(student => {
    return {
      owner: {
        _id: student._id,
        name: student.name,
      },
      attendance: false,
      visitcall: false,
      meditation: 0,
      invitation: 0,
      recitation: false,
      etc: '',
    }
  })
  state.pointInit = false
}

export async function initTeachers(state: IState) {
  const teachers = window.localStorage.getItem('teachers')
  if (teachers) {
    globalState.teachers = JSON.parse(teachers)
  } else {
    const result = await req(qTeachers)
    globalState.teachers = result.res
    localStorage.setItem('teachers', JSON.stringify(globalState.teachers))
  }
}

export function useHandleSave({state, globalState}: IUseHandleSave) {
  return async () => {
    state.loading = true
    const results = globalState.points.map(point => {
      return req(qCreatePoint, {
        owner: point.owner._id,
        date: state.date,
        attendance: point.attendance,
        visitcall: point.visitcall,
        meditation: point.meditation,
        recitation: point.recitation,
        invitation: point.invitation,
        etc: point.etc,
      })
    })
    await Promise.all(results)
    await MessageBox.alert('저장 완료', {type: 'success'})
    state.loading = false
    state.pointInit = true
  }
}
