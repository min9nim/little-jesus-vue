import {reactive} from '@vue/composition-api'
import {req, go, nameAscending} from '@/utils'
import {propEq, prop, find, differenceWith, isNil, filter, pathEq, path} from 'ramda'
import moment from 'moment'
import {qCreatePoint, qInitialize, qPoints, qUpdatePoint, qRemovePoint} from '@/biz/query'
import {MessageBox, Notification} from 'element-ui'
import {IPublicState, ITeacher, IPoint, IStudent, IPointMenu} from '@/biz/type'

export interface IState {
  date?: string
  oldDate?: string
  loading: boolean
  pointInit?: boolean
  editable?: boolean
}

export interface IAllState {
  root?: any
  state: IState
  publicState?: IPublicState
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

let publicState: IPublicState
export function usePublicState(): IPublicState {
  if (publicState) {
    return publicState
  }
  publicState = reactive({
    teacherId: localStorage.getItem('teacherId') || '',
    teachers: [] as ITeacher[],
    points: [],
  })
  return publicState
}

export function useBeforeMount({root, state, publicState}: any) {
  return async () => {
    if (root.$store.state.teachers.length === 0) {
      await initialize({root, state, publicState})
    }
    await initPoints({root, state, publicState})
    // console.log(root.$route)
    if (root.$route.fullPath === '/?edit') {
      state.editable = true
    }
  }
}

// const studentToDefaultPointMap = (student: IStudent) => {
//   return {
//     owner: student,
//     attendance: false,
//     visitcall: false,
//     meditation: 0,
//     invitation: 0,
//     recitation: false,
//     etc: '',
//   }
// }
const studentToDefaultPointMap = (student: IStudent, pointMenus: IPointMenu[]) => {
  return {
    owner: student,
    items: pointMenus.map((menu: IPointMenu) => ({
      _id: menu._id,
      value: 0,
    })),
    etc: '',
  }
}
export async function initPoints({root, state, publicState}: any) {
  if (isNil(publicState.teacherId)) {
    publicState.points = []
    return
  }
  state.loading = true
  const result: any = await req(qPoints, {
    date: state.date,
    teacherId: publicState.teacherId || null,
  })
  state.loading = false
  let points: IPoint[] = result.res
  if (publicState.teacherId === '') {
    // 반미정을 선택한 경우에는 전체 포인트목록이 리턴되는데 이를 필터링해야 한다.
    points = filter(pathEq(['owner', 'teacher'], null))(points)
    // console.log({points})
  }
  let students = go(
    root.$store.state.teachers,
    find(propEq('_id', publicState.teacherId)),
    prop('students'),
  )
  points.sort(nameAscending(path(['owner', 'name'])))
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
    const pointsOfNewStudents = newStudnets.map(student =>
      studentToDefaultPointMap(student, root.$store.state.pointMenus),
    )
    points.push(...pointsOfNewStudents)
  }

  if (points.length > 0) {
    publicState.points = points
    state.pointInit = true
    state.editable = false
    return
  }
  const teacher: ITeacher | undefined = root.$store.state.teachers.find(
    propEq('_id', publicState.teacherId),
  )
  if (!teacher) {
    console.warn('Teacher is not selected yet')
    return
  }

  publicState.points = teacher.students.map(student =>
    studentToDefaultPointMap(student, root.$store.state.pointMenus),
  )
  state.pointInit = false
  state.editable = true
}

export async function initialize({root, state}: IAllState) {
  state.loading = true
  const result = await req(qInitialize)
  state.loading = false

  // 포인트메뉴 상태 초기화
  root.$store.commit('setPointMenus', result.pointMenus)

  // api 결과를 정렬
  result.teachers.forEach((teacher: any) => {
    teacher.students.sort(nameAscending(path(['name'])))
  })
  result.teachers.sort(nameAscending(path(['name'])))

  // 선생님목록 상태 초기화
  root.$store.commit('setTeachers', result.teachers)
  const etcStudents = result.students.filter(propEq('teacher', null))
  if (etcStudents.length > 0) {
    root.$store.commit('addTeacher', {
      _id: '',
      name: '반미정',
      students: etcStudents,
    })
  }
}

export function useHandleSave({state, publicState}: IAllState) {
  return async () => {
    if (state.pointInit) {
      await updatePoint({state, publicState})
    } else {
      await createPoint({state, publicState})
    }
  }
}

export async function updatePoint({state, publicState}: any) {
  state.loading = true
  const results = publicState.points.map((point: IPoint) => {
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

export async function createPoint({state, publicState}: any) {
  state.loading = true
  const results = publicState.points.map((point: any) => {
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
  publicState.points = resolvedList.map(prop('res')) // 생성된 _id 세팅
  state.loading = false
  state.pointInit = true
  state.editable = false
  // await Message({message: '저장 완료', type: 'success'})
  // @ts-ignore
  Notification.success({message: '저장 완료', position: 'bottom-right'})
}

export function useHandleDateChange({root, state, publicState}: IAllState) {
  return async (value: string) => {
    if (moment(value, 'YYYYMMDD').format('dddd') !== 'Sunday') {
      await MessageBox.alert('일요일만 선택가능합니다', {type: 'warning'})
      state.date = state.oldDate
      return
    }
    state.oldDate = state.date
    await initPoints({root, state, publicState})
  }
}

export function useHandleTeacherChange({root, state, publicState}: IAllState) {
  return async (teacherId: string) => {
    localStorage.setItem('teacherId', teacherId)
    await initPoints({root, state, publicState})
  }
}

export function useHandleEdit({state}: {state: IState}) {
  return () => {
    state.editable = true
  }
}
export function useHandleRemove({root, state}: any) {
  return async () => {
    try {
      await MessageBox.confirm('입력했던 내용을 전부 삭제합니다', {type: 'warning'})
      const publicState = usePublicState()
      state.loading = true
      const results: Array<Promise<any>> = publicState.points.map(point =>
        req(qRemovePoint, {_id: point._id}),
      )
      await Promise.all(results)
      state.loading = false
      // await Message({message: '삭제 완료', type: 'success'})
      // @ts-ignore
      Notification.success({message: '삭제 완료', position: 'bottom-right'})

      await initPoints({root, state, publicState})
    } catch (e) {
      if (e !== 'cancel') {
        throw e
      }
    }
  }
}
