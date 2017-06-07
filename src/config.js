import fs from 'fs'
import pkg from '../package.json'

export const NAME = pkg.name.toLowerCase()

export const HTTP_PORT = process.env.PORT || 5000 // 0

export const SSL_OPTIONS = {
  //key: fs.readFileSync(`./ssl/${NAME}.key.pem`),
  //cert: fs.readFileSync(`./ssl/${NAME}.crt.pem`)
  key: fs.readFileSync('/etc/letsencrypt/live/soma.uni-koblenz.de/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/soma.uni-koblenz.de/cert.pem')
}

export const STATIC_DIR = 'static'
