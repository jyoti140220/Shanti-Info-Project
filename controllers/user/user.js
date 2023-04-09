const { validateSignupData, validateLoginData  , validateForgotPassData, validateverifyOtp, validateResetPass, validateUpdateProfileData, validateviewFriendProfile, validatesendFriendRequest
,validateRejectFriendRequest, validateAcceptFriendRequest, validateRefreshToken,validateRemoveFriend} = require("../../middlewares/validation")
const userModel = require("../../model/users")
const bcrypt = require('bcrypt')
const {createJwtToken, sendmail, OtpGenerate} = require("../../middlewares/helper")
exports.signup = async (req, res) => {
    const data = req.body
    const bodyValidate = await validateSignupData(data)
    if (bodyValidate.status == "Error") {
        return res.status(400).json({ status: 400, message: bodyValidate.message })
    }else{
        console.log("Data validate --")
    }
    try{
        const userExits = await userModel.findOne({
            $or:[
                {email: data.email},
               { phone: data.phone}
            ]
        })
        if (userExits){
            return res.status(400).json({status: 400, message: "user already exists with this email or phone number"})
        }else{
            const document = new userModel(data)
            const salt = await bcrypt.genSalt(10);
            document.password = await bcrypt.hash(document.password, salt);
            const result = await document.save()
            const TOKEN = await createJwtToken({_id: result._id, phone: result.phone, email: result.email})
            return res.status(200).json({
                message:"You Have Signup Succesfully!!",
                status:200,
                Token: TOKEN,
                userData: result
            })
        }
    }catch(err){
        console.log("Some error -", err)
      return res.status(400).json({status: 400, message: "Somthing went wrong"})
    }
  

}

exports.login= async (req, res) => {
    const data = req.body
    const bodyValidate = await validateLoginData(data)
    if (bodyValidate.status == "Error") {
        return res.status(400).json({ status: 400, message: bodyValidate.message })
    }else{
        console.log("Data validate --")
    }
    try{
        const userFind = await userModel.findOne({
            $or:[
                {email: data.phoneOrEmail},
               { phone: data.phoneOrEmail}
            ]
        })
        console.log("---", userFind)
        if (!userFind){
            return res.status(400).json({status: 400, message: "user does not exists with this email or phone number"})
        }else{
            const comaparePassword = await bcrypt.compare(data.password, userFind.password)
            if (comaparePassword){
                const TOKEN = await createJwtToken({_id: userFind._id, phone: userFind.phone, email: userFind.email})
                return res.status(200).json({status: 200, message: "You Have Login Succesfully!!", Token: TOKEN, userData: userFind})

            }else{
                return res.status(400).json({status: 400, message: "Invalid password"})
            }
        }
    }catch(err){
        console.log("Some error -", err)
      return res.status(400).json({status: 400, message: "Somthing went wrong"})
    }
}

exports.forgotPassSendOtp = async (req, res) => {
    const data = req.body
    const bodyValidate = await validateForgotPassData(data)
    if (bodyValidate.status == "Error") {
        return res.status(400).json({ status: 400, message: bodyValidate.message })
    }else{
        console.log("Data validate --")
    }
    const ID = req._id
    const findUser = await userModel.findOne({
        $and:[
                {_id:ID},
               { email: data.email}
            ]
    })
    if (!findUser){
        return res.status(400).json({status: 400, message: "Email not exits"})
    }
    const OTP = await OtpGenerate();
    const sendmaila = await sendmail(data.email, OTP)

   await userModel.updateOne({
        _id: ID
    }, {
        $set: {
            OTP:OTP
        }
    }).then((response)=>{
        return res.status(200).json({status: 200, message: "OTP send successfully!!", OTP: OTP})

    }).catch((err)=>{
        consolee.log("error --", err)
        return res.status(400).json({status: 400, message: "Somthing went wrong"})
    })
    
}

exports.verifyotp = async (req, res) => {
    const data = req.body
    const bodyValidate = await validateverifyOtp(data)
    if (bodyValidate.status == "Error") {
        return res.status(400).json({ status: 400, message: bodyValidate.message })
    }else{
        console.log("Data validate --")
    }
    const ID = req._id
    const findUser = await userModel.findOne({
        $and:[
                {_id:ID},
               { email: data.email}
             ]
    })
    if (findUser){
        if (findUser.OTP == data.OTP){
            await userModel.updateOne({
                _id: ID
            }, {
                $set: {
                    OTP:null
                }
            }).then((response)=>{
                return res.status(200).json({status: 200, message: "OTP verify successfully!!"})        
            }).catch((err)=>{
                consolee.log("error --", err)
                return res.status(400).json({status: 400, message: "Somthing went wrong"})
            })           
        }else{
            return res.status(400).json({status: 400, message: "Invalid OTP"})
        }

    }else{
        return res.status(400).json({status: 400, message: "User not found"})
    }
}

