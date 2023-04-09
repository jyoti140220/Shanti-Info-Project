const joi = require('@hapi/joi')


exports.validateSignupData = async (reqdata) =>{
    const authschema=joi.object({
        firstName: joi.string().required().messages({"string.empty": "First name is required","any.required": "First name is required"}),
        lastName: joi.string().required().messages({"string.empty": "last name is required","any.required": "last name is required"}),
        email: joi.string().email().required().messages({"string.empty": "email is required","any.required": "email is required"}),
        phone:joi.number().required().messages({"string.empty": "phone number is required","any.required": "Phone number is required"}),
        password: joi.string().required().messages({"string.empty": "password is required","any.required": "Password is required"}),
        confirmPassword: joi.string().equal(joi.ref('password')).required().label('Confirm password')
        .messages({"string.empty": "Conform Password is required","any.required": "Confirm Password is required",'any.only':"password And confirm password does not"}),
        address: joi.string().required().messages({"string.empty": "address is required","any.required": "address is required",}),
    })
    const result=authschema.validate(reqdata)
    if(result.error){
        console.log("error--", result.error.details[0].message)
        return {status: "Error", message: result.error.details[0].message}
    }else{
        return {status:"Success"}
    }
}



exports.validateLoginData = async (reqdata) =>{
    const authschema=joi.object({
        phoneOrEmail: joi.string().required().messages({"string.empty": "phone or email is required","any.required": "phone or email is required"}),
        password: joi.string().required().messages({"string.empty": "password is required","any.required": "Password is required"})
    })
    const result=authschema.validate(reqdata)
    if(result.error){
        console.log("error--", result.error.details[0].message)
        return {status: "Error", message: result.error.details[0].message}
    }else{
        return {status:"Success"}
    }
}

exports.validateForgotPassData= async(reqdata) =>{
    const authschema=joi.object({
        email: joi.string().email().required().messages({"string.empty": "email is required","any.required": "email is required"}),
    })
    const result=authschema.validate(reqdata)
    if(result.error){
        console.log("error--", result.error.details[0].message)
        return {status: "Error", message: result.error.details[0].message}
    }else{
        return {status:"Success"}
    }
}

exports.validateverifyOtp= async(reqdata) =>{
    const authschema=joi.object({
        email: joi.string().email().required().messages({"string.empty": "email is required","any.required": "email is required"}),
        OTP: joi.string().required().messages({"string.empty": "OTP is required","any.required": "OTP is required"}),

    })
    const result=authschema.validate(reqdata)
    if(result.error){
        console.log("error--", result.error.details[0].message)
        return {status: "Error", message: result.error.details[0].message}
    }else{
        return {status:"Success"}
    }
}

exports.validateResetPass= async(reqdata) =>{
    const authschema=joi.object({
        password: joi.string().required().messages({"string.empty": "password is required","any.required": "Password is required"}),
        confirmPassword: joi.string().equal(joi.ref('password')).required().label('Confirm password')
        .messages({"string.empty": "Conform Password is required","any.required": "Confirm Password is required",'any.only':"password And confirm password does not"}),
    })
    const result=authschema.validate(reqdata)
    if(result.error){
        console.log("error--", result.error.details[0].message)
        return {status: "Error", message: result.error.details[0].message}
    }else{
        return {status:"Success"}
    }
}


exports.validateUpdateProfileData = async (reqdata) =>{
    const authschema=joi.object({
        firstName: joi.string().required().messages({"string.empty": "First name is required","any.required": "First name is required"}),
        lastName: joi.string().required().messages({"string.empty": "last name is required","any.required": "last name is required"}),
        email: joi.string().email().required().messages({"string.empty": "email is required","any.required": "email is required"}),
        phone:joi.number().required().messages({"string.empty": "phone number is required","any.required": "Phone number is required"}),
        address: joi.string().required().messages({"string.empty": "address is required","any.required": "address is required"})
    })
    const result=authschema.validate(reqdata)
    if(result.error){
        console.log("error--", result.error.details[0].message)
        return {status: "Error", message: result.error.details[0].message}
    }else{
        return {status:"Success"}
    }
}

exports.validateviewFriendProfile = async(reqdata) =>{
    const authschema=joi.object({
        userId: joi.string().required().messages({"string.empty": "user id is required","any.required": "user id is required"}),
    })
    const result=authschema.validate(reqdata)
    if(result.error){
        console.log("error--", result.error.details[0].message)
        return {status: "Error", message: result.error.details[0].message}
    }else{
        return {status:"Success"}
    }
}

exports.validatesendFriendRequest = async(reqdata) =>{
    const authschema=joi.object({
        friendUserId: joi.string().required().messages({"string.empty": "Friend id is required","any.required": "Friend id is required"}),
    })
    const result=authschema.validate(reqdata)
    if(result.error){
        console.log("error--", result.error.details[0].message)
        return {status: "Error", message: result.error.details[0].message}
    }else{
        return {status:"Success"}
    }
}

exports.validateRejectFriendRequest = async(reqdata) =>{
    const authschema=joi.object({
        friendUserId: joi.string().required().messages({"string.empty": "Friend id is required","any.required": "Friend id is required"}),
    })
    const result=authschema.validate(reqdata)
    if(result.error){
        console.log("error--", result.error.details[0].message)
        return {status: "Error", message: result.error.details[0].message}
    }else{
        return {status:"Success"}
    }
}

exports.validateAcceptFriendRequest = async(reqdata) =>{
    const authschema=joi.object({
        friendUserId: joi.string().required().messages({"string.empty": "Friend id is required","any.required": "Friend id is required"}),
    })
    const result=authschema.validate(reqdata)
    if(result.error){
        console.log("error--", result.error.details[0].message)
        return {status: "Error", message: result.error.details[0].message}
    }else{
        return {status:"Success"}
    }
}

exports.validateRefreshToken = async(reqdata) =>{
    const authschema=joi.object({
        userId: joi.string().required().messages({"string.empty": "User id is required","any.required": "User id is required"}),
    })
    const result=authschema.validate(reqdata)
    if(result.error){
        console.log("error--", result.error.details[0].message)
        return {status: "Error", message: result.error.details[0].message}
    }else{
        return {status:"Success"}
    }
}

exports.validateRemoveFriend = async(reqdata) =>{
    const authschema=joi.object({
        friendUserId: joi.string().required().messages({"string.empty": "Friend id is required","any.required": "Friend id is required"}),
    })
    const result=authschema.validate(reqdata)
    if(result.error){
        console.log("error--", result.error.details[0].message)
        return {status: "Error", message: result.error.details[0].message}
    }else{
        return {status:"Success"}
    }
}