import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { needsFollowUp } from '@/lib/followUp'

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (contacts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Contacts</h1>
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No contacts yet
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contacts</h1>

        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      <Link
                        href={`/contacts/${contact.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        {contact.name}
                      </Link>
                    </h2>

                    {/* Follow-Up Badge */}
                    {needsFollowUp(contact) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
                        Needs Follow-Up
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Type:</span>{' '}
                      {contact.relationshipType}
                    </p>

                    {contact.company && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Company:</span>{' '}
                        {contact.company}
                      </p>
                    )}

                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Importance:</span>{' '}
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          contact.importance === 'high'
                            ? 'bg-red-100 text-red-800'
                            : contact.importance === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {contact.importance}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="ml-4 text-right text-sm text-gray-500">
                  {contact.lastContactAt && (
                    <p>
                      <span className="font-medium">Last contact:</span>
                      <br />
                      {new Date(contact.lastContactAt).toLocaleDateString()}
                    </p>
                  )}

                  {contact.nextFollowUpAt && (
                    <p className="mt-2">
                      <span className="font-medium">Next follow-up:</span>
                      <br />
                      {new Date(contact.nextFollowUpAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
