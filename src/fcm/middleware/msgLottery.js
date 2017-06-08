import parse from 'co-body'
import * as admin from 'firebase-admin'
import http from 'http'

export default () => async (ctx, next) => {
  const db = ctx['soma_development']

  try {

    const requestBody = [await parse.json(ctx)]

    await Promise.all(requestBody.map(async({ ids }) => {

       await Promise.all(ids.map(async(id) => {

        const surveyID = 2
        const surveyTokenTable = `lime_tokens_${surveyID}`

        const token = await db.query(`INSERT INTO ${surveyTokenTable} (participant_id, token) VALUES ($1, $2) RETURNING token`,
                                     id, Math.random().toString(36).substring(7))
        var payload = {
          notification: {
            title: "Umfrage",
            body: "Bitte nehmen Sie an der Umfrage teil"
          },
          data: {
            surveyURL: `https://soma.uni-koblenz.de/fragebogen/${token}`
          }
        };

        var options = {
          priority: "high"
        };

      }))

      const registration_ids = response.rows.map(r => r.token)

      console.log(JSON.stringify({registration_ids, options, payload}, null, 2))

      await admin.messaging().sendToDevice(registration_ids, payload, options)
      .then(response => {
        console.log("Successfully sent message:", response);
        ctx.body = JSON.stringify({registration_ids, options, payload}, null, 2)
      })
      .catch(error => {
        console.log("Error sending message:", error);
        ctx.status = 500
        throw error;
      });

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

