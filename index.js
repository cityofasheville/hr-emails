const { Client } = require('pg')
const ses_sendemail = require('./ses_sendemail')
// require('dotenv').config();
exports.handler = async (event) => {
  // (async()=>{
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
    console.log(emps)
    for (const emp of emps) {
      let emailAddr = emp.emp_email
      emailAddr = 'jtwilson@ashevillenc.gov'   // <======TEST!!!!!!
      let result = await ses_sendemail(emailAddr,emp)
      console.log(result)
    }

    client.end()
// })()
}


