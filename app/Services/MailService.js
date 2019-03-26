const nodemailer = require('nodemailer');
const Env = use('Env')
const account = Env.get('MAIL_ADDRESS')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:  account,
    pass: Env.get('MAIL_PASSWD')
  }
});

class MailService {
  static send({subject, text}) {
    var mailOptions = {
      from: account,
      to: account,
      subject: subject,
      text: text
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
module.exports = MailService
