import moment from 'moment'
import {req} from '@/utils'
import {qPointsFromTo} from '@/biz/query'
import {groupBy, path, propEq} from 'ramda'

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
    state.tableData = getTableData({pointsByStudent, yearMonth: value})
  }
}

export function getPointSumOfWeek(point: any) {
  return point.items.reduce((acc: number, item: any) => acc + item.type.priority * item.value, 0)
}

export function getTableData({pointsByStudent, yearMonth}: any) {
  const sundays = getSundaysOfMonth(yearMonth, 'YYYYMMDD')
  return Object.entries(pointsByStudent).map(([name, points]: any) => {
    const teacher = points[0].owner.teacher
    const teacherName = teacher ? teacher.name : 'N/A'
    const pointList = sundays.map(sunday => {
      return points.find(propEq('date', sunday))
    })
    const sumByWeek: any = {}
    let totalSum = 0
    pointList.forEach((point, index) => {
      sumByWeek['week' + (index + 1)] = point ? getPointSumOfWeek(point) : 0
      totalSum += sumByWeek['week' + (index + 1)]
    })
    console.log(sumByWeek)

    return {
      name,
      teacher: teacherName,
      ...sumByWeek,
      totalSum,
    }
  })
}

export function getSundaysOfMonth(yearMonth: string, outputFormat = 'MM/DD') {
  const month = yearMonth.slice(-2)
  const result = []
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
  return result
}
