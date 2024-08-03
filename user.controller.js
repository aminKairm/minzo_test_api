
import jwt from "jsonwebtoken";
import User from "../model/user.model.js"
import argon from "argon2"
export const getAllUser =async(req,res)=>{
    try{ 
        const user = await User.findAll();
        res.status(200).json(user)
    }catch(e){
        res.status(400).json({msg:"User not found"+e}

    )}  
}
export const getOneUser =async(req,res)=>{
    try{
        const user = await User.findOne({
            where:{
                uuid:req.params.id
            }
        })
        if(!user) return res.status(400).json({msg:"User not found"})
        res.status(200).json(user)
    }catch(e){
        res.status(400).json(e)
    }
    
}
export const createUser =async(req,res)=>{
    const user = await User.findOne({
        where:{
            email:req.body.email
        }
    })
    if(user) return res.status(400).json({msg:"User is already"})
    const {name,email,password,confirmPassword,role}=req.body;
    const hashPassword = await argon.hash(password);
    if(password!=confirmPassword) return res.status(400).json({msg:"password incorrect"});
    const newUser = await User.create({
        name:name,email:email,password:hashPassword,role:role
    })
    const payload = {userId:newUser.uuid}
    const token = jwt.sign(payload,process.env.SECRET_KEY);
    res.status(200).json({msg:"User is created",token})
}
export const updateUser =async(req,res)=>{
    const user = await User.findOne({
        where:{
            uuid:req.params.id
        }
    })
    if(!user) res.status(400).json({msg:"User is not found"})
    const {name,email,password,confirmPassword,role}= req.body;
    let hashPassword;
    if(password ==="" || password === null){
        hashPassword = user.password
    }
    hashPassword = await argon.hash(password);
    if(password !== confirmPassword) return res.status(400).json({msg:"password is incorrect"})
    try{
        await User.update({
            
            name:name,email:email,password:hashPassword,role:role
        },{where:{id:user.id}})
        res.status(200).json({msg:"user is updated"})
    }catch(e){res.status(400).json({msg:e})}
}


export const deleteUser =async(req,res)=>{
    const user = await User.findOne({
        where:{
            uuid:req.params.id
        }
    })
    if(!user) return res.status(200).json({msg:"User not found"})
    try{
        await User.destroy({
            where:{
                id:user.id
            }
        })
        res.status(200).json({msg:"User is deleted"})
}catch(e){
    res.status(400).json(e)
}
}
