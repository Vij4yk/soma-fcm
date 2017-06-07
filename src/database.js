import pg from 'pg'

const { NODE_ENV } = process.env

const DBUSER = 'asdf'
const DBPASS = 'qwer'
const DBNAME = 'soma_development'

const POSTGRES_CONFIG = {
  user: DBUSER,
  database: DBNAME,
  password: DBPASS,
  host: 'localhost', // Server hosting the postgres database
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
}

const createConnectionPool = (pool) => async(ctx, next) => {
  ctx[pool.options.database] = pool
  await next()
}

export default () => {
  let pool = new pg.Pool(POSTGRES_CONFIG)
  return createConnectionPool(pool)
}

