const express = require("express");
const router = express.Router();
const logger = require("../model/idp")

let loggerModel = undefined;

router.post('/login', function(req, res, next) {
    const login = req.body.login
    const password = req.body.password
    if (login && password){
        loggerModel
            .login(login, password)
            .then((token) => {
                res
                    .status(200)
                    .json({message: 'OK', access_token: token})
            })
            .catch(() => {
                res
                    .status(401)
                    .json({message: 'Unauthorized'})
            }) 
    } else {
        res
            .status(401)
            .json({message: 'Unauthorized'})
    }
})

router.get('/verifyaccess', function(req, res, next) {
    let token = req.header('Authorization')
    if(token){
        token = token.replace('bearer ', '')
        loggerModel
            .verifyaccess(token)
            .then((decoded) => {
                res
                    .status(200)
                    .json({message: 'OK'})
            })
            .catch((exc) => {
                res
                    .status(401)
                    .json({message: 'Unauthorized'})
            })
    } else {
        res
            .status(401)
            .json({message: 'Unauthorized'})
    }
})

module.exports = (uModel, lModel) => {
    usersModel = uModel
    loggerModel = lModel
    return router
}