const { Client } = require('pg')
const ses_sendemail = require('./ses_sendemail')
require('dotenv').config();
exports.handler = async (event) => {
// (async()=>{
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

  const empobj = await client.query(`
  select '7' as type, emp_id, employee, emp_email, hire_date_last
  from internal.pr_employee_info
  where active = 'A'
  and hire_date_last + INTERVAL '7 days' = CURRENT_DATE
  union 
  select '100' as type, emp_id, employee, emp_email, hire_date_last
  from internal.pr_employee_info
  where active = 'A'
  and hire_date_last + INTERVAL '100 days' = CURRENT_DATE
  `)
  const emps = empobj.rows
  console.log(emps)
  for (const emp of emps) {
    let emailAddr = emp.emp_email
    // emailAddr = 'jtwilson@ashevillenc.gov'   // <======TEST!!!!!!
    await ses_sendemail(emailAddr)
  }

  client.end()

// })()
}


