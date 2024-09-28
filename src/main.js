const Koa = require('koa')
const KoaRouter = require('@koa/router')
const bodyparser = require('koa-bodyparser')
const fetchLoginInfo = require('./service/index.js')
const { sign, verifyAuth } = require('./middleware/login.midlleware.js')

const loginRouter = new KoaRouter({ prefix: '/login' })

const app = new Koa()
app.use(bodyparser())

loginRouter.post('/', async (ctx, next) => {
  const { code } = ctx.request.body
  const res = await fetchLoginInfo(code)
  ctx.data = res
  await next()
}, sign)

loginRouter.post('/verify', verifyAuth, (ctx, next) => {
  const { openid } = ctx.data
  ctx.body = {
    code: 0,
    message: "已登录",
    openid
  }
})

app.use(loginRouter.routes())
app.use(loginRouter.allowedMethods())

app.listen(8000, () => {
  console.log('Koa服务器已经启动')
})
