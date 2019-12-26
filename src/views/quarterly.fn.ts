import moment from 'moment'
import {req} from '@/utils'
import {qPointsFromTo} from '@/biz/query'
import {groupBy, path} from 'ramda'
import {getPointSumOfWeek} from './monthly.fn'

export function useHandleQuarterChange({state, root}: any) {
  return async (value: number) => {
    if (root.$store.state.teachers.length === 0) {
      return
    }

    const startMonth = (value - 1) * 3 + 1
    const start = moment(state.year + String(startMonth).padStart(2, '0'), 'YYYYMM').format(
      'YYYYMMDD',
    )
    const end = moment(start, 'YYYYMMDD')
      .endOf('month')
      .add(2, 'month')
      .format('YYYYMMDD')
    state.loading = true
    const result = await req(qPointsFromTo, {
      startDate: start,
      endDate: end,
    })
    state.loading = false
    // const points = result.res
    const points = result.res.map((point: any) => ({
      ...point,
      owner: root.$store.getters.studentMap[point.owner],
    }))
    const pointsByStudent = groupBy(path(['owner', 'name']) as any)(points)
    // console.log(pointsByStudent)
    const pointMenuMap = root.$store.getters.pointMenuMap

    state.tableData = getTableData({pointsByStudent, quarter: value, pointMenuMap})
  }
}

export function getTableData({pointsByStudent, quarter, pointMenuMap}: any) {
  const months = getMonthsOfQuarter(quarter)
  // console.log('*** months: ', months)
  return Object.entries(pointsByStudent).map(([name, points]: any) => {
    // console.log(points)
    const teacher = points[0].owner.teacher
    const teacherName = teacher ? teacher.name : 'N/A'
    const pointsByMonth = groupBy((point: any) => {
      return point.date.substr(4, 2)
    })(points)
    // console.log('pointsByMonth', pointsByMonth)

    const sumByMonth: any = {}
    let totalSum = 0
    months.forEach((month, index) => {
      // console.log(44, pointsByMonth[month])
      sumByMonth['month' + (index + 1)] = pointsByMonth[month]
        ? pointsByMonth[month].reduce(
            (acc, point) => acc + getPointSumOfWeek(point, pointMenuMap),
            0,
          )
        : 0
      totalSum += sumByMonth['month' + (index + 1)]
    })

    // console.log(sumByMonth)

    return {
      name,
      teacher: teacherName,
      ...sumByMonth,
      totalSum,
    }
  })
}

export function getMonthsOfQuarter(quarter: number) {
  const start = (quarter - 1) * 3 + 1
  return [start, start + 1, start + 2]
}

export const quarterOptions = [
  {
    value: 1,
    label: '1분기',
  },
  {
    value: 2,
    label: '2분기',
  },
  {
    value: 3,
    label: '3분기',
  },
  {
    value: 4,
    label: '4분기',
  },
]
