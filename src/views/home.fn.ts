import {reactive} from '@vue/composition-api'
import {req} from '@/utils'
import gql from 'graphql-tag'
import {mergeRight, propEq} from 'ramda'
import moment from 'moment'

let state: any

export function useState() {
  if (state) {
    return state
  }
  state = reactive({
    teachers: [],
    teacherId: '',
    students: [],
    date: moment().startOf('week'),
    loading: true,
  })
  return state
}

export function useBeforeMount({state}: any) {
  return async () => {
    const teachers = window.localStorage.getItem('teachers')
    if(teachers){
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
    window.localStorage.setItem('teachers', JSON.stringify(state.teachers))
  }
}

export function useHandleTeacherChange({state}: any) {
  return (teacherId: string) => {
    // console.count(teacherId);
    state.teacherId = teacherId
    const teacher: any = state.teachers.find(propEq('_id', state.teacherId))
    if (teacher) {
      state.students = teacher.students.map(
        mergeRight<any>({
          attendance: false,
          visitcall: false,
          meditation: 0,
          invitation: 0,
          recitation: false,
        }),
      )
    }
  }
}
