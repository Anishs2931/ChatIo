const exp=require('express')
const userApp=exp.Router()
const expressAsyncHandler=require('express-async-handler')
const findUser=require('../apis/user')

userApp.post('/find',expressAsyncHandler(findUser))

module.exports=userApp 