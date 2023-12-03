import { Router } from 'express'
import { clearCart, doCartOperation } from '../controllers/cart'

const router = Router()

router.post('/', doCartOperation)
router.post('/clear', clearCart)

export default router
