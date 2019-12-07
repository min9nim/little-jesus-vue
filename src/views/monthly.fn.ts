import moment from 'moment'
import {req} from '@/utils'
import {qPointsFromTo} from '@/biz/query'
import {groupBy, path, map} from 'ramda'

export function useHandleMonthChange({root, state}: any) {
  return async (value: string) => {
    const start = moment(value, 'YYYYMM').format('YYYYMMDD')
    const end = moment(value, 'YYYYMM')
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

export function getPointSumOfWeek(point: any) {
  return point.items.reduce((acc: number, item: any) => acc + item.type.priority * item.value, 0)
}

export function getSundaysOfMonth(yearMonth: string, outputFormat = 'MM/DD') {
  const month = yearMonth.slice(-2)
  const result = []
  const sunday1 = moment(yearMonth, 'YYYYMM')
    .startOf('week')
    .format(outputFormat)
  if (sunday1.slice(0, 2) === month) {
    result.push(sunday1)
  }
  const sunday2 = moment(yearMonth, 'YYYYMM')
    .startOf('week')
    .add(1, 'week')
    .format(outputFormat)
  const sunday3 = moment(yearMonth, 'YYYYMM')
    .startOf('week')
    .add(2, 'week')
    .format(outputFormat)
  const sunday4 = moment(yearMonth, 'YYYYMM')
    .startOf('week')
    .add(3, 'week')
    .format(outputFormat)
  result.push(sunday2, sunday3, sunday4)
  const sunday5 = moment(yearMonth, 'YYYYMM')
    .startOf('week')
    .add(4, 'week')
    .format(outputFormat)
  if (sunday5.slice(0, 2) === month) {
    result.push(sunday5)
  }
  const sunday6 = moment(yearMonth, 'YYYYMM')
    .startOf('week')
    .add(5, 'week')
    .format(outputFormat)
  if (sunday6.slice(0, 2) === month) {
    result.push(sunday6)
  }
  return result
}
