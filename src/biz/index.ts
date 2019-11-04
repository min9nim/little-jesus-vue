import {IStudent} from './type'

export function studentToDefaultPointMap(student: IStudent) {
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
