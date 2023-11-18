import { Router } from 'express'
import { editUser, getCurrentUser } from '../controllers/user'
import upload from '../middleware/multerMiddleware'
import { uploadImage } from '../controllers/upload'
import { validateRegisterUser } from '../middleware/validationMiddleware'

const router = Router()

router.get('/current-user', getCurrentUser)
router.post('/upload', upload.single('image'), uploadImage)
router.patch('/user/edit', validateRegisterUser, editUser)

export default router
