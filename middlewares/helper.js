const jwt = require('jsonwebtoken')
const userModel = require("../model/users")
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')

exports.createJwtToken = async (data) => {
    let jwtSecretKey = process.env.Users_Jwt_key
    const token = await jwt.sign(data, jwtSecretKey, {
        expiresIn: '10m'
    });
    return token
}

// exports.decodeJwtToken = (req, res, next) => {
//     if (req.headers.authorization) {
//         var decoded = jwt_decode(req.headers.authorization);
//         req.user_id = decoded.user_id;
//         users.findOne({ where :{
//             user_id : req.user_id
//         }}).then(data => {
//             if(data){
//                 req.profile_id = data.profile_id;
//                 req.partner_id = decoded.partner_id;
//                 req.sub_permission = decoded.sub_permission;
//                 req.main_permission = decoded.main_permission;
//                 next();
//             } else {
//                 next({message:"Invalid Token"})
//             }
//         }).catch(err => {
//             next(err); 
//         })
//     } else {
//         res.json({
//             status: "failed",
//             message: "Token is required"
//         })
//     }
// }

exports.decodeJwtToken = (req, res, next) => {
    let jwtSecretKey = process.env.Users_Jwt_key
    console.log(req.headers)
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization, jwtSecretKey, async (err, decode) => {
            if (err) {
                res.json({
                    status: "failed",
                    message: "Token expired"
                })
            } else {
                req._id = decode._id
                const Users = await userModel.findOne({ _id: decode._id })
                if (!Users) {
                    next({ message: "Invalid Token" })
                } else {
                    next();
                }
            }
            console.log("errr", err, "decode --", decode)
        })
    } else {
        res.json({
            status: "failed",
            message: "Token is required"
        })
    }

}


exports.OtpGenerate = async () =>{
    const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
    return OTP
}
exports.sendmail = async (email, otp) => {
    return new Promise(async (resolve, reject) => {
        let mailTransporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'dipeshnagar3358@gmail.com',
            pass: 'jjgrdtsiiqxhehvc'
          }
        });
        let mailDetails = {
          from: 'dipeshnagar3358@gmail.com',
          to: email,
          subject: "Forgot password OTP",
          text: `Your forgot password OTP is ${otp}.`
        }
        mailTransporter.sendMail(mailDetails, function (err, data) {
          if (err) {
            reject("fail")
            console.log('Error Occurs');
            console.log(err)
          } else {
            resolve("success")
            console.log('Email sent successfully');
          }
        })
      })
}