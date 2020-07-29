import nodeMailer from 'nodemailer';

export default class Utils {


    static sendEmail(email: string, code: string) {
        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_MTATITRA,
                pass: process.env.PASS_MTATITRA
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        if (process.env.ENV == "dev") {
            console.log("HERE")
            transporter = nodeMailer.createTransport({
                port: 1025,
                ignoreTLS: true,
                // USE maildev for test xD 
            });
        }


        let nomDomaine = process.env.URL
        let mailOptions = {
            to: email,
            subject: 'Confirmation Compte',
            html: `    
        <div style="display: flex; align-items: center; justify-content: center; text-align: center;">

        <div style="box-shadow: #f0f0f0 4px 2px 2px 1px; border: #f0f0f0 1px solid; height: 400px; width: 400px;">


                <h1 style="font-size: xx-large;margin-top: 70px;">MTATITRA</h1>
                <p style="font-size: medium;margin-top: 55px;">Veuillez cliquer sur ce bouton pour confirmer votre compte</p>
                <a style="text-decoration: none !important;" href="http${process.env.SSL? "s": ""}://${nomDomaine}/mailconfirmation/${email}/${code}">
                    <button
                    style="background-color: #EF1233;font-size: 15px;border: none;border-radius: 0%; color: white; font-weight: 700; padding: 7px; display: inline-block; margin-top: 10px; border-radius: 1px;margin-top: px;">
                    Confirmer
                </button>
                <br>
                <span>CODE: ${code} </span>
            </a>
        </div>
    </div>
            `
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }


    static sendResetEmail(email: string, code: string) {
        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_MTATITRA,
                pass: process.env.PASS_MTATITRA
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        if (process.env.ENV == "dev") {
            console.log("HERE")
            transporter = nodeMailer.createTransport({
                port: 1025,
                ignoreTLS: true,
                // USE maildev for test xD 
            });
        }


        let nomDomaine = process.env.URL
        let mailOptions = {
            to: email,
            subject: 'Reset PASS Compte',
            html: `    
        <div style="display: flex; align-items: center; justify-content: center; text-align: center;">

        <div style="box-shadow: #f0f0f0 4px 2px 2px 1px; border: #f0f0f0 1px solid; height: 400px; width: 400px;">


                <h1 style="font-size: xx-large;margin-top: 70px;">MTATITRA</h1>
                <p style="font-size: medium;margin-top: 55px;">Veuillez cliquer sur ce bouton pour confirmer votre compte</p>
                <a style="text-decoration: none !important;" href="http${process.env.SSL? "s": ""}://${nomDomaine}/api/client/reset/${email}/${code}">
                    <button
                    style="background-color: #EF1233;font-size: 15px;border: none;border-radius: 0%; color: white; font-weight: 700; padding: 7px; display: inline-block; margin-top: 10px; border-radius: 1px;margin-top: px;">
                    Confirmer
                </button>
            </a>
        </div>
    </div>
            `
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }

}