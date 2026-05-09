'use client'

import { useState } from 'react'
import { generateAISuggestion } from '@/app/actions/generateSuggestion'

interface Props {
  contactId: string
}

export default function AISuggestionSection({ contactId }: Props) {
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [urgency, setUrgency] = useState<string>('')
  const [recommendedAction, setRecommendedAction] = useState<string>('')
  const [followUpInDays, setFollowUpInDays] = useState<number | null>(null)
  const [relationshipTemperature, setRelationshipTemperature] = useState<string>('')
  const [error, setError] = useState('')

  async function handleGenerate() {
    setLoading(true)
    setError('')
    setSuggestion('')
    setUrgency('')
    setRecommendedAction('')
    setFollowUpInDays(null)
    setRelationshipTemperature('')

    try {
      const result = await generateAISuggestion(contactId)

      if (result.error) {
        setError(result.error)
      } else if (result.suggestion) {
        setSuggestion(result.suggestion)
        setUrgency(result.urgency || '')
        setRecommendedAction(result.recommendedAction || '')
        setFollowUpInDays(result.followUpInDays || null)
        setRelationshipTemperature(result.relationshipTemperature || '')
      } else {
        setError('پاسخ نامعتبر از سرور دریافت شد')
      }
    } catch (err) {
      console.error(err)
      setError('خطای غیرمنتظره رخ داد')
    } finally {
      setLoading(false)
    }
  }

  const urgencyColors = {
    HIGH: 'bg-red-100 text-red-800 border-red-200',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    LOW: 'bg-green-100 text-green-800 border-green-200',
  }

  const temperatureColors = {
    HOT: 'bg-red-100 text-red-800 border-red-200',
    WARM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    COLD: 'bg-blue-100 text-blue-800 border-blue-200',
  }

  const actionLabels: Record<string, string> = {
    CALL: 'تماس تلفنی',
    EMAIL: 'ایمیل',
    MEETING: 'جلسه',
    MESSAGE: 'پیام',
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            پیشنهاد هوشمند AI
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            پیشنهاد حرفه‌ای برای ادامه ارتباط با مخاطب
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg transition-colors"
        >
          {loading ? 'در حال تولید...' : 'Generate Suggestion'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {!suggestion && !loading && !error && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500">
            هنوز پیشنهادی تولید نشده است
          </p>
        </div>
      )}

      {suggestion && (
        <div className="space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-gray-800 leading-8 text-right">
              {suggestion}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urgency && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="text-sm text-gray-500 mb-2">
                  سطح فوریت
                </div>

                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${
                    urgencyColors[
                      urgency as keyof typeof urgencyColors
                    ] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {urgency}
                </span>
              </div>
            )}

            {recommendedAction && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="text-sm text-gray-500 mb-2">
                  اقدام پیشنهادی
                </div>

                <div className="font-medium text-gray-800">
                  {actionLabels[recommendedAction] || recommendedAction}
                </div>
              </div>
            )}

            {followUpInDays !== null && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="text-sm text-gray-500 mb-2">
                  زمان پیگیری
                </div>

                <div className="font-medium text-gray-800">
                  {followUpInDays} روز دیگر
                </div>
              </div>
            )}

            {relationshipTemperature && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="text-sm text-gray-500 mb-2">
                  وضعیت رابطه
                </div>

                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${
                    temperatureColors[
                      relationshipTemperature as keyof typeof temperatureColors
                    ] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {relationshipTemperature}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
