import {IPublicState, IPoint, ITeacher, IStudent} from '@/biz/type'
import {IState} from '@/views/points.fn'
import {reactive, computed} from '@vue/composition-api'
import {prop} from 'ramda'

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

export function useComputed({root, props}: any) {
  const attendanceReducer = (acc: number, point: IPoint) => acc + (point.attendance ? 1 : 0)
  const visitcallReducer = (acc: number, point: IPoint) => acc + (point.visitcall ? 1 : 0)
  const recitationReducer = (acc: number, point: IPoint) => acc + (point.recitation ? 1 : 0)
  const meditationReducer = (acc: number, point: IPoint) => {
    if (!point.meditation) {
      return acc
    }
    return acc + point.meditation
  }
  const invitationReducer = (acc: number, point: IPoint) => {
    if (!point.invitation) {
      return acc
    }
    return acc + point.invitation
  }
  return reactive({
    menuItems: computed(() => {
      if (props.points.length === 0) {
        return root.$store.state.pointMenus.map((menu: any) => ({
          type: menu._id,
        }))
      }
      return prop('items', props.points[0])
    }),
    attendanceSum: computed(() => props.points.reduce(attendanceReducer, 0)),
    visitcallSum: computed(() => props.points.reduce(visitcallReducer, 0)),
    meditationSum: computed(() => props.points.reduce(meditationReducer, 0)),
    recitationSum: computed(() => props.points.reduce(recitationReducer, 0)),
    invitationSum: computed(() => props.points.reduce(invitationReducer, 0)),
  })
}
