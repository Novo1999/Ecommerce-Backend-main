import { Request, Response } from 'express'
import Cart from '../model/Cart'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError } from '../errors/customErrors'

export interface CartRequest extends Request {
  user?: string
}

export const doCartOperation = async (req: CartRequest, res: Response) => {
  const { productId, quantity, name, price, link } = req.body

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
        productItem.price += Number((quantity * price).toFixed(2))
        cart.products[itemIndex] = productItem
      } else {
        // else push the product
        cart.products.push({ productId, quantity, name, price, link })
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
        products: [{ productId, quantity, name, price, link }],
      })
      return res.status(StatusCodes.CREATED).send(newCart)
    }
  } catch (error) {
    console.log(error)
    throw new BadRequestError(error)
  }
}

export const getUserCart = async (req: CartRequest, res: Response) => {
  const { userId }: any = req.user
  const cart = await Cart.find({ userId })
  res.status(StatusCodes.OK).json(cart)
}

export const clearCart = async (req: CartRequest, res: Response) => {
  const { userId }: any = req.user
  const cart = await Cart.findOneAndDelete({ userId })
  if (cart) {
    return res.status(StatusCodes.OK).json({ msg: 'Cart Cleared' })
  } else {
    return res.status(StatusCodes.OK).json({ msg: 'No item' })
  }
}
