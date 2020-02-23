import {reactive} from '@vue/composition-api'
import {req, ascending, errMsg, updateById} from '@/utils'
import {
  clone,
  propEq,
  prop,
  find,
  differenceWith,
  isNil,
  filter,
  pathEq,
  path,
  map,
  equals,
} from 'ramda'
import moment from 'moment'
import {qCreatePoint, qPoints, qUpdatePoint, qRemovePoint} from '@/biz/query'
import {MessageBox, Notification} from 'element-ui'
import {IPublicState, ITeacher, IPoint} from '@/biz/type'
import {findById, go} from 'mingutils'
import {studentToDefaultPointMap} from '@/biz'
import createLogger from 'if-logger'

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

export function useState({root}: any): IState {
  const state: IState = reactive({
    teachers: [] as ITeacher[],
    date:
      root.$store.state.date ||
      moment()
        .startOf('week')
        .format('YYYYMMDD'),
    loading: true,
    pointInit: false,
    editable: false,
    originalPoints: [],
  })
  state.oldDate = state.date
  root.$store.commit('setDate', state.date)
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
    // if (root.$store.state.teachers.length === 0) {
    //   await initialize({root, state, publicState})
    // }
    if (root.$store.state.teachers.length === 0) {
      return
    }
    await initPoints({root, state, publicState})
    // console.log(root.$route)
    if (root.$route.fullPath === '/?edit') {
      state.editable = true
    }
  }
}

export async function initPoints({root, state, publicState}: any) {
  const logger = createLogger().addTags('initPoints')
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

  let points: IPoint[] = go(
    result.res,
    map((point: any) => ({...point, owner: root.$store.getters.studentMap[point.owner]})), // 삭제된 학생 제거
  )
  // console.log(33, points)
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
  points.sort(ascending(path(['owner', 'name'])))
  if (points.length > 0 && students && students.length > points.length) {
    // 포인트 입력 후 신규학생을 반에 추가 배정한 경우
    const newStudnets = differenceWith(
      (a: any, b: any) => {
        if (!b.owner) {
          // 여기를 자꾸 들어온다. 모르겠지만..
          // console.warn('owner 없는 포인트가 있다고? differenceWith 버그인가?', b)
          return false
        }

        return a._id === b.owner._id
      },
      students,
      points,
    )
    const pointsOfNewStudents = newStudnets.map(student =>
      studentToDefaultPointMap(root.$store.state.pointMenus)(student),
    )
    points.push(...pointsOfNewStudents)
  }

  if (points.length > 0) {
    publicState.points = points
    state.originalPoints = clone(publicState.points)
    state.pointInit = true
    state.editable = false
    return
  }
  const teacher: ITeacher | undefined = root.$store.state.teachers.find(
    propEq('_id', publicState.teacherId),
  )
  if (!teacher) {
    logger.warn('Teacher is not selected yet.')
    return
  }

  // console.log(88, teacher.students)
  publicState.points = teacher.students.map(student =>
    studentToDefaultPointMap(root.$store.state.pointMenus)(student),
  )
  state.originalPoints = clone(publicState.points)
  state.pointInit = false
  state.editable = true
}

export function useHandleSave({root, state, publicState}: IAllState) {
  return async () => {
    if (state.pointInit) {
      await updatePoint({state, publicState})
    } else {
      await createPoint({root, state, publicState})
    }
  }
}

