
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const {pass} = require('./config');
const app = express();

//View engine setup
app.engine('handlebars',exphbs());
app.set('view engine','handlebars');

//Static folder
app.use('/public',express .static(path.join(__dirname,'public')));

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.render('contact');
})

app.post('/send',(req,res)=>{
   const output=`
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Name: ${req.body.company}</li>
            <li>Name: ${req.body.email}</li>
            <li>Name: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>

   `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        //host:
        secure: false,
        port: 25,
        auth: {
            //user:<mailer_email_address>
             user: "bhanuraghav1999@gmail.com",
             pass: `${pass}`
        },
        //when use with local host
        tls:{
            rejectUnauthorized: false 
        }
    });

    const reciever = 'bhanupratapbp24@gmail.com';
    // setup email data with unicode symbols
    let mailOptions = {
        //sender
        from: ' "Nodemailer Contact " <bhanuraghav1999@gmail.com>',
        //reciever
        to: `${reciever}`,// list of receivers

        subject: 'Mail from Nodemailer',
        //test: output, // plain text body
        //html: '<b>Hello world</b>' // html body
        html: output
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact',{msg : `Email has been send at ${reciever}`});
       
    });

})

app.listen(3000,()=>{
    console.log("server started at 3000");
})
