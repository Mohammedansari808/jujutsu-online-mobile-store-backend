import express from 'express'
import { resetauth } from '../middleware/resetauth.js';
import { auth } from "../middleware/auth.js"
import bcrypt from "bcrypt";
import nodemailer from "nodemailer"
import stripes from 'stripe'
import { v4 as uuidv4 } from 'uuid';
const router = express.Router()
import { client } from "../index.js";
import jwt from "jsonwebtoken";
import { otauth } from '../middleware/otauth.js';
import { ObjectId } from 'mongodb';
import * as dotenv from 'dotenv'

dotenv.config()

const stripe = stripes(process.env.STR_KEY);


const calculateOrderAmount = (items) => {
    return items * 100
};

router.post("/pay", auth, async function (request, response) {
    const data = request.body;

    // Create a PaymentIntent with the order amount and currency

    const customer = await stripe.customers.create();
    customer.email = data.email
    const { product, address } = request.body
    const idempontencyKey = uuidv4()
    const prize = product.phone_rate - (product.phone_rate * product.phone_offer / 100)

    const paymentIntent = await stripe.paymentIntents.create({

        amount: calculateOrderAmount(parseInt(prize)),
        currency: "inr",
        shipping: {
            name: "ansari",
            address: {
                country: 'IN',
                state: address.state,
                city: address.city,
                line1: address.address
            }
        },
        customer: customer.id,
        setup_future_usage: "off_session",

        automatic_payment_methods: {
            enabled: true,
        }
        , receipt_email: data.email
    }, { idempotencyKey: idempontencyKey });

    // const paymentdetails = await client.db("jujutsustore").collection("paymentdetails").insertOne(customer)
    response.send({
        "clientSecret": paymentIntent.client_secret,

    });

})


router.get("/onetimetoken", auth, async function (request, response) {
    const token = jwt.sign({ name: "my_key", used: false }, process.env.OTTN)
    if (token) {
        response.send({ token: token })
    } else {
        response.send({ message: "error" })
    }
})







router.post("/signup", async function (request, response) {
    const { username, password, email } = request.body
    const isSCheck = await client.db("jujutsustore").collection("signupusers").findOne({ username: username })
    const isSCheckE = await client.db("jujutsustore").collection("signusers").findOne({ email: email })
    const isCheck = await client.db("jujutsustore").collection("login").findOne({ username: username })
    const isCheckE = await client.db("jujutsustore").collection("login").findOne({ email: email })
    if (!isCheck && !isCheckE && !isSCheck && !isSCheckE) {

        const Hashedpassword = await Hashed(password)
        async function Hashed(password) {
            const NO_OF_ROUNDS = 10
            const salt = await bcrypt.genSalt(NO_OF_ROUNDS)
            const HashedPassword = await bcrypt.hash(password, salt)
            return HashedPassword
        }
        let tempLink = ""
        const character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789"
        const characters = character.length
        for (let i = 0; i < 60; i++) {
            tempLink += character.charAt(Math.floor(Math.random() * characters))

        }

        let finalData = {
            username: username,
            password: Hashedpassword,
            role_id: 0,
            email: email,
            verify_link: `http://localhost:3000/verify_link/${username}/${tempLink}`
        }
        const insertData = await client.db("jujutsustore").collection("signupusers").insertOne(finalData)
        if (insertData) {
            async function main(finalData) {
                let username = finalData.username;
                let email = finalData.email;
                let verify_link = finalData.verify_link

                let transporter = await nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.SMTP_MAIL,
                        pass: process.env.SMTP_KEY,
                    },
                });
                let info = await transporter.sendMail({
                    from: '"jujutsu store" <foo@example.com>', // sender address
                    to: `${email}`, // list of receivers
                    subject: "Verification link for Signin", // Subject line
                    text: "Hello world?", // plain text body
                    html: `Hi ${username} please click the below link to verify.
                    <div style="text-align:center;margin:45px">
                    <a rel="noopener" target="_blank" href=${verify_link} target="_blank"
                     style="font-size: 18px; font-family: Helvetica, Arial, sans-serif;
                     font-weight: bold; text-decoration: none;border-radius: 5px; 
                      padding: 12px 18px; border: 1px solid #1F7F4C;background-color: 
                    darkblue ;box-shadow:2px 2px 10px grey ;color:white;display: inline-block;">
                    Verify</a>
                    </div>

                    `, // html body
                });


                console.log("Message sent: %s", info.messageId);

                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                response.send({ message: "sign verify sent" })


            }

            main(finalData).catch(console.error);

        }

    } else {
        response.send({ message: "sign fail" })
    }
})

