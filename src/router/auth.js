const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin')
const adminMiddleware = require('../middleware/auth')

router.get('/test', (req, res, next) => {
    console.log('test');
});
router.post('/login', (req, res, next) => {
    console.log('/login');

    adminController.login(req,res)
});
router.post('/register', (req, res, next) => {
    console.log('/register');

    adminController.register(req,res)
});
router.get('/me', (req, res, next) => {
    console.log('/me');
    
    adminController.getUser(req,res)
});

// adminMiddleware.authorization(req, res, next),
module.exports = router;