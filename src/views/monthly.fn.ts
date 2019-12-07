import moment from 'moment'
import {req} from '@/utils'
import {qPointsFromTo} from '@/biz/query'
import {groupBy, path, map} from 'ramda'

export function useHandleMonthChange({root, state}: any) {
  return async (value: string) => {
    const start = value
    const end = moment(value, 'YYYYMMDD')
      .endOf('month')
      .format('YYYYMMDD')
    state.loading = true
    const result = await req(qPointsFromTo, {
      startDate: start,
      endDate: end,
    })
    state.loading = false
    console.log(result)
    const points = result.res
    const pointsByStudent = groupBy(path(['owner', 'name']) as any)(points)
    console.log(pointsByStudent)
    state.tableData = Object.entries(pointsByStudent).map(([key, value]: any) => {
      console.log({key, value})
      return {
        name: key,
        week1: value[0] ? getPointSumOfWeek(value[0]) : 0,
        week2: value[1] ? getPointSumOfWeek(value[1]) : 0,
        week3: value[2] ? getPointSumOfWeek(value[2]) : 0,
        week4: value[3] ? getPointSumOfWeek(value[3]) : 0,
      }
    })
  }
}

function getPointSumOfWeek(point: any) {
  return point.items.reduce((acc: number, item: any) => acc + item.type.priority * item.value, 0)
}
