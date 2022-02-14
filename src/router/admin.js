const express = require('express');
const router = express.Router();
const adminC = require('../controller/admin')

router.post('/login', (req, res, next) => {
    adminC.login(req,res)
});
router.post('/register', (req, res, next) => {
    adminC.register(req,res)
});
router.get('/me', (req, res, next) => {
    adminC.getUser(req,res)
});

module.exports = router;