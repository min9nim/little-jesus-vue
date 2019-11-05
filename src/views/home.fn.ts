import {reactive} from '@vue/composition-api'
import {req, go} from '@/utils'
import {propEq, prop, find, differenceWith, isNil, filter, pathEq} from 'ramda'
import moment from 'moment'
import {
  qCreatePoint,
  qTeachers,
  qTeachersAndStudents,
  qPoints,
  qUpdatePoint,
  qRemovePoint,
} from '@/biz/query'
import {MessageBox, Notification} from 'element-ui'
import {IGlobalState, ITeacher, IPoint, IStudent} from '@/biz/type'

export interface IState {
  date?: string
  oldDate?: string
  loading: boolean
  pointInit?: boolean
  editable?: boolean
}

export interface IAllState {
  state: IState
  globalState: IGlobalState
}

export function useState(): IState {
  const state: IState = reactive({
    teachers: [] as ITeacher[],
    date: moment()
      .startOf('week')
      .format('YYYYMMDD'),
    loading: false,
    pointInit: false,
    editable: false,
  })
  state.oldDate = state.date
  return state
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

export function useBeforeMount({root, state, globalState}: any) {
  return async () => {
    if (globalState.teachers.length === 0) {
      await initTeachers({state, globalState})
    }
    await initPoints({state, globalState})
    // console.log(root.$route)
    if (root.$route.fullPath === '/?edit') {
      state.editable = true
    }
  }
}

const studentToDefaultPointMap = (student: IStudent) => {
  return {
    owner: student,
    attendance: false,
    visitcall: false,
    meditation: 0,
    invitation: 0,
    recitation: false,
    etc: '',
  }
}

export async function initPoints({state, globalState}: IAllState) {
  if (isNil(globalState.teacherId)) {
    globalState.points = []
    return
  }
  state.loading = true
  const result: any = await req(qPoints, {
    date: state.date,
    teacherId: globalState.teacherId || null,
  })
  state.loading = false
  let points: IPoint[] = result.res
  if (globalState.teacherId === '') {
    // 반미정을 선택한 경우에는 전체 포인트목록이 리턴되는데 이를 필터링해야 한다.
    points = filter(pathEq(['owner', 'teacher'], null))(points)
    console.log({points})
  }
  let students = go(
    globalState.teachers,
    find(propEq('_id', globalState.teacherId)),
    prop('students'),
  )
  if (result.res.length > 0 && students.length !== result.res.length) {
    // 포인트 입력 후 신규학생을 반에 추가 배정한 경우
    const newStudnets = differenceWith(
      (a: any, b: any) => {
        if (!b.owner) {
          // console.warn('여기도 owner 없는 포인트가 있다고? differenceWith 버그인가?', b)
          return false
        }

        return a._id === b.owner._id
      },
      students,
      result.res,
    )
    const pointsOfNewStudents = newStudnets.map(studentToDefaultPointMap)
    points.push(...pointsOfNewStudents)
  }

  if (points.length > 0) {
    globalState.points = points
    state.pointInit = true
    state.editable = false
    return
  }
  const teacher: ITeacher | undefined = globalState.teachers.find(
    propEq('_id', globalState.teacherId),
  )
  if (!teacher) {
    console.warn('Teacher is not selected yet')
    return
  }

  globalState.points = teacher.students.map(studentToDefaultPointMap)
  state.pointInit = false
  state.editable = true
}

export async function initTeachers({state, globalState}: IAllState) {
  state.loading = true
  const result = await req(qTeachersAndStudents)
  state.loading = false
  globalState.teachers = result.teachers
  globalState.teachers.push({
    _id: '',
    name: '반미정',
    students: result.students.filter(propEq('teacher', null)),
  })
}

export function useHandleSave({state, globalState}: IAllState) {
  return async () => {
    if (state.pointInit) {
      await updatePoint({state, globalState})
    } else {
      await createPoint({state, globalState})
    }
  }
}

export async function updatePoint({state, globalState}: IAllState) {
  state.loading = true
  const results = globalState.points.map(point => {
    if (!point._id) {
      // 최초 포인트입력 이후 신규로 추가된 학생이 있는 경우
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
    }
    return req(qUpdatePoint, {
      _id: point._id,
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
  state.loading = false
  state.pointInit = true
  state.editable = false
  // @ts-ignore
  Notification.success({message: '저장 완료', position: 'bottom-right'})
  // await Message({message: '저장 완료', type: 'success'})
}

export async function createPoint({state, globalState}: IAllState) {
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
  const resolvedList: any = await Promise.all(results)
  globalState.points = resolvedList.map(prop('res')) // 생성된 _id 세팅
  state.loading = false
  state.pointInit = true
  state.editable = false
  // await Message({message: '저장 완료', type: 'success'})
  // @ts-ignore
  Notification.success({message: '저장 완료', position: 'bottom-right'})
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

export function useHandleTeacherChange({state, globalState}: IAllState) {
  return async (teacherId: string) => {
    localStorage.setItem('teacherId', teacherId)
    await initPoints({state, globalState})
  }
}

export function useHandleEdit({state}: {state: IState}) {
  return () => {
    state.editable = true
  }
}
export function useHandleRemove({state}: {state: IState}) {
  return async () => {
    try {
      await MessageBox.confirm('입력했던 내용을 전부 삭제합니다', {type: 'warning'})
      const globalState = useGlobalState()
      state.loading = true
      const results: Array<Promise<any>> = globalState.points.map(point =>
        req(qRemovePoint, {_id: point._id}),
      )
      await Promise.all(results)
      state.loading = false
      // await Message({message: '삭제 완료', type: 'success'})
      // @ts-ignore
      Notification.success({message: '삭제 완료', position: 'bottom-right'})

      await initPoints({state, globalState})
    } catch (e) {
      if (e !== 'cancel') {
        throw e
      }
    }
  }
}
