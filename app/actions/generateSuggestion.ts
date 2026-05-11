'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface GenerateSuggestionResult {
  suggestion?: string
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH'
  recommendedAction?: 'CALL' | 'EMAIL' | 'MEETING' | 'MESSAGE'
  followUpInDays?: number
  relationshipTemperature?: 'COLD' | 'WARM' | 'HOT'
  error?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPrompt(contact: any): string {
  const parts = [
    `نام مخاطب: ${contact.name}`,
    `نوع رابطه: ${contact.relationshipType}`,
    contact.company ? `شرکت: ${contact.company}` : '',
    contact.title ? `سمت: ${contact.title}` : '',
    contact.email ? `ایمیل: ${contact.email}` : '',
    contact.phone ? `تلفن: ${contact.phone}` : '',
    contact.importance ? `اهمیت: ${contact.importance}` : '',
    contact.lastContactAt
      ? `آخرین تماس: ${new Date(contact.lastContactAt).toLocaleDateString(
          'fa-IR'
        )}`
      : '',
    contact.nextFollowUpAt
      ? `پیگیری بعدی: ${new Date(
          contact.nextFollowUpAt
        ).toLocaleDateString('fa-IR')}`
      : '',
    contact.notes ? `یادداشت‌ها: ${contact.notes}` : '',
  ]

  if (contact.interactions?.length > 0) {
    parts.push('\nتعاملات اخیر:')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contact.interactions.forEach((interaction: any) => {
      parts.push(
        `- ${interaction.type}: ${
          interaction.summary || 'بدون توضیح'
        } (${new Date(interaction.happenedAt).toLocaleDateString('fa-IR')})`
      )
    })
  }

  return parts.filter(Boolean).join('\n')
}

export async function generateAISuggestion(
  contactId: string
): Promise<GenerateSuggestionResult> {
  try {
    const contact = await prisma.contact.findUnique({
      where: {
        id: contactId,
      },
      include: {
        interactions: {
          orderBy: {
            happenedAt: 'desc',
          },
          take: 5,
        },
      },
    })

    if (!contact) {
      return {
        error: 'مخاطب پیدا نشد',
      }
    }

    // تنظیمات API
    const apiKeySetting = await prisma.appSetting.findUnique({
      where: {
        key: 'apiKey',
      },
    })

    const baseUrlSetting = await prisma.appSetting.findUnique({
      where: {
        key: 'baseUrl',
      },
    })

    const modelSetting = await prisma.appSetting.findUnique({
      where: {
        key: 'modelName',
      },
    })

    if (!apiKeySetting?.value) {
      return {
        error: 'API Key تنظیم نشده است',
      }
    }

    const apiKey = apiKeySetting.value
    const baseUrl =
      baseUrlSetting?.value || 'https://api.gapgpt.app/v1'
    const modelName = modelSetting?.value || 'gpt-4o-mini'

    const systemPrompt = `
شما یک دستیار حرفه‌ای CRM هستید.

بر اساس اطلاعات مخاطب، یک پیشنهاد کوتاه و کاربردی برای ادامه ارتباط ارائه بده.

پاسخ باید فقط JSON معتبر باشد.

فرمت خروجی:

{
  "suggestion": "متن فارسی کوتاه حداکثر 3 جمله",
  "urgency": "LOW | MEDIUM | HIGH",
  "recommendedAction": "CALL | EMAIL | MEETING | MESSAGE",
  "followUpInDays": عدد بین 1 تا 90,
  "relationshipTemperature": "COLD | WARM | HOT"
}

قوانین:
- فقط JSON برگردان
- markdown ننویس
- توضیح اضافه ننویس
- suggestion فارسی باشد
- متن کوتاه و حرفه‌ای باشد
`

    const userPrompt = buildPrompt(contact)

    const response = await fetch(
      `${baseUrl}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          response_format: {
            type: 'json_object',
          },
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          temperature: 0.7,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()

      console.error('AI API Error:', errorText)

      return {
        error: 'خطا در ارتباط با AI',
      }
    }

    const data = await response.json()

    const content = data?.choices?.[0]?.message?.content

    if (!content) {
      return {
        error: 'پاسخی از AI دریافت نشد',
      }
    }

    let parsed: {
      suggestion: string
      urgency: 'LOW' | 'MEDIUM' | 'HIGH'
      recommendedAction: 'CALL' | 'EMAIL' | 'MEETING' | 'MESSAGE'
      followUpInDays: number
      relationshipTemperature: 'COLD' | 'WARM' | 'HOT'
    }

    try {
      parsed = JSON.parse(content)
    } catch (error) {
      console.error('JSON Parse Error:', error)

      return {
        error: 'پاسخ AI معتبر نیست',
      }
    }

    if (
      !parsed.suggestion ||
      !parsed.urgency ||
      !parsed.recommendedAction ||
      parsed.followUpInDays === undefined ||
      !parsed.relationshipTemperature
    ) {
      return {
        error: 'داده‌های AI ناقص هستند',
      }
    }

    // ذخیره در دیتابیس مطابق schema
    await prisma.aIMessage.create({
      data: {
        contactId: contact.id,
        type: 'FOLLOW_UP',
        content: JSON.stringify({
          suggestion: parsed.suggestion,
          urgency: parsed.urgency,
          recommendedAction: parsed.recommendedAction,
          followUpInDays: parsed.followUpInDays,
          relationshipTemperature:
            parsed.relationshipTemperature,
        }),
      },
    })

    revalidatePath(`/contacts/${contact.id}`)

    return {
      suggestion: parsed.suggestion,
      urgency: parsed.urgency,
      recommendedAction: parsed.recommendedAction,
      followUpInDays: parsed.followUpInDays,
      relationshipTemperature:
        parsed.relationshipTemperature,
    }
  } catch (error) {
    console.error('Generate Suggestion Error:', error)

    return {
      error: 'خطای داخلی سرور',
    }
  }
}
