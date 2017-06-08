import Router from 'koa-router'
import { getAllToken, storeToken, msgAll, msgTopic, msgSurvey, msgLottery } from './middleware'

let router = new Router({
  name: 'token',
  prefix: '/fcm' // must match the corresponding route in nginx
})

router
  //.get('/token/all', getAllToken())
  .get('/msg/survey', msgSurvey())
  //.post('/msg/lottery', msgLottery())
  //.post('/msg/topic/:topic', msgTopic())
  .post('/token', storeToken(), (ctx) => { ctx.status = 200 })

export default router
