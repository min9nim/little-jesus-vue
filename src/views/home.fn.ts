import {reactive} from '@vue/composition-api'
import {req} from '@/utils'
import gql from 'graphql-tag'
import {mergeRight, propEq} from 'ramda'

export function useState() {
  return reactive({
    teachers: [],
    teacherId: '',
    students: [],
    date: '',
    loading: true,
  })
}

export function useBeforeMount({state}: any){
  return async () => {
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
  }
}

export function useHandleTeacherChange({state}: any){
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