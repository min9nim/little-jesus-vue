import axios from 'axios'
import {print} from 'graphql/language/printer'
import {pipe, complement, filter} from 'ramda'

const prod_url = 'https://little-jesus-api.now.sh'
const dev_url = 'https://little-jesus-api-git-develop.min1.now.sh'
let BASEURL = window.location.host === 'little-jesus.now.sh' ? prod_url : dev_url

if (window.location.host.indexOf('ver') > 0) {
  const start = location.host.indexOf('ver')
  const end = location.host.indexOf('.now.sh')
  const version = location.host.slice(start, end)
  // 특정 버젼을 명시한 경우에는 해당 버젼의 prod_url 로 연결
  const [tmp1, tmp2, tmp3] = prod_url.split('.')
  BASEURL = [tmp1 + '-' + version, tmp2, tmp3].join('.')
}
console.info('api server = ' + BASEURL)

export async function req(query: any, variables = {}) {
  let config = {headers: {'Content-Type': 'application/json'}}
  const result = await axios.post(BASEURL, {query: print(query), variables}, config)
  if (result.data.errors) {
    throw result.data.errors
  }
  return result.data.data
}

export const exclude = pipe<any, any, any>(
  complement,
  filter,
)

export function go(...args: any[]) {
  // @ts-ignore
  return pipe(...args.slice(1))(args[0])
}

export function nameAscending(path: any) {
  return (a: any, b: any) => {
    if (path(a) > path(b)) return 1
    if (path(b) > path(a)) return -1
    return 0
  }
}
