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

 const GetAllFiles =  (req, res)=>{
    const {gfs} = require('./db')
    gfs.files.find().toArray((err, files)=>{
   if(!files || files.length == 0){
    return res.status(404).json({err: 'files not found'})
   }
   return res.json(files);
    })
}

const GetSingleFile =(req, res)=>{
    const {gfs} = require('./db')
    gfs.files.findOne({filename : req.params.filename}, (err, file)=>{
        if(!file || file.length == 0){
            return res.status(404).json({err: 'file not found'})
           }
           return res.json(file);

    })
  
}

//Display image
const GetImage = async (req, res)=>{
    const {gfs, gridfsBucket} = require('./db')
    await gfs.files.findOne({filename : req.params.filename}, (err, file)=>{
        if(!file || file.length == 0){
            return res.status(404).json({
                err: 'file not found'
            })
           }
         if(file.contentType === 'image/jpeg' || file.contentType === 'image/png' ){
            //display output to browser 
            const readStream = gridfsBucket.openDownloadStreamByName(file.filename, {files})
            readStream.pipe(res)
         }
         return res.status(404).send({
            err: 'Not an Image'
        })

    })
  
}

module.exports = { storage, GetAllFiles, GetSingleFile, GetImage }







