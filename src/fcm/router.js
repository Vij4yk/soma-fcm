import Router from 'koa-router'
import { getAllToken, storeToken, sendMsg } from './middleware'

let router = new Router({
  name: 'token',
  prefix: '/fcm' // must match the corresponding route in nginx
})

router
  //.get('/msg', getAllToken())
  .post('/msg', sendMsg())
  .post('/token', storeToken(), (ctx) => { ctx.status = 200 })

export default router
