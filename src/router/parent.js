const express = require('express');
const router = express.Router();
const parentController = require('../controller/parent')



router.post('/parent', (req, res, next) => {
    console.log('/parent');
    parentController.getParent(req, res, next)
});


module.exports = router;