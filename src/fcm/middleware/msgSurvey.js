import http from 'http'
import parse from 'co-body'
import * as admin from 'firebase-admin'

export default () => async (ctx, next) => {
  const db = ctx['soma_development']

  try {

    const surveyID = 2
    const surveyTokenTable = `lime_tokens_${surveyID}`
    const recipients = await db.query(`
                                 SELECT c.id id, c.device_id device_id, fcm.token fcm_token, l.token survey_token
                                 FROM client c
                                 JOIN fcm ON c.id = fcm.client_id
                                 JOIN ${surveyTokenTable} l ON c.id = l.participant_id::integer
                                 WHERE fcm.used = false`)

    await Promise.all(recipients.rows.map(async({ id, device_id, fcm_token, survey_token }) => {

      var payload = {
        notification: {
          title: "Umfrage",
          body: "Bitte nehmen Sie an der Umfrage teil"
        },
        data: {
          surveyURL: `https://soma.uni-koblenz.de/fragebogen/?r=survey/index&sid=${surveyID}&token=${survey_token}`
        }
      };

      var options = {
        priority: "high"
      };

      const registration_id = fcm_token; // <3

      console.log(JSON.stringify({registration_id, payload, options}, null, 2))

      var r = { ok:0, err:0 }
      await admin.messaging().sendToDevice(registration_id, payload, options)
      .then(response => {
        console.log("Successfully sent message:", response)
        r.ok++
      })
      .catch(error => {
        console.log("Error sending message:", error);
        ctx.status = 500
        r.err++
        throw error;
      });

      ctx.body = JSON.stringify(r, null, 2);
    }))
  } catch (err) {
    if (err.code === '23505') {
      console.log(err.detail)
      await next()
    } else {
      ctx.status = 500
      throw err
    }
  }
}
