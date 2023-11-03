import { Router } from 'express'
import {
  getAllCategories,
  getAllProducts,
  getProductByCategory,
  getSingleProduct,
} from '../controllers/products'
import { validateProduct } from '../middleware/validationMiddleware'

const router = Router()

router
  .get('/all-product?:query', getAllProducts)
  .get('/product/:id', validateProduct, getSingleProduct)
  .get('/product?:category', getProductByCategory)
  .get('/categories', getAllCategories)

export default router
