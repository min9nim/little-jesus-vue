import axios from 'axios'
import {print} from 'graphql/language/printer'
import {getQueryParams} from '@mgsong/min-utils'

const url: any = {
  prod: 'https://little-jesus-api.now.sh',
  dev: 'https://little-jesus-api-git-develop.min1.now.sh',
  local: 'http://localhost:5050',
}

let BASEURL = url.dev
if (window.location.host.indexOf('localhost') === 0) {
  BASEURL = url.local
}
if (window.location.host === 'little-jesus.now.sh') {
  BASEURL = url.prod
}
const queryParam = getQueryParams(window.location.href)
if (queryParam.api) {
  BASEURL = url[queryParam.api]
}
console.info('api-server: ' + BASEURL)

export async function req(query: any, variables = {}) {
  let config = {headers: {'Content-Type': 'application/json'}}
  const result = await axios.post(BASEURL, {query: print(query), variables}, config)
  if (result.data.errors) {
    throw result.data.errors
  }
  return result.data.data
}

// export const exclude = pipe<any, any, any>(
//   complement,
//   filter,
// )

// export function go(...args: any[]) {
//   // @ts-ignore
//   return pipe(...args.slice(1))(args[0])
// }

export function nameAscending(path: any) {
  return (a: any, b: any) => {
    if (path(a) > path(b)) return 1
    if (path(b) > path(a)) return -1
    return 0
  }
}
