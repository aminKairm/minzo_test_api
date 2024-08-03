
import User from "../model/user.model.js"
import argon from "argon2"
import jwt from "jsonwebtoken"

export const login=async(req,res)=>{
    try{
        const user = await User.findOne({
            where:{
                email:req.body.email
            }
        });
        if(!user) return res.status(400).json({msg:"User not found"});
        const match = await argon.verify(user.password,req.body.password)
        if(!match) return res.status(200).json({msg:"password in correct"})
        const payload = {uuid:user.uuid}
        const token =jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"1h"});
        const id = user.uuid
        const name = user.name
        const email = user.email
        const role=user.role
         res.status(200).json({status:"success",massgae:"User Logged in",token:token,id,name,email,role});
    }catch(e){
        res.status(400).json(e)
    }
}
export const Me = async(req,res)=>{
        var token = req.headers['x-api-key'];
        var payload = jwt.verify(token,process.env.SECRET_KEY);
        req.uuid= payload.uuid
        const user = await User.findOne({
            where:{uuid:req.uuid}
        });
        res.status(200).json(user)
}
export const logout=async(req,res)=>{
    var token = req.headers['x-api-key'];
        var payload = jwt.verify(token,process.env.SECRET_KEY);
        req.uuid= payload.uuid
        res.status(200).json({msg:"Loguted"})
    
}


