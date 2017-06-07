#!/usr/local/bin/node
import http from 'http'
import https from 'https'

import * as admin from 'firebase-admin'

import db from './database'
import fcm from './fcm'

import Koa from 'koa'
import helmet from 'koa-helmet'
import logger from 'koa-logger'
import compress from 'koa-compress'
import cors from 'kcors'

const FIREBASE_SCRIPT_SRC = 'https://www.gstatic.com/firebasejs/4.1.1/firebase.js'
const FIREBASE_API_KEY = 'AIzaSyBqGqu-ew0D30yA2lYRqv0-edwXCTN0MQI'
const FIREBASE_MESSAGING_SENDER_ID = '288893270266'
const FIREBASE_PROJECT_ID = 'soma-6678d'
const FIREBASE_DATABASE_NAME = FIREBASE_PROJECT_ID

const HTTP_PORT = 7593

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://soma-6678d.firebaseio.com"
});

const STARTTIME = new Date()
const app = new Koa()

app.use(cors())
app.use(logger())
app.use(compress())
app.use(helmet({ noCache: true }))
app.use(db())
app.use(fcm())

// Run the server
if (!module.parent) {
  console.log('Run index.js', module.parent)
}

const msg = (protocol, port) => console.log(`${STARTTIME} Listening on ${protocol}://localhost:${port}`)

const httpServer = http.createServer(app.callback()).listen(HTTP_PORT, () => {
  msg('http', httpServer.address().port)
  //const httpsServer = https.createServer(SSL_OPTIONS, app.callback()).listen(httpServer.address().port + 1, () => {
  //  msg('https', httpsServer.address().port)
  //})
})

export default app

// Send message to ONE device//{{{

// This registration token comes from the client FCM SDKs.
var registrationToken = "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...";

// See the "Defining the message payload" section below for details
// on how to define a message payload.
//}}}


