const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/auth')
const parentController = require('../controller/parent')
//const studentController = require('../controller/student')

router.use('/',function (req, res, next) {
    adminMiddleware.authorization(req, res, next)
})

/* GET home page. */
router.get('/midd', (req, res, next) => {
    console.log('/admin---after--midd');
});
router.get('/parents', (req, res, next) => {
    console.log('/parents');

    parentController.getParents(req, res, next)
    //paginations
});
router.get('/parent/:parentID', (req, res, next) => {
    console.log('/parent/id');

     parentController.getParent(req, res, next)
});
router.post('/add-parent', (req, res, next) => {
    console.log('/add-parent');

     parentController.addParent(req, res, next)
});
router.delete('/delete-parent/:parentID', (req, res, next) => {
    console.log('/delete-parent/:parentID');
     parentController.deleteParent(req, res, next)
});

module.exports = router;