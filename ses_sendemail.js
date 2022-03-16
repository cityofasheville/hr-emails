const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
const client = new SESClient({ region: 'us-east-1' })

async function ses_sendemail (fromEmail,toEmails,message) {
  try {
    const params = {
      Destination: {
        /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: toEmails
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: 'UTF-8',
            Data: message
          },
          Text: {
            Charset: 'UTF-8',
            Data: message
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'City of Asheville Employee Survey'
        }
      },
      Source: fromEmail, // 'asheville_notifications@ashevillenc.gov', // SENDER_ADDRESS
      ReplyToAddresses: [
        fromEmail
      ]
    }

    const data = await client.send(new SendEmailCommand(params))
    return('Success - Message ID:' + data.MessageId)

  } catch (err) { 
    console.log(err) 
  }
};

module.exports = ses_sendemail
