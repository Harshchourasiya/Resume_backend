const nodemailer = require("nodemailer");

const send = async(body) => {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'Harshchourasiya13@gmail.com',
          pass: 'limxthxgtkonuejy'
      }
  });

  console.log("Send Mail" + body.to);
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