import { Router } from 'express'
import { doCartOperation } from '../controllers/cart'

const router = Router()

router.post('/', doCartOperation)

export default router