exports.resetPassword = async (req, res) => {
    const data = req.body
    const bodyValidate = await validateResetPass(data)
    if (bodyValidate.status == "Error") {
        return res.status(400).json({ status: 400, message: bodyValidate.message })
    }else{
        console.log("Data validate --")
    }
    const ID = req._id
    const FindUser = await userModel.findOne({_id: ID})
    if(FindUser){
        const salt = await bcrypt.genSalt(10);
         const password1 = await bcrypt.hash(data.password, salt);
        await userModel.updateOne({
            _id: ID
        }, {
            $set: {
                password:password1
            }
        }).then((response)=>{
            return res.status(200).json({status: 200, message: "Password updated successfully!!"})        
        }).catch((err)=>{
            consolee.log("error --", err)
            return res.status(400).json({status: 400, message: "Somthing went wrong"})
        })  
    }else{
        return res.status(400).json({status: 400, message: "user not found"})
    }
}

exports.updateprofile = async (req, res) => {
    const data = req.body
    const bodyValidate = await validateUpdateProfileData(data)
    if (bodyValidate.status == "Error") {
        return res.status(400).json({ status: 400, message: bodyValidate.message })
    }else{
        console.log("Data validate --")
    }
    const ID = req._id
    const FindUser = await userModel.findOne({_id: ID})
    if (FindUser){
        await userModel.updateOne({
            _id: ID
        }, {
            $set: {
                firstName: data.firstName,
                lastName:  data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address
            }
        }).then((response)=>{
            return res.status(200).json({status: 200, message: "Profile updated successfully!!"})        
        }).catch((err)=>{
            consolee.log("error --", err)
            return res.status(400).json({status: 400, message: "Somthing went wrong"})
        })  

    }else{
        return res.status(400).json({status: 400, message: "user not found with this Id"})
    }

}

exports.searchFriendList = async (req, res)=>{
    console.log(req._id)
    const findusers = await userModel.findOne({_id: req._id})
    if(!findusers){
        return res.status(400).json({status: 400, message: "user not found with this ID"})
    }
    const newArray = [...findusers.alreadyFriendArray, ... findusers.friendRequestArray]
    newArray.push(req._id)
    console.log(newArray, "===")
    const search = req.body.search
    if (!search){
        return res.status(400).json({status: 400, message: "Search keyword is required"})
    }
    var blog_name = new RegExp('^' + search, 'i');
    var filter = {
        $and: [{
           _id:{$nin: newArray}
        },{
            $or: [{
                firstName: {
                    $regex: blog_name
                }
            }, {
                lastName: {
                    $regex: blog_name
                }
            }, {
                phone:{
                    $regex: blog_name
                }
            },
            {
                email: {
                    $regex: blog_name
                }
            }]
        }]

    }
    
    const users = await userModel.find(filter)
    return res.status(200).json({status: 200,message: "user list", totalUsers: users.length, Users: users})

}


exports.viewFriendProfile = async (req, res) => {
    const data = req.body
    const bodyValidate = await validateviewFriendProfile(data)
    if (bodyValidate.status == "Error") {
        return res.status(400).json({ status: 400, message: bodyValidate.message })
    }else{
        console.log("Data validate --")
    }
    const findUserFriendPrfile = await userModel.findOne({_id:data.userId })
    if (!findUserFriendPrfile){
        return res.status(400).json({status: 400, message: "User not found with this Id", Data: {}})
    }else{
        return res.status(200).json({status: 200, message: "User Found", Data: findUserFriendPrfile})
    }
}

exports.sendFriendRequest = async(req,res)=>{
    const ID = req._id
    const data = req.body
    const bodyValidate = await validatesendFriendRequest(data)
    if (bodyValidate.status == "Error") {
        return res.status(400).json({ status: 400, message: bodyValidate.message })
    }else{
        console.log("Data validate --")
    }

    const FindUsers = await userModel.findOne({_id: ID})
    if(!FindUsers){
        return res.status(400).json({status: 400, message: "User not found"})
    }
    await userModel.updateOne({_id:ID},{$push:{friendRequestArray: data.friendUserId}}).then((response)=>{
        return res.status(200).json({status: 200, message: "Friend request send successfully!!"})

    }).catch((err)=>{
        console.log("Error--", err)
        return res.status(400).json({status: 400, message: "Somthing went wrong"})
    })
    
}

