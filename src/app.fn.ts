import {qInitialize} from '@/biz/query'
import {nameAscending, req} from '@/utils'
import {path, propEq, find, pipe, omit, prop, includes, values} from 'ramda'

export function findTeacherByStudentId(teachers: any[]) {
  return (studentId: string) => {
    const teacher = find(
      pipe(
        prop('students') as any,
        includes(studentId),
      ),
    )(teachers)
    return omit(['students'], teacher)
  }
}

export async function initialize({root, state}: any) {
  state.loading = true
  const result = await req(qInitialize)
  state.loading = false

  // 포인트메뉴 상태 초기화
  root.$store.commit('setPointMenus', result.pointMenus)

  //학생상태 초기화
  root.$store.commit(
    'setStudents',
    result.students.map((student: any) => ({
      ...student,
      teacher: findTeacherByStudentId(result.teachers)(student._id),
    })),
  )

  // api 결과를 정렬
  result.teachers.forEach((teacher: any) => {
    teacher.students = teacher.students.map((_id: string) => root.$store.getters.studentMap[_id])
    teacher.students.sort(nameAscending(path(['name'])))
  })
  result.teachers.sort(nameAscending(path(['name'])))

  // 선생님목록 상태 초기화
  root.$store.commit('setTeachers', result.teachers)
  // const etcStudents = result.students.filter(propEq('teacher', null))
  const etcStudents = root.$store.state.students.filter(propEq('teacher', null))
  if (etcStudents.length > 0) {
    root.$store.commit('addTeacher', {
      _id: '',
      name: '반미정',
      students: etcStudents,
    })
  }
}
