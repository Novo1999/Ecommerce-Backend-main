import { Router } from 'express'
import { getCurrentUser } from '../controllers/user'

const router = Router()

router.get('/current-user', getCurrentUser)

export default router
