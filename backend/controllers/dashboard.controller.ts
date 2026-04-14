import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError"
import { ApiRes } from "../utils/ApiResponse"
import type { Request, Response } from "express"
import { User } from "../models/user.model"
import { Item } from "../models/item.model"
import { Household } from "../models/household.model"

// Returns waste score and item counts grouped by status
export const showStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId

  const user = await User.findById(userId)
  if (!user || !user.householdId) {
    throw new ApiError(403, "user is not part of any household")
  }

  const household = await Household.findById(user.householdId)
  if (!household) {
    throw new ApiError(404, "household not found")
  }
  // Count items grouped by status
  const statusCounts = await Item.aggregate([
    { $match: { householdId: user.householdId } },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ])

  // Shape into a flat object: { fresh: N, expiring-soon: N, expired: N, used: N, wasted: N }
  const counts: Record<string, number> = {
    fresh: 0,
    "expiring-soon": 0,
    expired: 0,
    used: 0,
    wasted: 0
  }

  for (const entry of statusCounts) {
    if (entry._id) counts[entry._id] = entry.count
  }

  // Recalculate waste score: (used / (used + wasted)) * 100
  // Higher score = more items used rather than wasted
  const used = counts["used"]
  const wasted = counts["wasted"]
  const total = used + wasted
  const wasteScore = total > 0 ? Math.round((used / total) * 100) : 0

  // Persist updated score on household
  household.wasteScore = wasteScore
  await household.save()

  return res.status(200).json(new ApiRes(200, "dashboard stats", {
    wasteScore,
    counts
  }))
})


// Returns items expiring within the next 24 hours
export const itemExpiring = asyncHandler(async (req: Request, res: Response) => {

  //message should only go to users in this household 

  const userId = req.userId

  const user = await User.findById(userId)

  if (!user || !user.householdId) {
    throw new ApiError(403, "user is not part of any household")
  }

  const now = new Date()
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const expiringItems = await Item.find({
    householdId: user.householdId,
    expiryDate: { $gte: now, $lte: in24Hours },
    status: { $nin: ["used", "wasted"] }
  }).sort({ expiryDate: 1 })

  return res.status(200).json(new ApiRes(200, "list of items expiring in 24 hours", expiringItems))
})
