import {IPoint} from '@/biz/type'
import {reactive, computed} from '@vue/composition-api'
import {prop, last, split, map, pipe, reduce, propEq, find, path} from 'ramda'
import {go} from 'mingutils'

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

export function usePointSum({props, root}) {
  return (index: number) => {
    if (root.$store.state.pointMenus.length === 0) {
      return 0
    }
    const reducer = (acc: number, point: any) => {
      const item = point.items[index]
      if (!point.items) {
        return acc
      }
      if (!item) {
        // 포인트 입력 이후 새로 추가된 항목이 있을 경우 예외 처리
        return acc
      }
      const value = go(item.value, split(':'), last, Number)
      // const label = root.$store.getters.pointMenuMap[item.type].label
      // console.log('item.type = ' + item.type)
      const priority = root.$store.getters.pointMenuMap[item.type].priority
      // console.log({label, value, priority})
      return acc + value * priority
      // return acc + value
    }
    return props.points.reduce(reducer, 0)
  }
}

export function useTotalPointSum({props, root}) {
  return (menuId: string) => {
    if (root.$store.state.pointMenus.length === 0) {
      return 0
    }

    const maxValue = go(
      root.$store.getters.pointMenuMap[menuId].type,
      split(','),
      map(
        pipe(
          split(':'),
          last,
          Number,
        ),
      ),
      reduce((a: any, b: any) => (a > b ? a : b), 0),
    )
    const priority = root.$store.getters.pointMenuMap[menuId].priority

    const studentsLength = props.tableBodyHidden
      ? root.$store.state.students.length
      : go(
          root.$store.state.teachers,
          find(propEq('name', props.teacherName)),
          path(['students', 'length']),
        )

    return studentsLength * maxValue * priority
  }
}

export function useItemSum({root}) {
  return (items: any) => {
    if (root.$store.state.pointMenus.length === 0) {
      return 0
    }
    if (!items) {
      throw Error('Not found items')
    }

    return items.reduce((acc: any, item: any) => {
      // console.log('item.type = ' + item.type)
      // flatLog('root.$store.getters.pointMenuMap = ', root.$store.getters.pointMenuMap)
      const priority = root.$store.getters.pointMenuMap[item.type].priority
      const value = go(item.value, split(':'), last, Number)
      return acc + value * priority
    }, 0)
  }
}

export function usePerfectScoreSum({root}) {
  return (items: any) => {
    if (root.$store.state.pointMenus.length === 0) {
      return 0
    }
    if (!items) {
      throw Error('Not found items')
    }
    return items.reduce((acc: any, item: any) => {
      const perfectScore =
        (Number(root.$store.getters.pointMenuMap[item.type].type) - 1) *
        root.$store.getters.pointMenuMap[item.type].priority
      return acc + perfectScore * root.$store.getters.pointMenuMap[item.type].priority
    }, 0)
  }
}
