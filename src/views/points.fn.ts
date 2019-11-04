import {reactive, computed} from '@vue/composition-api'
import moment from 'moment'
import {req, go} from '@/utils'
import {prop, groupBy, path, differenceWith, propEq, pathEq, find} from 'ramda'
import {qPoints} from '@/biz/query'
import {MessageBox} from 'element-ui'
import {IGlobalState, IPoint, ITeacher} from '@/biz/type'
import {initTeachers} from './home.fn'
import {studentToDefaultPointMap} from '@/biz'

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
  // const points: IPoint[] = exclude(pathEq(['owner', 'teacher'], null))(result.res)
  const points = result.res

  state.points = points
  // @ts-ignore
  state.pointsByTeacher = groupBy(path(['owner', 'teacher', 'name']))(points)
  Object.entries(state.pointsByTeacher).forEach(([teacherName, points]: any) => {
    let students = go(globalState.teachers, find(propEq('name', teacherName)), prop('students'))
    // console.log(JSON.stringify(points, null, 2))
    if (students.length !== points.length) {
      // 포인트 입력 후 신규학생을 반에 추가 배정한 경우
      const newStudnets = differenceWith(
        (a: any, b: any) => {
          if (!b.owner) {
            console.warn('owner 없는 포인트가 있다고? differenceWith 버그인가?', b)
            return false
          }
          return a._id === b.owner._id
        },
        students,
        points,
      )
      const pointsOfNewStudents = newStudnets.map(studentToDefaultPointMap)
      points.push(...pointsOfNewStudents)
    }
  })

  const diffTeachers: ITeacher[] = differenceWith(
    (t1, t2) => t1.name === t2,
    globalState.teachers,
    Object.keys(state.pointsByTeacher),
  )
  diffTeachers.forEach(teacher => {
    state.pointsByTeacher[teacher.name] = []
    const points = teacher.students.map(studentToDefaultPointMap)
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

export function useHandleClick(globalState: IGlobalState) {
  return (teacherName: string) => {
    const teacher = globalState.teachers.find(propEq('name', teacherName))
    if (!teacher) {
      throw Error('Not found teacher')
    }
    globalState.teacherId = teacher._id
  }
}
