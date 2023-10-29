import { Router } from 'express'
import {
  getAllProducts,
  getProductByCategory,
  getSingleProduct,
} from '../controllers/products'
import { validateProduct } from '../middleware/validationMiddleware'

const router = Router()

router
  .get('/all-product?:sort', getAllProducts)
  .get('/product/:id', validateProduct, getSingleProduct)
  .get('/product?:category', getProductByCategory)

export default router
