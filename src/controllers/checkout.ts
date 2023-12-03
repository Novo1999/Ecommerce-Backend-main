import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import Stripe from 'stripe'

const stripe = new Stripe(
  'sk_test_51OICPrK0DJ2x8ORvaj9xWMjvYX5oBBPfw78Hl66NtzDIwo0H2YBwaHlEjFykXAOhziTA6TkE8IgSnZa7CdZ7fIMC009mNA7U9V',
  {
    apiVersion: '2023-10-16',
  }
)

export const checkout = async (req: Request, res: Response) => {
  const { amount, id } = req.body
  console.log(req.body)
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      description: 'Product',
      payment_method: id,
      confirm: true,
      return_url: 'https://gymba.vercel.app/',
    })
    console.log(payment)
    res.json({
      msg: 'Payment Successful',
      success: true,
    })
  } catch (error) {
    console.log(error)
    return res.json({
      msg: 'Payment unsuccessful',
      success: false,
    })
  }
}
