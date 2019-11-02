import axios from 'axios'
import {print} from 'graphql/language/printer'

const prod_url = 'https://little-jesus-api.now.sh'
const dev_url = 'https://little-jesus-api-git-develop.min1.now.sh'
const BASEURL = window.location.host === 'little-jesus.now.sh' ? prod_url : dev_url

export async function req(query: any, variables = {}) {
  let config = {headers: {'Content-Type': 'application/json'}}
  const result = await axios.post(BASEURL, {query: print(query), variables}, config)
  if (result.data.errors) {
    throw result.data.errors
  }
  return result.data.data
}
