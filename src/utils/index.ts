import axios from 'axios'
import {print} from 'graphql/language/printer'

const prod_url = process.env.VUE_APP_PROD_API_SERVER
const dev_url = process.env.VUE_APP_DEV_API_SERVER
const BASEURL = window.location.host === 'little-jesus.now.sh' ? prod_url : dev_url
// const BASEURL = prod_url
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
