import multer from 'multer'
import DataParser from 'datauri/parser.js'
import path from 'path'

const storage = multer.memoryStorage()

const maxSize = 3 * 1000 * 1024

const upload = multer({
  storage,
  limits: { fileSize: maxSize },
})

const parser = new DataParser()

export const formatImage = (file: Express.Multer.File) => {
  const fileExtension = path.extname(file.originalname).toString()
  return parser.format(fileExtension, file.buffer).content
}

export default upload
