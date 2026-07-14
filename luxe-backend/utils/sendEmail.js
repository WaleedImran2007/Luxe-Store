import { Resend } from "resend";

const sendEmail = async (email, token) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        await resend.emails.send({
            from: "LUXE STORE <no-reply@waleedimran.me>",
            to: email,
            subject: "Verify your email",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Verify Your Account</title>
                </head>

                <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

                    <div style="
                        max-width:600px;
                        margin:40px auto;
                        background:white;
                        border-radius:12px;
                        padding:40px;
                        box-shadow:0 4px 15px rgba(0,0,0,0.08);
                    ">

                        <div style="text-align:center;">
                            <h1 style="
                                color:#2563eb;
                                margin-bottom:10px;
                            ">
                                LUXE STORE
                            </h1>

                            <p style="
                                color:#555;
                                font-size:16px;
                            ">
                                Welcome! We're excited to have you onboard.
                            </p>
                        </div>


                        <div style="
                            margin:30px 0;
                            padding:20px;
                            background:#f8fafc;
                            border-radius:8px;
                            text-align:center;
                        ">

                            <h2 style="color:#333;">
                                Verify Your Email
                            </h2>

                            <p style="
                                color:#666;
                                font-size:15px;
                            ">
                                Please click the button below to verify your account and start using the LUXE STORE.
                            </p>


                            <a href="${process.env.FRONTEND_URL}/verify/${token}"
                                style="
                                    display:inline-block;
                                    margin-top:20px;
                                    padding:14px 30px;
                                    background:#2563eb;
                                    color:white;
                                    text-decoration:none;
                                    border-radius:8px;
                                    font-weight:bold;
                                ">
                                Verify Account
                            </a>

                        </div>


                        <p style="
                            color:#888;
                            font-size:13px;
                            text-align:center;
                        ">
                            If you did not create this account, you can safely ignore this email.
                        </p>


                        <hr style="
                            border:none;
                            border-top:1px solid #eee;
                            margin:25px 0;
                        ">


                        <p style="
                            text-align:center;
                            color:#999;
                            font-size:12px;
                        ">
                            © ${new Date().getFullYear()} LUXE STORE
                        </p>

                    </div>

                </body>
                </html>
            `
        });
    }

    catch (err) {
        console.error("EMAIL SENDING ERROR:", err);
        console.log(err);
    }
}

export default sendEmail;