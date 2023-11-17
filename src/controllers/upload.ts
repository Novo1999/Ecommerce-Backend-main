import { Request, Response } from 'express'
import { promises as fs } from 'fs'
import { v2 as cloudinary } from 'cloudinary'
import { StatusCodes } from 'http-status-codes'

export const uploadImage = async (req: Request, res: Response) => {
  if (req.file) {
    const response = await cloudinary.uploader.upload(req.file.path)
    await fs.unlink(req.file.path)
  }
  res.status(StatusCodes.OK).json({ msg: 'updated' })
}
