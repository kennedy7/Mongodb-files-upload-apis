const router = require ('express').Router();
const { storage, GetAllFiles, GetSingleFile, GetImage } = require ('./controller')
const multer = require ('multer');
const upload = multer({storage})
const Grid = require ('gridfs-stream');

router.get('/', (req, res)=>{
    res.render('index')
})

router.post('/upload',  upload.single('file'), (req, res)=>{
    res.redirect('/')
})

router.get('/files', GetAllFiles)

router.get('/file/:filename', GetSingleFile)
router.get('/image/:filename', GetImage)


module.exports = router;