const express = require('express');
const apiController = require('../../controllers/AuthController/api.c')
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(path.dirname(__dirname)), 'public/image'))
    },
    filename: function (req, file, cb) {
        const regex = /(?:\.([^.]+))?$/;
        const extension = regex.exec(file.originalname)[1];
        cb(null, "temp." + extension)
    }
})

const upload = multer({ storage: storage })

router.get('/user/username', apiController.GetAllUsername);
router.post('/user/update', upload.single('image'), async (req, res, next) => {
    if (req.file) {
        const id = req.body.id;
        const regex = /(?:\.([^.]+))?$/;
        const extension = regex.exec(req.file.originalname)[1];
        let newPath = path.join(req.file.destination, `${id}.${extension}`)
        let oldPath = req.file.path;
        fs.rename(oldPath, newPath, (err) => {
            if (err) return next(err);
        });
    }
    next();
}, apiController.UpdateUser);
router.post('/oauthconfig/update', apiController.UpdateOauthConfig);
router.post('/test', (req,res,next) => {
    res.end('hello')
});


module.exports = router;