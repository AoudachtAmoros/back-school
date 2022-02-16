const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin')
const adminMiddleware = require('../middleware/auth')


router.post('/login', (req, res, next) => {
    adminController.login(req,res)
});
router.post('/register', (req, res, next) => {
    adminController.register(req,res)
});
router.get('/me', (req, res, next) => {
    adminController.getUser(req,res)
});

// adminMiddleware.authorization(req, res, next),
module.exports = router;