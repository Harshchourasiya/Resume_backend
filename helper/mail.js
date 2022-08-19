const nodemailer = require("nodemailer");

const send = async(body) => {

  let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: process.env['SMTP_USERNAME'],
          pass: process.env['SMTP_PASSWORD']
      }
  });

  transporter.sendMail({
    from: body.from, 
    to: body.to, 
    subject: body.subject, 
    text: body.text
  });

}

module.exports = {
    send : send
}