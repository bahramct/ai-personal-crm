'use client'

import { createInteraction } from '@/app/actions/interactions'
import { useState } from 'react'

export default function InteractionForm({ contactId }: { contactId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setMessage(null)

    const result = await createInteraction(formData)

    if (result.success) {
      setMessage({ type: 'success', text: 'Interaction added successfully!' })
      // Reset form
      const form = document.getElementById('interaction-form') as HTMLFormElement
      form?.reset()
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to add interaction' })
    }

    setIsSubmitting(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Interaction</h2>
      
      <form id="interaction-form" action={handleSubmit} className="space-y-4">
        <input type="hidden" name="contactId" value={contactId} />

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            id="type"
            name="type"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select type...</option>
            <option value="CALL">Call</option>
            <option value="EMAIL">Email</option>
            <option value="MEETING">Meeting</option>
            <option value="TEXT">Text</option>
            <option value="SOCIAL">Social</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Summary *
          </label>
          <textarea
            id="summary"
            name="summary"
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What happened in this interaction?"
          />
        </div>

        <div>
          <label htmlFor="happenedAt" className="block text-sm font-medium text-gray-700 mb-1">
            Date & Time *
          </label>
          <input
            type="datetime-local"
            id="happenedAt"
            name="happenedAt"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="nextFollowUpDate" className="block text-sm font-medium text-gray-700 mb-1">
            Next Follow-up Date (Optional)
          </label>
          <input
            type="datetime-local"
            id="nextFollowUpDate"
            name="nextFollowUpDate"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 py-2 rounded-md text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150
            ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
        >
          {isSubmitting ? 'Adding...' : 'Add Interaction'}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}
