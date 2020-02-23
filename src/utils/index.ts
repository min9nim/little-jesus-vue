import * as common from '@mgsong/lj-common'

export const {
  req,
  setApiServer,
  initSentry,
  nameAscending,
  _idAscending,
  idEqual,
  removeBy,
  updateBy,
  exclude,
  findById,
  updateById,
  removeById,
  errMsg,
  ascending,
} = common

if (window.location.host.indexOf('ver') > 0) {
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
