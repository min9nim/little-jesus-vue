import {initPoints} from './points.fn'

export function useHandleMonthChange({root, state}: any) {
  return async (value: string) => {
    console.log(value)
    await initPoints({root, state})
  }
}
