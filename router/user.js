const express = require("express");
const Router  = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('../config/jwt');
const err_type = require("../config/err_code")
const { User } =require("../models");


Router.post("/join",async (req,res)=>{
    const name = req.body.name 
    const email = req.body.email
    const password = req.body.password
    let reg_pwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;

    if(name && email && password){

        const user = await User.findOne({
            where:{email:email}
        })
        if(user) return res.json(err_type.exist_message()) 
        else if(name.length > 10) 
        return res.json({statusCode:"403",message:"닉네임은 10자 까지만 가능합니다."})
        else if(!reg_pwd.test(password))
        return res.json({statusCode:"403",message:"영문과 숫자가 포함되있지 않습니다."})

            bcrypt.genSalt(saltRounds, function(err, salt){
                bcrypt.hash(password, salt, function(err, hash){
                    if(err) return next(err);
                    User.create({
                        name:name,
                        email:email,
                        password:hash
                    })
                    res.json({data:"OK"})
                })
            });
    }else{
        return res.json(err_type.empty_message())
    }
})

Router.post("/login",async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const user_data = await User.findOne({
        where:{email:email}
    })
    if(!user_data) return res.json({statusCode:"403",message:"해당 유저가 존재하지 않습니다."})
        bcrypt.compare(password, user_data.password, async function(err, isMatch){
            if(isMatch){
                const user = await User.findOne({
                    where:{email:email},
                    attributes:['id','name','email','createdAt']
                })
                const token = await jwt.sign({email:user.email});
                res.json({token,user})
            }else{
                return res.json({statusCode:"403",message:"비밀번호가 틀렸습니다."})
            } 
        })
})

module.exports = Router;
