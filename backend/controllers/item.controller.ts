import type { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { Item } from "../models/item.model"
import { ItemsSchema } from "../validator/schema"
import { ApiError } from "../utils/ApiError"
import { ApiRes } from "../utils/ApiResponse"
import { User } from "../models/user.model"
import { sendExpiryEmail } from "../queue/producer"


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

  const { name, category, quantity, expiryDate } = parsedData.data

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
  })

  const householdMembers = await User.find({
    householdId: user.householdId
  }).select("email")

  const emails = householdMembers.map(u => u.email)

  const delay = new Date(expiryDate).getTime() - Date.now()

  if (delay <= 0) return; // don't schedule

  if (delay > 0) {
    sendExpiryEmail({
      emails,
      itemName: name,
      expiryDate,
      itemId: item._id.toString()
    }, { delay }).catch(err => console.error("failed to queue email:", err))
  }
  return res.status(201).json(new ApiRes(201, "item created", item))

})

export const markStatus = asyncHandler(async (req: Request, res: Response) => {
  const itemId = req.params.id
  const creatorId = req.userId
  const status = req.body.status

  const validStatuses = ["fresh", "expiringSoon", "expired", "used", "wasted"]

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

  item.status = status
  await item.save()

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


  item.name = name;
  item.category = category;
  item.quantity = quantity;
  item.expiryDate = expiryDate;
  item.status = status;
  await item.save();


  if (expiryDate) {
    const householdMembers = await User.find({
      householdId: item.householdId
    }).select("email")

    const emails = householdMembers.map(u => u.email)

    const delay = new Date(expiryDate).getTime() - Date.now()

    if (delay > 0) {
      sendExpiryEmail({
        emails,
        itemName: name,
        expiryDate,
        itemId: item._id.toString()
      }, { delay }).catch(err => console.error("failed to queue email:", err))
    }
  }
  return res.status(200).json(new ApiRes(200, "item updated", item))
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
