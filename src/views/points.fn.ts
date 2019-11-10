import {reactive, computed} from '@vue/composition-api'
import moment from 'moment'
import {req, go, exclude, nameAscending} from '@/utils'
import {prop, groupBy, path, differenceWith, propEq, pathEq, find, filter} from 'ramda'
import {qPoints} from '@/biz/query'
import {MessageBox} from 'element-ui'
import {IGlobalState, IPoint, ITeacher, IStudent} from '@/biz/type'
import {initTeachers, useGlobalState} from './home.fn'
import {studentToDefaultPointMap} from '@/biz'
import isNil from 'ramda/es/isNil'

export interface IState {
  date?: string
  oldDate?: string
  loading: boolean
  points: IPoint[]
  pointsByTeacher?: any
  etcStudents: IStudent[]
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

  // 반미정 친구들 제외
  const points: IPoint[] = exclude(pathEq(['owner', 'teacher'], null))(result.res)
  if (isNil(points)) {
    throw Error('points is undefined or null')
  }
  state.points = points

  // @ts-ignore
  state.pointsByTeacher = groupBy(path(['owner', 'teacher', 'name']))(points)
  Object.entries(state.pointsByTeacher).forEach(([teacherName, points]: any) => {
    let students = go(globalState.teachers, find(propEq('name', teacherName)), prop('students'))
    // console.log(JSON.stringify(points, null, 2))
    if (students.length !== points.length) {
      // 포인트 입력 후 신규학생을 반에 추가 배정한 경우
      const newStudents = differenceWith(isEqualStudent, students, points)
      const pointsOfNewStudents = newStudents.map(studentToDefaultPointMap)
      points.push(...pointsOfNewStudents)
    }
    points.sort(nameAscending(path(['owner', 'name'])))
  })

  // 아직 포인트입력 안한 선생님들 목록에 추가
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

  // 반미정인 친구들 목록에 추가
  const etcStudentPoints: any = filter<IPoint>(pathEq(['owner', 'teacher'], null))(result.res)
  if (etcStudentPoints.length !== state.etcStudents.length) {
    const newStudents = differenceWith(isEqualStudent, state.etcStudents, etcStudentPoints)
    const pointsOfNewStudents = newStudents.map(studentToDefaultPointMap)
    etcStudentPoints.push(...pointsOfNewStudents)
  }
  state.pointsByTeacher['반미정'] = etcStudentPoints

  // 전체 포인트 합계에 반미정학생들도 추가
  state.points.push(...etcStudentPoints)

  // 선생님 목록 가나다 정렬
  const names = Object.keys(state.pointsByTeacher)
  const tmp: any = {}
  names.sort().forEach(name => {
    tmp[name] = state.pointsByTeacher[name]
  })
  state.pointsByTeacher = tmp
}

export function isEqualStudent(a: IStudent, b: IPoint) {
  if (!b.owner) {
    // console.warn('owner 없는 포인트가 있다고? differenceWith 버그인가?', b)
    return false
  }
  return a._id === b.owner._id
}

export function useState(globalState: IGlobalState): IState {
  const state: IState = reactive({
    date: moment()
      .startOf('week')
      .format('YYYYMMDD'),
    loading: false,
    points: [],
    etcStudents: computed(() => {
      if (globalState.teachers.length === 0) {
        return []
      }
      const nullTeacher = globalState.teachers.find(propEq('name', '반미정'))
      if (!nullTeacher) {
        return []
      }
      return nullTeacher.students
    }),
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
