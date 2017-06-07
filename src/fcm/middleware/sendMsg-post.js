import parse from 'co-body'
import * as admin from 'firebase-admin'

export default () => async (ctx, next) => {
  const db = ctx['soma_development']

  try {

    const requestBody = [await parse.json(ctx)]
    await Promise.all(requestBody.map(async({ device_id, token }) => {

      const token = await db.query('SELECT token FROM client WHERE client_id = $1 LIMIT 1', [1]) // FIXME get params

      var payload = {
        data: {
          score: "850",
          time: "2:45"
        }
      };

      console.log(token)
      admin.messaging().sendToDevice(token, payload)
      .then(function(response) {
        // See the MessagingDevicesResponse reference documentation for
        // the contents of response.
        console.log("Successfully sent message:", response);
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
