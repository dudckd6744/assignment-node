const express = require("express");
const Router  = express.Router();

const auth = require("../middleware/auth")
const err_type = require("../config/err_code")
const { Board, User,Like } =require("../models");

Router.post("/",auth.parsing, async (req,res)=>{
    const user = req.user
    const title = req.body.title 
    const content = req.body.content 
    const like = parseInt(req.body.like)
        if(title && content){
            if(title.length > 30) return res.json({statusCode:"403", message:"제목은 30자까지 입력 가능합니다."})
            const board = await Board.create({
                userId:user.id,
                title:title,
                content:content,
                like:like,
            })
            const users = await Board.findOne({
                where:{id:board.id},
                include: [{
                    model:User,
                    attributes:['name']
                }],
                attributes:['id', 'userId', 'title', 'content', 'like', 'createdAt'],
            }) 
            res.json(users)
        }else{
            return res.json(err_type.empty_message())
        } 
}) 

Router.get("/",auth.parsing, async (req,res)=>{
    const boards = await Board.findAll({
        include: [{
            model:User,
            attributes:['name'],
        }],
        attributes:['id', 'userId', 'title', 'content', 'like', 'createdAt']
    });
    res.json(boards) 
}) 

Router.get("/:id",auth.parsing, async (req,res)=>{
    const user = req.user
    const board_id = req.params.id

    const boards = await Board.findOne({
        where:{id:board_id},
        include: [{
            model:User,
            attributes:['name'],
        }],
        attributes:['id', 'userId', 'title', 'content', 'like', 'createdAt']
    });
    if(user){
        const liked = await Like.findOne({
            where:{userId:user.id ,boardId:boards.id}
        })
        if(liked){
            boards.islike = true
            return res.json(boards);
        }
        boards.islike = false
        return res.json(boards) 
    }
    boards.islike = false
    return res.json(boards) 
}) 

Router.delete("/:id",auth.parsing, async (req,res)=>{
    const user = req.user
    const board_id = req.params.id
    try {
        const my_board = await Board.findOne({
            where:{id:board_id}
        })
        if(my_board.userId != user.id){
            return res.json({statusCode:"401",message:"해당 게시글의 작성자가 아닙니다."})
        }else{
            const board_delete = await Board.destroy({
                where:{id:board_id, userId:user.id}
            })
            if(board_delete == 0) {
                return res.json({statusCode:"404",message:"해당 게시글이 존재하지않습니다."})
            }else{
                res.json({data:"OK"}) 
            } 
        }
    } catch{
        return res.json({statusCode:"404",message:"해당 게시글이 존재하지않습니다."})
    }
})

Router.post("/:id/like",auth.parsing, async (req,res)=>{
    const user = req.user
    const board_id = req.params.id
    if(user){
        const like_boards = await Board.findOne({ 
            where:{id:board_id},
            include: [{
                model:User,
                attributes:['name'],
            }],
            attributes:['id', 'userId', 'title', 'content', 'like', 'createdAt']
        })
            const liked = await Like.findOne({
                where:{userId:user.id ,boardId:like_boards.id}
            })
            if(liked){ 
                like_boards.islike = true
                return res.json(like_boards);
            }else{
                Like.create({
                    userId:user.id,
                    boardId:board_id
                })
                ;(await like_boards).increment('like',{by:1})
                like_boards.islike = true
                return res.json(like_boards);
            }
    }else{
        const empty_user = await Board.findOne({ 
            where:{id:board_id},
            include: [{
                model:User,
                attributes:['name'],
            }],
            attributes:['id', 'userId', 'title', 'content', 'like', 'createdAt']
        })
        empty_user.islike = false
        return res.json(empty_user)
    }
}) 
module.exports = Router;