router.get("/verify_link/:username/:id", async function (request, response) {
    const { username, id } = request.params
    const link = `http://localhost:3000/verify_link/${username}/${id}`
    const isCheck = await client.db("jujutsustore").collection("signupusers").findOne({ verify_link: link })

    if (isCheck) {
        let checkData = {
            username: isCheck.username,
            password: isCheck.password,
            role_id: isCheck.role_id,
            email: isCheck.email,

            verify_link: isCheck.verify_link,
            OrderData: []
        }
        const insertData = await client.db("jujutsustore").collection("login").insertOne(checkData)

        if (insertData) {
            response.send({ message: "sign success" })
            await client.db("jujutsustore").collection("userurls").insertOne({ username: username })

            client.db("jujutsustore").collection("login").updateOne({ username: username }, { $unset: { verify_link: link } })
            client.db("jujutsustore").collection("signupusers").updateOne({ username: username }, { $unset: { verify_link: link } })


        }

    } else {
        response.send({ message: "error" })
    }

})

router.post("/login", async function (request, response) {
    const data = request.body

    const loginData = await client.db("jujutsustore").collection("login").findOne({ username: data.username })
    if (loginData) {

        async function comparPassword() {
            return bcrypt.compare(data.password, loginData.password);
        }
        const comparePassword = await comparPassword()
        if (comparePassword) {
            const token = jwt.sign({ _id: ObjectId(loginData._id) }, process.env.MY_KEY)
            response.send({ message: "successful login", token: token, role_id: loginData.role_id, email: loginData.email })
        } else {
            response.send({ message: "error" })
        }
    } else {
        response.send({ message: "error" })
    }

})



router.post("/forgetpassword", async function (request, response) {
    const { username, email } = request.body;
    const data = await client.db("jujutsustore").collection("login").findOne({ username: username })
    if (data.username == username && data.email == email) {
        let tempLink = ""
        const character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789"
        const characters = character.length
        for (let i = 0; i < 40; i++) {
            tempLink += character.charAt(Math.floor(Math.random() * characters))

        }
        const otp = Math.floor(1000 + Math.random() * 9000)
        const otpData = {
            otp: otp,
            email: email,
            username: username,
            tempLink: `https://lovely-alfajores-3b1c69.netlify.router/verification-link/${username}/${tempLink}`,
        }
        const checkData = await client.db("jujutsustore").collection("otp").findOne({ username: username })

        if (checkData == null) {
            const otpInsertData = client.db("jujutsustore").collection("otp").insertOne(otpData)

            const finalData = await client.db("jujutsustore").collection("otp").findOne({ username: username })


            setTimeout(async () => {
                await client.db("jujutsustore").collection("otp").deleteOne({ otp: otpData.otp })
            }, 5 * 60 * 1000);


            async function main(finalData) {

                // Generate test SMTP service account from ethereal.email
                // Only needed if you don't have a real mail account for testing
                let username = finalData.username;
                let otp = finalData.otp;
                let email = finalData.email;
                let tempLink = finalData.tempLink
                let testAccount = await nodemailer.createTestAccount();
                // create reusable transporter object using the default SMTP transport


                let transporter = await nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    tls: {
                        rejectUnauthorized: false
                    },
                    auth: {
                        user: process.env.SMTP_MAIL,
                        pass: process.env.SMTP_KEY,
                    },
                });

                // send mail with defined transport object

                let info = await transporter.sendMail({
                    from: '"jujutsustore" <foo@example.com>', // sender address
                    to: `${email}`, // list of receivers
                    subject: "Verification link", // Subject line
                    text: "Hello world?", // plain text body
                    html: `Hi ${username} your otp is <strong>${otp} </strong>it will expire in two minutes
                    please paste it in the following link ${tempLink}`, // html body
                });

                response.send({ message: "link sent" });

                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

            }

            main(otpData).catch(console.error);

            ;

        }

    } else {
        response.send("error")
    }


});


router.post("/verification-link/:username/:id", async function (request, response) {
    const { username, id } = request.params

    let data = request.body
    const otpData = await client.db("jujutsustore").collection("otp").findOne({ username: username })

    if (parseInt(data.otp) == parseInt(otpData.otp)) {
        const token = jwt.sign({ _id: ObjectId(data._id) }, process.env.RESET_KEY)
        response.send({ message: "otp success", username: username, token: token })
    } else {
        response.send({ message: "error" })
    }

})

router.put("/password-change/:username", resetauth, async function (request, response) {
    let data = request.body
    const { username } = request.params
    const Hashedpassword = await Hashed(data.newpassword)
    async function Hashed(password) {
        const NO_OF_ROUNDS = 10
        const salt = await bcrypt.genSalt(NO_OF_ROUNDS)
        const HashedPassword = await bcrypt.hash(password, salt)
        return HashedPassword
    }
    let checkuser = await client.db("jujutsustore").collection("login").updateOne({ username: username }, { $set: { password: Hashedpassword } })
    if (checkuser) {
        response.send({ message: "success" })
    } else if (response.status === 404) {
        response.send({ message: "error" })
    }


})

export default router
