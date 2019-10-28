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
    loading: true,
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
    points: computed(() => {
      const teacher: ITeacher | undefined = globalState.teachers.find(
        propEq('_id', globalState.teacherId),
      )
      if (!teacher) {
        return []
      }
      return teacher.students.map(student => {
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
    }),
  })
  return globalState
}

export function useBeforeMount({state}: any) {
  return async () => {
    await initTeachers(state)
    await initPoints(state)
  }
}
async function initPoints(state: IState) {
  const points: IPoint[] = await req(qPoints, {
    date: state.date,
    teacherId: globalState.teacherId,
  })
  globalState.points = points
  state.pointInit = true
}
async function initTeachers(state: IState) {
  const teachers = window.localStorage.getItem('teachers')
  if (teachers) {
    globalState.teachers = JSON.parse(teachers)
    state.loading = false
    return
  } else {
    const result = await req(qTeachers)
    globalState.teachers = result.res
    state.loading = false
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
