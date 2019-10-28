import {reactive, computed} from '@vue/composition-api'
import {req} from '@/utils'
import gql from 'graphql-tag'
import {mergeRight, propEq} from 'ramda'
import moment from 'moment'
import {qCreatePoint} from '@/biz/query'

export interface ITeacher {
  _id: string
  name: string
  students: [string]
}
export interface IPoint {
  _id: string
  date: string
  attendance: false
  visitcall: false
  meditation: 0
  invitation: 0
  recitation: false
  etc: string
}

export interface IState {
  teachers: ITeacher[]
  teacherId?: string
  students: IPoint[]
  date: string
  loading: boolean
}

let state: IState

export function useState() {
  if (state) {
    return state
  }
  state = reactive({
    teachers: [] as ITeacher[],
    teacherId: localStorage.getItem('teacherId') || '',
    students: computed(() => {
      const teacher: any = state.teachers.find(propEq('_id', state.teacherId))
      if (!teacher) {
        return []
      }
      return teacher.students.map(
        mergeRight<any>({
          attendance: false,
          visitcall: false,
          meditation: 0,
          invitation: 0,
          recitation: false,
        }),
      )
    }),
    date: moment()
      .startOf('week')
      .format('YYYYMMDD'),
    loading: true,
  })
  return state
}

export function useBeforeMount({state}: any) {
  return async () => {
    const teachers = window.localStorage.getItem('teachers')
    if (teachers) {
      state.teachers = JSON.parse(teachers)
      state.loading = false
      return
    }
    const result = await req(gql`
      {
        res: teachers {
          _id
          name
          students {
            _id
            name
          }
        }
      }
    `)
    state.teachers = result.res
    state.loading = false
    localStorage.setItem('teachers', JSON.stringify(state.teachers))
  }
}
interface IUseHandleSave {
  root: any
  state: IState
}

export function useHandleSave({root, state}: IUseHandleSave) {
  return async () => {
    const results = state.students.map(student => {
      return req(qCreatePoint, {
        owner: student._id,
        date: state.date,
        attendance: student.attendance,
        visitcall: student.visitcall,
        meditation: student.meditation,
        recitation: student.recitation,
        invitation: student.invitation,
        etc: student.etc,
      })
    })
    await Promise.all(results)
    root.$alert('저장 완료')
  }
}
