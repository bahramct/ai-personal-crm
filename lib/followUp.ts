// lib/followUp.ts

import { Contact } from '@prisma/client'

/**
 * تشخیص اینکه آیا یک مخاطب نیاز به پیگیری دارد یا خیر.
 *
 * شرط A: nextFollowUpAt موجود باشد و تاریخ آن امروز یا قبل از امروز باشد.
 * شرط B: importance برابر HIGH باشد و lastContactAt قدیمی‌تر از ۳۰ روز باشد.
 */
export function needsFollowUp(contact: Contact): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // شرط A
  if (contact.nextFollowUpAt) {
    const followUpDate = new Date(contact.nextFollowUpAt)
    followUpDate.setHours(0, 0, 0, 0)
    if (followUpDate <= today) {
      return true
    }
  }

  // شرط B
  if (contact.importance === 'HIGH' && contact.lastContactAt) {
    const lastContact = new Date(contact.lastContactAt)
    const diffInMs = today.getTime() - lastContact.getTime()
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    if (diffInDays >= 30) {
      return true
    }
  }

  return false
}
