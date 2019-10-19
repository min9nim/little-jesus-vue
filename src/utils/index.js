import axios from 'axios'
import {print} from 'graphql/language/printer'

const BASEURL = 'https://little-jesus-api.min1.now.sh'
const headers = {'Content-Type': 'application/json'}

export async function req(query, variables = {}) {
  let config = {headers}
  const result = await axios.post(BASEURL, {query: print(query), variables}, config)
  if (result.data.errors) {
    throw result.data.errors
  }
  return result.data.data
}
