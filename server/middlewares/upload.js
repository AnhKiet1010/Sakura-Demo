const multer = require('multer');
const short = require('short-uuid');

// UPLOAD IMAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        const randomPart = short.generate();
        var filetype = '';
          if (file.mimetype == 'video/gif') {
            filetype = 'gif';
          }
          if (file.mimetype == 'video/mp4') {
            filetype = 'mp4';
          }
          if (file.mimetype == 'video/ogg') {
            filetype = 'ogg';
          }
          if (file.mimetype == 'video/wmv') {
            filetype = 'wmv';
          }
          if (file.mimetype == 'video/x-flv') {
            //filetype = mime.getExtension('video/flv');
            filetype = 'flv';
          }
          if (file.mimetype == 'video/avi') {
            filetype = 'avi';
          }
          if (file.mimetype == 'video/webm') {
            filetype = 'webm';
          }
          if (file.mimetype == 'video/mkv') {
            filetype = 'mkv';
          }
          if (file.mimetype == 'video/avchd') {
            filetype = 'avchd';
          }
          if (file.mimetype == 'video/quicktime') {
            filetype = 'mov';
          }
          if (file.mimetype == 'video/mov') {
            filetype = 'mov';
          } // use whatever random you want.
          if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            filetype = file.mimetype.split('/')[1];
        }
        cb(null, randomPart + `.${filetype}`)
    }
});

var upload = multer({
    storage: storage
});

module.exports =  upload;