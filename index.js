const { Client } = require('pg')
const sendEmails = require('./sendEmails')

exports.handler = async (event) => {

  const client = new Client({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: 5432
  })
  await client.connect()

  const empobj = await client.query(`
  select '7' as type, emp_id, employee, emp_email, hire_date_last
  from internal.pr_employee_info
  where active = 'A'
  and hire_date_last + INTERVAL '3 days' = CURRENT_DATE
  union 
  select '100' as type, emp_id, employee, emp_email, hire_date_last
  from internal.pr_employee_info
  where active = 'A'
  and hire_date_last + INTERVAL '100 days' = CURRENT_DATE
  `)
  const emps = empobj.rows
console.log(emps)
  // for (const emp of emps) {
  //   const ret = await ses_sendemail(emailAddrs)
  // }

  client.end()

}


