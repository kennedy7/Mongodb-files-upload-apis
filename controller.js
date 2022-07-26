const crypto = require ('crypto');
const path = require ('path')
const mongoURI= 'mongodb://localhost:27017/filesUpload'
const {GridFsStorage} = require ('multer-gridfs-storage');


//create storage engine
 const storage = new GridFsStorage({
    url: mongoURI,
    file:(req, file)=>{
        return new Promise((resolve, reject)=>{
            crypto.randomBytes(16, (err, buf)=>{
                if(err) return reject(err);
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileinfo ={ 
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileinfo)
            })
        })
    } 
})

 const indexpage = (req, res)=>{
    var {gfs} = require('./database')
    gfs.files.find().toArray((err, files)=>{
   if(!files || files.length == 0){
    res.render('index', {files: false})
   }else{
    files.map(file=>{
        if(file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/svg+xml' ){
            file.isImage = true;
         }
         else{
            file.isImage = false;  
         }
         if(file.contentType ==='video/mp4' ){
            file.isVideo = true;
         }
         else{
            file.isVideo = false;  
         }
        })
        res.render('index', {files: files})
    }
 })
 }

 const GetAllFiles =  (req, res)=>{
    const {gfs, gridfsBucket} = require('./database')
    gfs.find().toArray((err, files)=>{
   if(!files || files.length == 0){
    return res.status(404).json({err: 'files not found'})
   }
   return res.json(files);
    })
}

const GetSingleFile =(req, res)=>{
    const {gfs} = require('./database')
    gfs.files.findOne({filename : req.params.filename}, (err, file)=>{
        if(!file || file.length == 0){
            return res.status(404).json({err: 'file not found'})
           }
           return res.json(file);

    })
  
}

//Display image
const GetImage = async (req, res)=>{
    const {gfs, gridfsBucket} = require('./database')
    await gfs.files.findOne({filename : req.params.filename}, (err, file)=>{
        if(!file || file.length == 0){
            return res.status(404).json({
                err: 'file not found'
            })
           }
            if(file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/svg+xml' || file.contentType ==='video/mp4' ){
            //display output to browser 
            gridfsBucket.openDownloadStreamByName(req.params.filename).pipe(res)
         }
         else{
            res.status(404).send({
            err: 'Not an Image'
        })
    }

    })
  
}

const DeleteFile =  (req, res)=>{
    const {gridfsBucket, gfs} = require('./database')
   gfs.remove({_id:req.params.id,  root: 'uploads'}, (err, gridStore)=>{
        if(err){
          return res.status(404).json({err:err})
        }
        else{
        res.redirect('/')
        }
        
    })
}

module.exports = { storage, GetAllFiles, GetSingleFile, GetImage, indexpage , DeleteFile}







