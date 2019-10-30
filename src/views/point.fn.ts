import {reactive} from '@vue/composition-api'
import moment from 'moment'
import {req} from '@/utils'
import {propEq, prop} from 'ramda'
import {qCreatePoint, qTeachers, qPoints, qUpdatePoint} from '@/biz/query'
import {Message} from 'element-ui'
import {IGlobalState, IPoint, ITeacher} from '@/biz/type'

export interface IState {
  date: string
  loading: boolean
  points: IPoint[]
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
