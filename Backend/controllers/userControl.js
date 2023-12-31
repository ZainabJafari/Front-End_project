const router = require('express').Router()
const userModel = require('../models/userModel')

router.post('/register', userModel.createNewUser)
router.post('/login', userModel.loginUser)


module.exports = router;