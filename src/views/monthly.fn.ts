import moment from 'moment'
import {req} from '@/utils'
import {qPointsFromTo} from '@/biz/query'
import {groupBy, filter, path, propEq, map, split, last} from 'ramda'
import {go} from 'mingutils'
import createLogger from 'if-logger'

const logger = createLogger().addTags('monthly.fn.ts')

export function useHandleMonthChange({state, root}) {
  return async (value: string) => {
    if (!value) {
      logger.warn('value(`yearMonth`) is undefined')
      return
    }
    if (root.$store.state.teachers.length === 0) {
      return
    }

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
    // console.log(result)
    const points = go(
      result.res,
      filter((point: any) => root.$store.getters.studentMap[point.owner]), // 혹시 삭제된 학생의 포인트가 있다면 제거
      map((point: any) => ({
        ...point,
        owner: root.$store.getters.studentMap[point.owner],
      })),
    )
    const pointsByStudent = groupBy(path(['owner', 'name']) as any)(points)
    // console.log(pointsByStudent)
    const pointMenuMap = root.$store.getters.pointMenuMap
    // console.log(pointMenuMap)
    state.tableData = getTableData({pointsByStudent, yearMonth: value, pointMenuMap})
  }
}

export function getPointSumOfWeek(point: any, pointMenuMap: any) {
  return point.items.reduce((acc: number, item: any) => {
    const value = go(item.value, split(':'), last, Number)
    // console.log(pointMenuMap[item.type].label, value)
    const priority = pointMenuMap[item.type].priority
    // console.log({value, priority})
    return acc + priority * value
  }, 0)
}

export function getTableData({pointsByStudent, yearMonth, pointMenuMap}: any) {
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
      sumByWeek['week' + (index + 1)] = point ? getPointSumOfWeek(point, pointMenuMap) : 0
      totalSum += sumByWeek['week' + (index + 1)]
    })
    // console.log(sumByWeek)

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
  return result
}
