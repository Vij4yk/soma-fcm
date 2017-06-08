import parse from 'co-body'
import * as admin from 'firebase-admin'

export default () => async (ctx, next) => {
  const db = ctx['soma_development']

  try {

    const requestBody = [await parse.json(ctx)]

    await Promise.all(requestBody.map(async({ ids }) => {

      const response = await db.query('SELECT token FROM fcm WHERE client_id = ANY ($1)', [ids])

      var payload = {
        data: {
          score: "850",
          time: "2:45"
        }
      };

      const registration_ids = response.rows.map(r => r.token)

      console.log(JSON.stringify(registration_ids, null, 2))
      console.log(JSON.stringify(payload, null, 2))

      admin.messaging().sendToDevice(registration_ids, payload)
      //admin.messaging().sendToTopic("fragebogen", payload)
      .then(function(response) {
        // See the MessagingDevicesResponse reference documentation for
        // the contents of response.
        console.log("Successfully sent message:", response);
        console.log(response.results)
      })
      .catch(function(error) {
        console.log("Error sending message:", error);
      });

    }))

    await next()

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
