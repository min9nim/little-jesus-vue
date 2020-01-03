import {IStudent} from './type'
import {map, sort} from 'ramda'
import {go} from '@mgsong/min-utils'
import {nameAscending, _idAscending} from '@/utils'

export function studentToDefaultPointMap(pointMenus: any) {
  return (student: IStudent) => {
    return {
      owner: student,
      items: go(
        pointMenus,
        sort(_idAscending),
        map((menu: any) => {
          const options = menu.type.split(',')
          const option = options.find(option => option.includes(menu.defaultValue))
          const value = option.trim()
          return {type: menu._id, value}
        }),
      ),
      etc: '',
    }
  }
}
