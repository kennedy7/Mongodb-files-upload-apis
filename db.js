const mongoose = require ('mongoose');
const mongoURI= 'mongodb://localhost:27017/filesUpload'
const Grid = require ('gridfs-stream');


module.exports = function(){
    const conn = mongoose.createConnection(mongoURI, ()=>{
        console.log('database successfully connected')
    })
    //init gfs
    let gfs, gridfsBucket;
    conn.once('open', ()=>{

        gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });
    //create stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads')


    module.exports = {gfs, gridfsBucket};
})


}

