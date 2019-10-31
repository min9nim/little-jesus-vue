import {reactive, computed} from '@vue/composition-api'
import moment from 'moment'
import {req} from '@/utils'
import {prop, groupBy, path, differenceWith} from 'ramda'
import {qPoints} from '@/biz/query'
import {MessageBox} from 'element-ui'
import {IGlobalState, IPoint, ITeacher} from '@/biz/type'
import {initTeachers} from './home.fn'

export interface IState {
  date?: string
  oldDate?: string
  loading: boolean
  points: IPoint[]
  pointsByTeacher?: any
}

export interface IComputed {
  attendanceSum: number
  visitcallSum: number
  meditationSum: number
  recitationSum: number
  invitationSum: number
}

export interface IAllState {
  state: IState
  globalState: IGlobalState
}

export function useHandleDateChange({state, globalState}: IAllState) {
  return async (value: string) => {
    if (moment(value, 'YYYYMMDD').format('dddd') !== 'Sunday') {
      await MessageBox.alert('일요일만 선택가능합니다', {type: 'warning'})
      state.date = state.oldDate
      return
    }
    state.oldDate = state.date

    await initPoints({state, globalState})
  }
}

export function useBeforeMount({state, globalState}: IAllState) {
  return async () => {
    if (globalState.teachers.length === 0) {
      await initTeachers({state, globalState})
    }
    await initPoints({state, globalState})
  }
}
export async function initPoints({state, globalState}: IAllState) {
  state.loading = true
  const result: any = await req(qPoints, {
    date: state.date,
  })
  state.loading = false
  const points: IPoint[] = result.res
  state.points = points
  // @ts-ignore
  state.pointsByTeacher = groupBy(path(['owner', 'teacher', 'name']))(points)
  const teachers = globalState.teachers.map(prop('name'))

  const diffTeachers: ITeacher[] = differenceWith(
    (t1, t2) => t1.name === t2,
    globalState.teachers,
    Object.keys(state.pointsByTeacher),
  )
  diffTeachers.forEach(teacher => {
    state.pointsByTeacher[teacher.name] = []
    const points = teacher.students.map(student => ({
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
    }))
    state.points.push(...points)
  })
}

export function useState(): IState {
  const state: IState = reactive({
    date: moment()
      .startOf('week')
      .format('YYYYMMDD'),
    loading: false,
    points: [],
  })
  state.oldDate = state.date
  return state
}

export function useComputed(state: IState) {
  const attendanceReducer = (acc: number, point: IPoint) => acc + (point.attendance ? 1 : 0)
  const visitcallReducer = (acc: number, point: IPoint) => acc + (point.visitcall ? 1 : 0)
  const recitationReducer = (acc: number, point: IPoint) => acc + (point.recitation ? 1 : 0)
  const meditationReducer = (acc: number, point: IPoint) => acc + point.meditation
  const invitationReducer = (acc: number, point: IPoint) => acc + point.invitation
  return reactive({
    attendanceSum: computed(() => state.points.reduce(attendanceReducer, 0)),
    visitcallSum: computed(() => state.points.reduce(visitcallReducer, 0)),
    meditationSum: computed(() => state.points.reduce(meditationReducer, 0)),
    recitationSum: computed(() => state.points.reduce(recitationReducer, 0)),
    invitationSum: computed(() => state.points.reduce(invitationReducer, 0)),
  })
}
