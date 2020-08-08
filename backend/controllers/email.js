const nodemailer    = require('nodemailer')
const testSender    = 'john.yohan.park@gmail.com'
const testReceiver  = 'johnpa2' // nparmele johnpa2
const transportData = { 
  host   : 'mail.cisco.com',
  secure : false           ,
  port   : 25              ,
  tls    : { rejectUnauthorized: false }
}

// POST 
// localhost:8080/api/email/request_help
async function requestHelp(req, res) {
  const admin_email = `${testReceiver}@cisco.com`
  const { email, subject, body } = req.body

  const mailData = {
    from    :  testSender   ,   // sender adr  REPLACE testSender WITH VARIABLE email
    to      :  admin_email  ,   // list of receivers
    subject :  subject      ,   // subject line
    text    :  body         ,   // plain text body
    html    : `<p>${body}</p>`  // html body
  }
  const transporter = nodemailer.createTransport(transportData)
  await transporter.sendMail(mailData, (err, info) => { if (err) console.log(err) })
  res.send() 
}

// POST
// localhost:8080/api/email/contact_sco
async function contactSCO(req, res) {
  const { quarter, year, contactSCOData : { sco_username, service_owner_username, control_name, control_type, track,
          application_name, status, timeline, completed_month, subject, body, 
          service_owner, service_control_owner } } = req.body

  const to_email = `${testReceiver}@cisco.com` 
  const mailData = {
    from    :  `${testSender}`            , // service_owner_username @cisco.com RIGHT NOW @gmail
    to      :  `${testReceiver}@cisco.com`, // sco_username
    subject :  subject      ,
    text    :  body         , 
    html    : 
    `<table>
      <tbody>
        <tr><td>Service Owner</td><td>${' '}</td><td>${service_owner}</td></tr>
        <tr><td>Service Control Owner</td><td>${' '}</td><td>${service_control_owner}</td></tr>
        <tr><td>Control Name</td><td>${' '}</td><td>${control_name}</td></tr>
        <tr><td>Control Type</td><td>${' '}</td><td>${control_type}</td></tr>
        <tr><td>Track</td><td>${' '}</td><td>${track}</td></tr>
        <tr><td>Application Name</td><td>${' '}</td><td>${application_name}</td></tr>
        <tr><td>Status</td><td>${' '}</td><td>${status}</td></tr>
        <tr><td>Timeline</td><td>${' '}</td><td>${timeline ? timeline : 'N/A'}</td></tr>
        <tr><td>Completed Month</td><td>${' '}</td><td>${completed_month ? completed_month : 'N/A'}</td></tr>
        <tr><td>Fiscal Year & Quarter</td><td>${' '}</td><td>FY${year.substr(year.length - 2)} ${quarter}</td></tr>
      </tbody>
    </table>
    <p>${body}</p>`
  }
  const transporter = nodemailer.createTransport(transportData)
  await transporter.sendMail(mailData, (err, info) => { if (err) console.log(err) })
  res.send() 
}

module.exports = { requestHelp, contactSCO }