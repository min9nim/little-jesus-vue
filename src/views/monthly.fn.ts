import moment from 'moment'
import {req} from '@/utils'
import {qPointsFromTo} from '@/biz/query'
export function useHandleMonthChange({root, state}: any) {
  return async (value: string) => {
    const start = value
    const end = moment(value, 'YYYYMMDD')
      .endOf('month')
      .format('YYYYMMDD')
    const result = await req(qPointsFromTo, {
      startDate: start,
      endDate: end,
    })
    console.log(result)
  }
}
