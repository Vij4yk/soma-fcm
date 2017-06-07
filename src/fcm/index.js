import compose from 'koa-compose'
import router from './router'

export default (/*prefix*/) => compose([
  router.routes(), router.allowedMethods()
])
