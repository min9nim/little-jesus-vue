import {reactive, computed} from '@vue/composition-api'
import moment from 'moment'
import {req, nameAscending} from '@/utils'
import {prop, groupBy, path, differenceWith, propEq, map, pathEq, find, filter} from 'ramda'
import {qPoints} from '@/biz/query'
import {MessageBox} from 'element-ui'
import {IPublicState as IHomeState, IPoint, ITeacher, IStudent} from '@/biz/type'
import {studentToDefaultPointMap} from '@/biz'
import isNil from 'ramda/es/isNil'
import {go, exclude} from '@mgsong/min-utils'

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

export function useHandleDateChange({root, state}: IAllState) {
  return async (value: string) => {
    if (moment(value, 'YYYYMMDD').format('dddd') !== 'Sunday') {
      await MessageBox.alert('일요일만 선택가능합니다', {type: 'warning'})
      state.date = state.oldDate
      return
    }
    state.oldDate = state.date
    root.$store.commit('setDate', state.date)

    await initPoints({root, state})
  }
}

export function useBeforeMount({root, state}: IAllState) {
  return async () => {
    if (root.$store.state.teachers.length === 0) {
      return
    }
    await initPoints({root, state})
  }
}
export async function initPoints({root, state}: IAllState) {
  const {pointMenus} = root.$store.state
  const defaultPoint = studentToDefaultPointMap(pointMenus)
  state.loading = true
  const result: any = await req(qPoints, {
    date: state.date,
  })
  state.loading = false

  // 반미정 친구들 제외
  const points: IPoint[] = go(
    result.res,
    map((point: any) => ({
      ...point,
      owner: root.$store.getters.studentMap[point.owner],
    })),
    exclude(pathEq(['owner', 'teacher'], null)),
  )

  if (isNil(points)) {
    throw Error('points is undefined or null')
  }
  state.points = points

  // @ts-ignore
  state.pointsByTeacher = groupBy(path(['owner', 'teacher', 'name']))(points)
  Object.entries(state.pointsByTeacher).forEach(([teacherName, points]: any) => {
    let students = go(
      root.$store.state.teachers,
      find(propEq('name', teacherName)),
      prop('students'),
    )
    // console.log(JSON.stringify(points, null, 2))
    if (students.length !== points.length) {
      // 포인트 입력 후 신규학생을 반에 추가 배정한 경우
      const newStudents = differenceWith(isEqualStudent, students, points)
      const pointsOfNewStudents = newStudents.map(defaultPoint)
      points.push(...pointsOfNewStudents)
    }
    points.sort(nameAscending(path(['owner', 'name'])))
  })

  // 아직 포인트입력 안한 선생님들 목록에 추가
  const diffTeachers: ITeacher[] = differenceWith(
    (t1, t2) => t1.name === t2,
    root.$store.state.teachers,
    Object.keys(state.pointsByTeacher),
  )
  diffTeachers.forEach(teacher => {
    state.pointsByTeacher[teacher.name] = []
    const points = teacher.students.map(defaultPoint)
    state.points.push(...points)
  })

  // 반미정인 친구들 목록에 추가
  const etcStudentPoints: any = filter<IPoint>(pathEq(['owner', 'teacher'], null))(result.res)
  if (etcStudentPoints.length !== state.etcStudents.length) {
    const newStudents = differenceWith(isEqualStudent, state.etcStudents, etcStudentPoints)
    const pointsOfNewStudents = newStudents.map(defaultPoint)
    etcStudentPoints.push(...pointsOfNewStudents)
  }
  state.pointsByTeacher['반미정'] = etcStudentPoints

  // 전체 포인트 합계에 반미정학생들도 추가
  // state.points.push(...etcStudentPoints)

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

export function useState(root: any): IState {
  const state: IState = reactive({
    date:
      root.$store.state.date ||
      moment()
        .startOf('week')
        .format('YYYYMMDD'),
    loading: true,
    points: [],
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

export function useHandleClick(root: any, homeState: IHomeState) {
  return (teacherName: string) => {
    const tab1 = window.document.getElementById('tab-/')
    if (!tab1) {
      throw Error('Not found tab1')
    }
    tab1.click()
    const teacher = root.$store.state.teachers.find(propEq('name', teacherName))
    if (!teacher) {
      throw Error('Not found teacher')
    }
    homeState.teacherId = teacher._id
    // root.$router.push('/?edit')
  }
}
