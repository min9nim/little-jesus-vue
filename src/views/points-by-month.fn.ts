import moment from 'moment'
import {req} from '@/utils'
import {qPointsFromTo} from '@/biz/query'
import {groupBy, filter, path, propEq, map, split, last} from 'ramda'
import {go} from 'mingutils'

export function useHandleMonthChange({state, root}) {
  return async (value: string) => {
    state.sundays = getSundaysOfMonth(value, 'YYYYMMDD')
    console.log(state.sundays)
  }
}

export function getSundaysOfMonth(yearMonth: string, outputFormat = 'MM/DD') {
  const month = yearMonth.slice(-2)
  const result: string[] = []
  const sunday1 = moment(yearMonth, 'YYYYMM').startOf('week')
  if (sunday1.format('MM') === month) {
    result.push(sunday1.format(outputFormat))
  }
  const sunday2 = moment(yearMonth, 'YYYYMM')
    .startOf('week')
    .add(1, 'week')
  const sunday3 = moment(yearMonth, 'YYYYMM')
    .startOf('week')
    .add(2, 'week')
  const sunday4 = moment(yearMonth, 'YYYYMM')
    .startOf('week')
    .add(3, 'week')
  result.push(
    sunday2.format(outputFormat),
    sunday3.format(outputFormat),
    sunday4.format(outputFormat),
  )
  const sunday5 = moment(yearMonth, 'YYYYMM')
    .startOf('week')
    .add(4, 'week')
  if (sunday5.format('MM') === month) {
    result.push(sunday5.format(outputFormat))
  }
  const sunday6 = moment(yearMonth, 'YYYYMM')
    .startOf('week')
    .add(5, 'week')

  if (sunday6.format('MM') === month) {
    result.push(sunday6.format(outputFormat))
  }
  console.log(result)
  return result
}
