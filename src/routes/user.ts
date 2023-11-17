import { Router } from 'express'
import { getCurrentUser } from '../controllers/user'
import upload from '../middleware/multerMiddleware'
import { uploadImage } from '../controllers/upload'

const router = Router()

router.get('/current-user', getCurrentUser)
router.post('/upload', upload.single('image'), uploadImage)

export default router
