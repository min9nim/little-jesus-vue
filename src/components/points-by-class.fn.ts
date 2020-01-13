import {reactive, computed} from '@vue/composition-api'
import moment from 'moment'
import {req, ascending} from '@/utils'
import {prop, groupBy, path, differenceWith, propEq, map, pathEq, find, filter, isNil} from 'ramda'
import {qPoints} from '@/biz/query'
import {MessageBox} from 'element-ui'
import {IPublicState as IHomeState, IPoint, ITeacher, IStudent} from '@/biz/type'
import {studentToDefaultPointMap, sortKeys} from '@/biz'
import {go, exclude} from 'mingutils'

export interface IState {
  date?: string
  oldDate?: string
  loading: boolean
  points: IPoint[]
  pointsByTeacher?: any
  etcStudents: IStudent[]
}

export interface IAllState {
  root?: any
  state: IState
  homeState?: IHomeState
}

export function useHandleDateChange({props, root, state}) {
  return async (value: string) => {
    if (moment(value, 'YYYYMMDD').format('dddd') !== 'Sunday') {
      await MessageBox.alert('일요일만 선택가능합니다', {type: 'warning'})
      state.date = state.oldDate
      return
    }
    state.oldDate = state.date
    root.$store.commit('setDate', state.date)

    await initPoints({props, root, state})
  }
}

export function useBeforeMount({props, root, state}) {
  return async () => {
    if (root.$store.state.teachers.length === 0) {
      return
    }
    await initPoints({props, root, state})
  }
}
export async function initPoints({props, root, state}) {
  const {pointMenus} = root.$store.state
  const defaultPoint = studentToDefaultPointMap(pointMenus)
  state.loading = true
  const result: any = await req(qPoints, {
    date: state.date,
  })
  state.loading = false

  const allStudentPoints = go(
    result.res,
    filter((point: any) => root.$store.getters.studentMap[point.owner]), // 혹시 삭제된 학생의 포인트가 있다면 제거
    map((point: any) => ({
      ...point,
      owner: root.$store.getters.studentMap[point.owner],
    })),
  )

  const {points, pointsByTeacher} = getPointsByTeacher({
    allStudentPoints,
    allTeachers: root.$store.state.teachers,
    defaultPoint,
    etcStudents: state.etcStudents,
    useDefaultPoint: props.useDefaultPoint,
  })
  state.pointsByTeacher = pointsByTeacher
  state.points = points
}

export function getPointsByTeacher({
  allStudentPoints,
  allTeachers,
  defaultPoint,
  etcStudents,
  useDefaultPoint,
}) {
  // 반미정 친구들 제외
  const points: IPoint[] = go(allStudentPoints, exclude(pathEq(['owner', 'teacher'], null)))
  // @ts-ignore
  const pointsByTeacher = groupBy(path(['owner', 'teacher', 'name']))(points)
  if (useDefaultPoint) {
    allTeachers.forEach(teacher => {
      if (!pointsByTeacher[teacher.name]) {
        pointsByTeacher[teacher.name] = []
      }
    })
  }
  Object.entries(pointsByTeacher).forEach(([teacherName, points]: any) => {
    let students = go(
      allTeachers,
      find(propEq('name', teacherName)),
      prop('students'),
      exclude(isNil), // 이상하게 학생들 중 undefined 가 포함된 경우가 발견되서 제외시킴 -19/12/28 mgsong
    )
    // console.log(JSON.stringify(points, null, 2))
    if (students.length !== points.length) {
      // 포인트 입력 후 신규학생을 반에 추가 배정한 경우
      // console.log(44, students)
      const newStudents = differenceWith(isEqualStudent, students, points)
      const pointsOfNewStudents = newStudents.map(defaultPoint)
      points.push(...pointsOfNewStudents)
    }
    points.sort(ascending(path(['owner', 'name'])))
  })

  // 아직 포인트입력 안한 선생님들 목록에 추가
  const diffTeachers: ITeacher[] = differenceWith(
    (t1, t2) => t1.name === t2,
    allTeachers,
    Object.keys(pointsByTeacher),
  )
  diffTeachers.forEach(teacher => {
    pointsByTeacher[teacher.name] = []
    const points = teacher.students.map(defaultPoint)
    points.push(...points)
  })

  // 반미정인 친구들 목록에 추가
  pointsByTeacher['반미정'] = getEtcStudentPoints({
    allStudentPoints,
    etcStudents,
    defaultPoint,
  })
  points.push(...pointsByTeacher['반미정'])

  // console.log(points.map(path(['owner', 'name'])))

  return {
    points,
    pointsByTeacher: sortKeys(pointsByTeacher),
  }
}

export function getEtcStudentPoints({allStudentPoints, etcStudents, defaultPoint}) {
  const etcStudentPoints: any = filter<IPoint>(pathEq(['owner', 'teacher'], null))(allStudentPoints)
  // console.log('etcStudentPoints.length = ', etcStudentPoints.length)
  // console.log('state.etcStudents.length = ', state.etcStudents.length)
  if (etcStudentPoints.length !== etcStudents.length) {
    const newStudents = differenceWith(isEqualStudent, etcStudents, etcStudentPoints)
    const pointsOfNewStudents = newStudents.map(defaultPoint)
    etcStudentPoints.push(...pointsOfNewStudents)
  }
  return etcStudentPoints
}

export function isEqualStudent(a: IStudent, b: IPoint) {
  if (!b.owner) {
    // console.warn('owner 없는 포인트가 있다고? differenceWith 버그인가?', b)
    return false
  }
  if (!a) {
    throw Error('a is not defined')
  }
  if (!b.owner) {
    throw Error('b.owner is not defined')
  }
  return a._id === b.owner._id
}

export function useState({props, root}: any): IState {
  const state: IState = reactive({
    date:
      props.date ||
      root.$store.state.date ||
      moment()
        .startOf('week')
        .format('YYYYMMDD'),
    loading: true,
    points: [],
    dateFormatted: computed(() => moment(state.date, 'YYYYMMDD').format('M월 D일')),
    etcStudents: computed(() => {
      if (root.$store.state.teachers.length === 0) {
        return []
      }
      const nullTeacher = root.$store.state.teachers.find(propEq('name', '반미정'))
      if (!nullTeacher) {
        return []
      }
      return nullTeacher.students
    }),
  })
  state.oldDate = state.date
  root.$store.commit('setDate', state.date)
  return state
}

export function useHandleClick(root: any, state, homeState: IHomeState) {
  return (teacherName: string) => {
    const tab1 = window.document.getElementById('tab-/')
    if (!tab1) {
      throw Error('Not found tab1')
    }
    root.$store.commit('setDate', state.date)
    tab1.click()
    const teacher = root.$store.state.teachers.find(propEq('name', teacherName))
    if (!teacher) {
      throw Error('Not found teacher')
    }
    homeState.teacherId = teacher._id
    // root.$router.push('/?edit')
  }
}
