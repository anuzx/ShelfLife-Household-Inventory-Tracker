import type { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { Item } from "../models/item.model"
import { ItemsSchema } from "../validator/schema"
import { ApiError } from "../utils/ApiError"
import { ApiRes } from "../utils/ApiResponse"
import { User } from "../models/user.model"


export const listHouseholdItems = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId
  const { status, category } = req.query

  const user = await User.findById(userId)

  if (!user || !user.householdId) {
    throw new ApiError(403, "user is not part of this household")
  }
  const filter: Record<string, unknown> = { householdId: user.householdId }
  if (status) filter.status = status
  if (category) filter.category = category

  const householdItems = await Item.find(filter)

  return res.status(200).json(new ApiRes(200, "item fetched", householdItems))
})

export const createNewItem = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = ItemsSchema.safeParse(req.body)

  if (!parsedData.success) {
    throw new ApiError(400, "invalid input")
  }

  const { name, category, quantity, expiryDate, status } = parsedData.data

  const user = await User.findById(req.userId)

  if (!user || !user.householdId) {
    throw new ApiError(403, "user is not part of any household")
  }

  const item = await Item.create({
    name,
    householdId: user.householdId,
    addedBy: req.userId,
    category,
    quantity,
    expiryDate,
    status: status ?? "fresh"
  })


  return res.status(201).json(new ApiRes(201, "item created", item))

})

export const markStatus = asyncHandler(async (req: Request, res: Response) => {
  const itemId = req.params.id
  const creatorId = req.userId
  const status = req.body.status

  const validStatuses = ["fresh", "expiring-soon", "expired", "used", "wasted"]

  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, "invalid status value")
  }

  const item = await Item.findById(itemId)

  if (!item) {
    throw new ApiError(400, "invalid item id")
  }

  if (item.addedBy?.toString() !== creatorId?.toString()) {
    throw new ApiError(403, "access denied")
  }

  await Item.updateOne({ _id: itemId }, { $set: { status } }, { runValidators: true })

  return res.status(200).json(new ApiRes(200, "status updated", {}))
})

export const updateItemDetails = asyncHandler(async (req: Request, res: Response) => {
  const itemId = req.params.id
  const parsedData = ItemsSchema.safeParse(req.body)
  const creatorId = req.userId

  if (!parsedData.success) {
    throw new ApiError(400, "invalid input")
  }

  const { name, category, quantity, expiryDate, status } = parsedData.data

  const item = await Item.findById(itemId)

  if (!item) {
    throw new ApiError(400, "invalid item id")
  }

  if (item.addedBy?.toString() !== creatorId?.toString()) {
    throw new ApiError(403, "access denied")
  }

  const updatedItem = await Item.findByIdAndUpdate(itemId,
    {
      name,
      category,
      quantity,
      expiryDate,
      status
    },
    { new: true }
  )

  return res.status(200).json(new ApiRes(200, "item updated", updatedItem))
})

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const itemId = req.params.id
  const creatorId = req.userId

  const item = await Item.findById(itemId)

  if (!item) {
    throw new ApiError(400, "invalid item id")
  }

  if (item.addedBy?.toString() !== creatorId?.toString()) {
    throw new ApiError(403, "access denied")
  }

  await Item.findByIdAndDelete(itemId)

  return res.status(200).json(new ApiRes(200, "item deleted", {}))
})
