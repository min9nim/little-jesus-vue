import {reactive} from '@vue/composition-api'
import {req} from '@/utils'
import {propEq, prop} from 'ramda'
import moment from 'moment'
import {qCreatePoint, qTeachers, qPoints, qUpdatePoint, qRemovePoint} from '@/biz/query'
import {Message, MessageBox} from 'element-ui'
import {IGlobalState, IPoint, ITeacher} from '@/biz/type'

export interface IState {
  date?: string
  loading: boolean
  pointInit?: boolean
  editable?: boolean
}

export interface IAllState {
  state: IState
  globalState: IGlobalState
}

export function useState(): IState {
  return reactive({
    teachers: [] as ITeacher[],
    date: moment()
      .startOf('week')
      .format('YYYYMMDD'),
    loading: false,
    pointInit: false,
    editable: false,
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
    points: [],
  })
  return globalState
}

export function useBeforeMount({state, globalState}: IAllState) {
  return async () => {
    await initTeachers({state, globalState})
    await initPoints({state, globalState})
  }
}
export async function initPoints({state, globalState}: IAllState) {
  state.loading = true
  const result: any = await req(qPoints, {
    date: state.date,
    teacherId: globalState.teacherId,
  })
  state.loading = false
  const points: IPoint[] = result.res

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
    throw Error('Teacher not found')
  }
  globalState.points = teacher.students.map(student => {
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
  state.pointInit = false
  state.editable = true
}

export async function initTeachers({state, globalState}: IAllState) {
  const teachers = window.localStorage.getItem('teachers')
  if (teachers) {
    globalState.teachers = JSON.parse(teachers)
  } else {
    state.loading = true
    const result = await req(qTeachers)
    state.loading = false
    globalState.teachers = result.res
    localStorage.setItem('teachers', JSON.stringify(globalState.teachers))
  }
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
  await Message({message: '저장 완료', type: 'success'})
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
  await Message({message: '저장 완료', type: 'success'})
}

export function useHandleDateChange({state, globalState}: IAllState) {
  return async () => {
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
      await Message({message: '삭제 완료', type: 'success'})
      await initPoints({state, globalState})
    } catch (e) {
      if (e !== 'cancel') {
        throw e
      }
    }
  }
}
