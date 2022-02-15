const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin')
const adminMiddleware = require('../middleware/auth')
const parentController = require('../controller/parent')


router.post('/login', (req, res, next) => {
    adminController.login(req,res)
});
router.post('/register', (req, res, next) => {
    adminController.register(req,res)
});
router.get('/me', adminMiddleware.authorization(req, res, next), (req, res, next) => {
    adminController.getUser(req,res)
});


/* GET home page. */
router.get('/',adminMiddleware.authorization(req, res, next), parentController.getParents(req, res, next));
router.get('/get-parent/:parentID',adminMiddleware.authorization(req, res, next), parentController.getParent(req, res, next));
router.post('/add-parent',adminMiddleware.authorization(req, res, next), parentController.addParent(req, res, next));
router.delete('/delete-parent/:parentID',adminMiddleware.authorization(req, res, next), parentController.deleteParent(req, res, next));

module.exports = router;