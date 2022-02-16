const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/auth')
const parentController = require('../controller/parent')

router.use('/',function (req, res, next) {
    adminMiddleware.authorization(req, res, next)
})

/* GET home page. */
router.get('/midd', (req, res, next) => {
    console.log('/admin---after--midd');
});
router.get('/', (req, res, next) => {
    parentController.getParents(req, res, next)
});
router.get('/get-parent/:parentID', (req, res, next) => {
     parentController.getParent(req, res, next)
});
router.post('/add-parent', (req, res, next) => {
     parentController.addParent(req, res, next)
});
router.delete('/delete-parent/:parentID', (req, res, next) => {
     parentController.deleteParent(req, res, next)
});

module.exports = router;