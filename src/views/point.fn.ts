import {reactive, computed} from '@vue/composition-api'
import moment from 'moment'
import {req} from '@/utils'
import {propEq, prop} from 'ramda'
import {qCreatePoint, qTeachers, qPoints, qUpdatePoint} from '@/biz/query'
import {Message} from 'element-ui'
import {IGlobalState, IPoint, ITeacher} from '@/biz/type'

export interface IState {
  date?: string
  loading?: boolean
  points: IPoint[]
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
  return async () => {
    await initPoints({state, globalState})
  }
}

export function useBeforeMount({state, globalState}: IAllState) {
  return async () => {
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

  // const teacher: ITeacher | undefined = globalState.teachers.find(
  //   propEq('_id', globalState.teacherId),
  // )
  // if (!teacher) {
  //   throw Error('Teacher not found')
  // }
  // globalState.points = teacher.students.map(student => {
  //   return {
  //     owner: {
  //       _id: student._id,
  //       name: student.name,
  //     },
  //     attendance: false,
  //     visitcall: false,
  //     meditation: 0,
  //     invitation: 0,
  //     recitation: false,
  //     etc: '',
  //   }
  // })
}

export function useState(): IState {
  return reactive({
    date: moment()
      .startOf('week')
      .format('YYYYMMDD'),
    loading: false,
    points: [],
  })
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
