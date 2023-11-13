import { Request, Response } from 'express'
import Cart from '../model/Cart'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError } from '../errors/customErrors'

interface cartRequest extends Request {
  user?: string
}

export const doCartOperation = async (req: cartRequest, res: Response) => {
  const { productId, quantity, name, price } = req.body

  const { userId }: any = req.user

  try {
    // if cart exists for user
    let cart = await Cart.findOne({ userId })

    if (cart) {
      let itemIndex = cart.products.findIndex((p) => p.productId === productId)
      // update quantity if product exists
      if (itemIndex > -1) {
        let productItem = cart.products[itemIndex]
        if (quantity === 0) productItem.quantity = 0
        productItem.quantity += quantity
        cart.products[itemIndex] = productItem
      } else {
        // else push the product
        cart.products.push({ productId, quantity, name, price })
      }
      cart.products = cart.products.filter(
        (productItem) => productItem.quantity !== 0
      )
      cart = await cart.save()
      return res.status(StatusCodes.OK).send(cart)
    } else {
      // create new cart if cart does not exist
      const newCart = await Cart.create({
        userId,
        products: [{ productId, quantity, name, price }],
      })
      return res.status(StatusCodes.CREATED).send(newCart)
    }
  } catch (error) {
    console.log(error)
    throw new BadRequestError('An error occurred')
  }
}
