/* 
1. Get all products
2. Get a single product
3. Filter by category
4. Sort by price (low - high / high - low) / Alphabetical order (A - Z / Z - A)
5. 
*/

import { Request, Response } from 'express'
import Products from '../model/Products'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/customErrors'

const sortBy = (sort: string) => {
  switch (sort) {
    case 'a-z':
      return { name: 'asc' }
    case 'z-a':
      return { name: 'desc' }
    case 'price[a-z]':
      return { price: 'asc' }
    case 'price[z-a]':
      return { price: 'desc' }
    default:
      return { name: 'asc' }
  }
}

// when page loads
export const getAllProducts = async (req: Request, res: Response) => {
  let { sort, limit, skip } = req.query

  const products = await Products.find({})
    .sort(sortBy(sort as string) as any)
    .limit(Number(limit))
    .skip(Number(skip))

  res.status(StatusCodes.OK).json(products)
}

// when user clicks on a product, he can see that and also 3 related products
export const getSingleProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  const product = await Products.findById(id)

  // First, get a random sample of products excluding the current one
  const randomProducts = await Products.aggregate([
    { $match: { _id: { $ne: id }, category: product?.category } }, // Exclude the current product
    { $sample: { size: 3 } }, // Get a random sample of 3 products
  ])

  let refinedRandomProducts: string | Array<{}> = randomProducts.filter(
    (product) => product._id.toString() !== id
  )
  if (refinedRandomProducts.length === 0)
    refinedRandomProducts = 'No related products'

  res
    .status(StatusCodes.OK)
    .json({ product, relatedProducts: refinedRandomProducts })
}

// user chooses category from dropdown or types in url
export const getProductByCategory = async (req: Request, res: Response) => {
  let { category, sort } = req.query

  // if no sort was provided, just sort by ascending order
  if (!sort) sort = 'asc'

  // match categories with at least one common letter
  const products = await Products.find({
    category: { $regex: `.*${category}`, $options: 'i' },
  }).sort(sortBy(sort as string) as any)

  if (!products.length)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'No product by that category' })

  res.status(StatusCodes.OK).json(products)
}

export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await Products.find({}).distinct('category')
  res.status(StatusCodes.OK).json(categories)
}

export const getProductByName = async (req: Request, res: Response) => {
  const { name } = req.params
  const product = await Products.find({
    name: { $regex: `.*${name}`, $options: 'i' },
  })
  console.log(name)
  res.status(StatusCodes.OK).json(product)
}
