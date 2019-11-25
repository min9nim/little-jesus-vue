import {IPublicState, IPoint, ITeacher, IStudent} from '@/biz/type'
import {IState} from '@/views/points.fn'
import {reactive, computed} from '@vue/composition-api'

export interface IComputed {
  attendanceSum: number
  visitcallSum: number
  meditationSum: number
  recitationSum: number
  invitationSum: number
}

interface IProps {
  points: IPoint[]
}

export function useComputed(props: IProps) {
  const attendanceReducer = (acc: number, point: IPoint) => acc + (point.attendance ? 1 : 0)
  const visitcallReducer = (acc: number, point: IPoint) => acc + (point.visitcall ? 1 : 0)
  const recitationReducer = (acc: number, point: IPoint) => acc + (point.recitation ? 1 : 0)
  const meditationReducer = (acc: number, point: IPoint) => acc + point.meditation
  const invitationReducer = (acc: number, point: IPoint) => acc + point.invitation
  return reactive({
    attendanceSum: computed(() => props.points.reduce(attendanceReducer, 0)),
    visitcallSum: computed(() => props.points.reduce(visitcallReducer, 0)),
    meditationSum: computed(() => props.points.reduce(meditationReducer, 0)),
    recitationSum: computed(() => props.points.reduce(recitationReducer, 0)),
    invitationSum: computed(() => props.points.reduce(invitationReducer, 0)),
  })
}
