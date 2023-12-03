import { Router } from 'express'
import { checkout } from '../controllers/checkout'
const router = Router()

router.post('/', checkout)

export default router
