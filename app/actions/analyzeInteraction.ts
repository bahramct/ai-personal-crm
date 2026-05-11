'use server'

import { prisma } from '@/lib/prisma'

type InteractionIntelligence = {
  sentiment: 'positive' | 'neutral' | 'concerned' | 'negative'
  interaction_type: 'meeting' | 'call' | 'message' | 'email' | 'event' | 'other'
  topics: string[]
  relationship_signal: 'strengthening' | 'stable' | 'slight_tension' | 'tension'
  follow_up_needed: boolean
  suggested_follow_up_days: number
}

export async function analyzeInteraction(
  contactName: string,
  interactionNote: string
): Promise<InteractionIntelligence | null> {
  try {
    // دریافت تنظیمات AI از دیتابیس
    const appSetting = await prisma.appSetting.findFirst()
    
    if (!appSetting?.apiKey) {
      console.error('API key not configured')
      return null
    }

    const systemPrompt = `You are an AI assistant analyzing relationship interactions in a Personal CRM system.

Your task: analyze the interaction note and extract structured intelligence.

Output format: JSON only, no markdown, no explanations.

Required fields:
- sentiment: "positive" | "neutral" | "concerned" | "negative"
- interaction_type: "meeting" | "call" | "message" | "email" | "event" | "other"
- topics: array of main discussion topics
- relationship_signal: "strengthening" | "stable" | "slight_tension" | "tension"
- follow_up_needed: boolean
- suggested_follow_up_days: number (1-30)

Rules:
1. Extract topics intelligently
2. Detect emotional tone carefully
3. If concern/tension detected, follow_up_needed should likely be true
4. suggested_follow_up_days should be reasonable (1-30 days)
5. Return only valid JSON`

    const userPrompt = `Contact: ${contactName}
Interaction note: ${interactionNote}

Analyze and return JSON.`

    const response = await fetch(
      `${appSetting.baseUrl || 'https://api.gapgpt.app/v1'}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${appSetting.apiKey}`,
        },
        body: JSON.stringify({
          model: appSetting.modelName || 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
        }),
      }
    )

    if (!response.ok) {
      console.error('AI API error:', response.status, response.statusText)
      return null
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error('No content in AI response')
      return null
    }

    // پاک‌سازی خروجی (حذف markdown اگر وجود داشت)
    const cleanContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '').trim()

    const intelligence: InteractionIntelligence = JSON.parse(cleanContent)

    // اعتبارسنجی
    if (
      !intelligence.sentiment ||
      !intelligence.interaction_type ||
      !Array.isArray(intelligence.topics) ||
      !intelligence.relationship_signal ||
      typeof intelligence.follow_up_needed !== 'boolean' ||
      typeof intelligence.suggested_follow_up_days !== 'number'
    ) {
      console.error('Invalid intelligence structure:', intelligence)
      return null
    }

    return intelligence
  } catch (error) {
    console.error('Error analyzing interaction:', error)
    return null
  }
}
