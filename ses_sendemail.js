const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
const client = new SESClient({ region: 'us-east-1' })

async function ses_sendemail (emailAddr,emp) {
  let htmlEmail = `
  ${emp.employee},<br>
  It has been ${emp.type} days since you were hired. <br>
  The City of Asheville HR Department would like your feedback! 
  Here is a <a href="ashevillenc.gov">link</a> to a questionnaire.
  `
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

    const data = await client.send(new SendEmailCommand(params))
    return('Success - Message ID:' + data.MessageId)

  } catch (err) { 
    console.log(err) 
  }
};

module.exports = ses_sendemail
