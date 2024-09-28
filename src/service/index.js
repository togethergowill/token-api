const axios = require('axios')
const { APP_ID, GRANT_TYPE, URL, SECRET_ID } = require('./config.js')

async function fetchLoginInfo(code) {
  const res = await axios.get(URL, {
    params: {
      secret: SECRET_ID,
      grant_type: GRANT_TYPE,
      appid: APP_ID,
      js_code: code
    }
  })
  return res.data
}

module.exports = fetchLoginInfo