const exp=require('express')
const expressAsyncHandler=require('express-async-handler')
const userLogin=require('../apis/auth')
const auth=exp.Router()

auth.post('/',expressAsyncHandler(userLogin))

module.exports=auth