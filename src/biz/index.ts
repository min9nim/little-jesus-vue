import {IStudent} from './type'
import {map, sort} from 'ramda'
import {go} from 'mingutils'
import {_idAscending} from '@/utils'
import {MessageBox} from 'element-ui'

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

export function errorHandler(e: any) {
  console.error(e)
  // @ts-ignore
  const dom: any = document.querySelector('.el-loading-mask').parentElement
  dom.innerHTML = '<pre>' + JSON.stringify(e, null, 2) + '</pre>'
  dom.style.textAlign = 'left'
  MessageBox.alert(e.message, {type: 'error'})
}
