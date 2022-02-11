const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
const client = new SESClient({ region: 'us-east-1' })

function ses_sendemail (emailAddr) {
  let htmlEmail = `
  This is the email content. Here is a <a href="ashevillenc.gov">link</a>
  `
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Destination: {
          /* required */
          CcAddresses: [
            /* more items */
          ],
          ToAddresses: [emailAddr]
        },
        Message: {
          /* required */
          Body: {
            /* required */
            Html: {
              Charset: 'UTF-8',
              Data: htmlEmail
            },
            Text: {
              Charset: 'UTF-8',
              Data: htmlEmail
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'City of Asheville Employee Survey'
          }
        },
        Source: 'asheville_notifications@ashevillenc.gov', // SENDER_ADDRESS
        ReplyToAddresses: [
          'asheville_notifications@ashevillenc.gov'
        ]
      }

      client.send(new SendEmailCommand(params), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve('Success - Message ID:' + MessageID)
        }
      })
    } catch (err) { reject(err) }
  })
};

module.exports = ses_sendemail
