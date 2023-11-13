import { Schema, model, Types } from 'mongoose'

const CartSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default model('Cart', CartSchema)
