const router = require ('express').Router();
const { storage, GetAllFiles, GetSingleFile, GetImage, indexpage} = require ('./controller')
const multer = require ('multer');
const upload = multer({storage})
const Grid = require ('gridfs-stream');


router.get('/', indexpage)

router.post('/upload',  upload.single('file'), (req, res)=>{
    res.redirect('/')
})

router.get('/files', GetAllFiles)

router.get('/file/:filename', GetSingleFile)
router.get('/image/:filename', GetImage)
// router.delete('/files/:id', DeleteFile)


module.exports = router;