import moment from 'moment'
export function useHandleMonthChange({root, state}: any) {
  return async (value: string) => {
    const start = value
    const end = moment(value, 'YYYYMMDD')
      .endOf('month')
      .format('YYYYMMDD')
    console.log(start, end)
  }
}
