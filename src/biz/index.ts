import {IStudent} from './type'

export function studentToDefaultPointMap(pointMenus: any) {
  return (student: IStudent) => {
    return {
      owner: student,
      attendance: false,
      visitcall: false,
      meditation: 0,
      invitation: 0,
      recitation: false,
      items: pointMenus.map((menu: any) => ({type: menu, value: 0})),
      etc: '',
    }
  }
}
