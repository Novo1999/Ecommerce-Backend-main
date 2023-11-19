import { Router } from 'express'
import { editUser, getCurrentUser } from '../controllers/user'
import upload from '../middleware/multerMiddleware'
import { validateUpdateUser } from '../middleware/validationMiddleware'

const router = Router()

router.get('/current-user', getCurrentUser)
router.patch(
  '/user/edit',
  upload.single('avatar'),
  validateUpdateUser,
  editUser
)

export default router