exports.friendList = async (req, res)=>{
    const ID = req._id
    const findUserById = await userModel.findOne({_id: ID})
    if(!findUserById){
       return res.status(400).json({status: 400, message: "User not found", data: {}})
    }else{
      const FindALLFriend = await userModel.find({_id:{$in: findUserById.alreadyFriendArray}})
      return res.status(200).json({status: 200, toatlFriend: FindALLFriend.length, data: FindALLFriend })
    }
}

exports.friendRequestList = async(req,res)=>{
    const ID = req._id
    const findUserById = await userModel.findOne({_id: ID})
    if(!findUserById){
       return res.status(400).json({status: 400, message: "User not found", data: {}})
    }else{
      const FindALLFriend = await userModel.find({_id:{$in: findUserById.friendRequestArray}})
      return res.status(200).json({status: 200, toatlFriendRequest: FindALLFriend.length, data: FindALLFriend })
    }
}

exports.rejectFriendReuest = async(req,res)=>{
    const data = req.body
    const bodyValidate = await validateRejectFriendRequest(data)
    if (bodyValidate.status == "Error") {
        return res.status(400).json({ status: 400, message: bodyValidate.message })
    }else{
        console.log("Data validate --")
    }
    const ID = req._id
    const findUser = await userModel.findOne({_id: ID})
    if (!findUser){
       return res.status(400).json({status: 400, message: "User not found"})
    }else{
        await userModel.updateOne({_id:ID},{$pull:{friendRequestArray: data.friendUserId}}).then((response)=>{
            return res.status(200).json({status: 200, message: "Friend request rejected successfully!!"})
        }).catch((err)=>{
            console.log("Error--", err)
            return res.status(400).json({status: 400, message: "Somthing went wrong"})
        })
    }
}

exports.acceptFriendRequest = async (req, res) => {
    const data = req.body
    const bodyValidate = await validateAcceptFriendRequest(data)
    if (bodyValidate.status == "Error") {
        return res.status(400).json({ status: 400, message: bodyValidate.message })
    }else{
        console.log("Data validate --")
    }
    const ID = req._id
    const findUser = await userModel.findOne({_id: ID})
    if (!findUser){
        return res.status(400).json({status: 400, message: "User not found"})
    }else{
        await userModel.updateOne({_id:ID},{$pull:{friendRequestArray: data.friendUserId}}).then(async(response)=>{
            await userModel.updateOne({_id:ID},{$push:{alreadyFriendArray: data.friendUserId}}).then((response)=>{
                return res.status(200).json({status: 200, message: "Friend request accepted successfully!!"})
    
            }).catch((err)=>{
                console.log("Error--", err)
                return res.status(400).json({status: 400, message: "Somthing went wrong"})
            })
        }).catch((err)=>{
            console.log("Error--", err)
            return res.status(400).json({status: 400, message: "Somthing went wrong"})
        })
    }
}


exports.refreshToken = async (req,res) => {
    const data = req.body
    const bodyValidate = await validateRefreshToken(data)
    if (bodyValidate.status == "Error") {
        return res.status(400).json({ status: 400, message: bodyValidate.message })
    }else{
        console.log("Data validate --")
    }
    const ID = req.body.userId
    const findUser = await userModel.findOne({_id: ID})
    if (!findUser){
        return res.status(400).json({status: 400, message: "User not found"})

    }else{
        const TOKEN = await createJwtToken({_id: findUser._id, phone: findUser.phone, email: findUser.email})
        return res.status(200).json({status: 200, Token: TOKEN})

    }
}

exports.removeFriend = async (req, res) => {
    const data = req.body
    const bodyValidate = await validateRemoveFriend(data)
    if (bodyValidate.status == "Error") {
        return res.status(400).json({ status: 400, message: bodyValidate.message })
    }else{
        console.log("Data validate --")
    }
    const ID = req._id
    const findUser = await userModel.findOne({_id: ID})
    if (!findUser){
       return res.status(400).json({status: 400, message: "User not found"})
    }else{
        await userModel.updateOne({_id:ID},{$pull:{alreadyFriendArray: data.friendUserId}}).then((response)=>{
            return res.status(200).json({status: 200, message: "Friend removed successfully!!"})
        }).catch((err)=>{
            console.log("Error--", err)
            return res.status(400).json({status: 400, message: "Somthing went wrong"})
        })
    }
}