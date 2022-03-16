const { Client } = require('pg')
const ses_sendemail = require('./ses_sendemail')

exports.handler = async (event) => {
  // (async()=>{
    let fromEmail = process.env.EMAIL_SENDER
    let date_to_run = ''
    if(event.date_to_run){
      date_to_run = "'" + event.date_to_run + "'"
    }else{
      date_to_run = 'CURRENT_DATE'
    }
    let sqlstring = `
    select '7' as type, emp_id, employee, emp_email, hire_date_last
    from internal.pr_employee_info
    where active = 'A'
    and hire_date_last + INTERVAL '7 days' = ${date_to_run}
    union 
    select '100' as type, emp_id, employee, emp_email, hire_date_last
    from internal.pr_employee_info
    where active = 'A'
    and hire_date_last + INTERVAL '100 days' = ${date_to_run}
    order by type desc
    `
    const config = {
      user: process.env.user,
      host: process.env.host,
      database: process.env.database,
      password: process.env.password,
      port: 5432
    }
    // console.log(config)
    const client = new Client(config)
    await client.connect()

    const empobj = await client.query(sqlstring)
    const emps = empobj.rows
    // console.log("Staff list: ", emps)
    if(emps.length===0) {
      return "No staff today"
    }

    for (const emp of emps) {
      let toEmails = [emp.emp_email]
      toEmails = ['jtwilson@ashevillenc.gov']   // <==========================TEST!!!!!!
      let message = `
      ${emp.employee},<br>
      It has been ${emp.type} days since you were hired. <br>
      The City of Asheville HR Department would like your feedback! 
      Here is a <a href="ashevillenc.gov">link</a> to a questionnaire.
      `
      let result = await ses_sendemail(fromEmail,toEmails,message)
      console.log(result)
    }
    // digest email
    const toEmails = JSON.parse(process.env.DIGEST_EMAILS_JSON)
    let message = `
    Emails were sent to the following staff<br>
    <table><tr>
    <th>Days Since Hire</th>
    <th>Emp ID</th>
    <th>Employee</th>
    <th>Email</th>
    <th>Hire Date</th>
    </tr>
    `
    for (const emp of emps) {
      message += `
      <tr>
      <td>${emp.type}</td>
      <td>${emp.emp_id}</td>
      <td>${emp.employee}</td>
      <td>${emp.emp_email}</td>
      <td>${emp.hire_date_last ? emp.hire_date_last.toISOString().slice(0,10) : ""}</td>
      </tr>
      `
    }
    message += `</table>`
    let result = await ses_sendemail(fromEmail,toEmails,message)
    console.log(result)


    client.end()
    return emps.length + " staff emails sent"
// })()
}


