import { Router } from 'express'
import { loginUser, logoutUser, registerUser } from '../controllers/auth'
import {
  validateLoginUser,
  validateRegisterUser,
} from '../middleware/validationMiddleware'

const router = Router()

router
  .post('/register', validateRegisterUser, registerUser)
  .post('/login', validateLoginUser, loginUser)
  .post('/logout', logoutUser)

export default router
