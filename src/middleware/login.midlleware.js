const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../keys/private.key'))
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '../keys/public.key'))


async function sign(ctx, next) {
  const { session_key, openid } = ctx.data
  const token = jwt.sign({ session_key, openid }, PRIVATE_KEY, {
    expiresIn: 60 * 60 * 24,
    algorithm: 'RS256'
  })
  ctx.body = {
    code: 0,
    message: 'token获取成功',
    token
  }
  await next()
}

async function verifyAuth(ctx, next) {
  const authorization = ctx.request.headers.authorization
  if (!authorization) {
    ctx.body = {
      message: '无效token'
    }
    return
  }

  const token = authorization.replace('Bearer ', '')
  try {
    const res = jwt.verify(token, PUBLIC_KEY, {
      algorithm: ['RS256']
    })
    ctx.data = res
  } catch {
    ctx.body = {
      message: '过期token'
    }
  }

  await next()
}

module.exports = {
  sign,
  verifyAuth
}