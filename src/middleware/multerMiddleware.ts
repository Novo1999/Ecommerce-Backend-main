import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../public')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname
    cb(null, fileName)
  },
})

const maxSize = 2 * 1000 * 1024

const upload = multer({
  storage,
  limits: { fileSize: maxSize },
})

export default upload