export async function updatePoint({state, publicState}: any) {
  const logger = createLogger().addTags('updatePoint')
  try {
    state.loading = true
    const results = publicState.points.map(async (point: IPoint) => {
      if (!point._id) {
        // 최초 포인트입력 이후 신규로 추가된 학생이 있는 경우
        const result = await req(qCreatePoint, {
          owner: point.owner._id,
          date: state.date,
          items: point.items.map((item: any) => ({value: item.value, type: item.type})),
          etc: point.etc,
        })
        return result.res
      }

      const asisPoint = findById(point._id)(state.originalPoints)
      if (equals(point, asisPoint)) {
        logger.info('No changes', point.owner.name)
        return
      }
      const result = await req(qUpdatePoint, {
        _id: point._id,
        owner: point.owner._id,
        date: state.date,
        items: point.items.map((item: any) => ({value: item.value, type: item.type})),
        etc: point.etc,
      })

      // publicState 를 최신상태로 갱신
      // logger.debug('publicState 갱신', result.res)
      // publicState.points = updateById(result._id, {
      //   ...result.res,
      //   owner: root.$store.getters.studentMap[result.res.owner],
      // })(publicState.points)
      // Object.assign(point, {
      //   ...result.res,
      //   owner: root.$store.getters.studentMap[result.res.owner],
      // })

      return result.res
    })
    const resultList = await Promise.all(results)
    logger.debug('resultList:', resultList)
    state.loading = false
    state.pointInit = true
    state.editable = false
    if (resultList.every(isNil)) {
      // @ts-ignore
      Notification.success({message: '저장 완료(변경사항 없음)', position: 'bottom-right'})
    } else {
      // originalPoints 도 갱신
      state.originalPoints = clone(publicState.points)
      logger.debug('변경사항이 있었으니 originalPoints & publicState.points 동기화')

      // @ts-ignore
      Notification.success({message: '저장 완료', position: 'bottom-right'})
    }
  } catch (e) {
    state.loading = false
    state.pointInit = true
    state.editable = false
    logger.error(errMsg(e))
    // @ts-ignore
    await MessageBox.alert('저장 실패', {type: 'error'})
  }
}

export async function createPoint({root, state, publicState}: any) {
  const logger = createLogger().addTags('createPoint')
  state.loading = true
  try {
    const results = publicState.points.map((point: any) => {
      return req(qCreatePoint, {
        owner: point.owner._id,
        date: state.date,
        items: point.items.map((item: any) => ({value: item.value, type: item.type})),
        etc: point.etc,
      })
    })
    const resolvedList: any = await Promise.all(results)
    publicState.points = resolvedList.map(prop('res')) // 생성된 _id 세팅
    publicState.points = go(
      publicState.points,
      map((point: any) => ({...point, owner: root.$store.getters.studentMap[point.owner]})),
    )
    state.loading = false
    state.pointInit = true
    state.editable = false
    // await Message({message: '저장 완료', type: 'success'})
    // @ts-ignore
    Notification.success({message: '저장 완료', position: 'bottom-right'})
  } catch (e) {
    state.loading = false
    logger.error(errMsg(e))
    await MessageBox.alert('저장 실패', {type: 'error'})
  }
}

export function useHandleDateChange({root, state, publicState}: IAllState) {
  return async (value: string) => {
    if (moment(value, 'YYYYMMDD').format('dddd') !== 'Sunday') {
      await MessageBox.alert('일요일만 선택가능합니다', {type: 'warning'})
      state.date = state.oldDate
      return
    }
    state.oldDate = state.date
    root.$store.commit('setDate', state.date)
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
export function useHandleRemove({root, state}) {
  return async () => {
    try {
      await MessageBox.confirm('입력했던 내용을 전부 삭제합니다', {type: 'warning'})
      const publicState = usePublicState()
      state.loading = true
      const results: Array<Promise<any>> = publicState.points.map(point => {
        if (!point._id) {
          return Promise.resolve()
        }
        return req(qRemovePoint, {_id: point._id})
      })
      await Promise.all(results)
      state.loading = false
      // await Message({message: '삭제 완료', type: 'success'})
      await initPoints({root, state, publicState})

      // @ts-ignore
      Notification.success({message: '삭제 완료', position: 'bottom-right'})
    } catch (e) {
      if (e !== 'cancel') {
        state.loading = false
        await MessageBox.alert('삭제 실패', {type: 'error'})
        throw e
      }
    }
  }
}
