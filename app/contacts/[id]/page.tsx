import { prisma } from '@/lib/prisma';
import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { notFound } from 'next/navigation';
import InteractionForm from './InteractionForm'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import AISuggestionSection from './AISuggestionSection'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { needsFollowUp } from '@/lib/followUp'


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContactDetailPage({ params }: PageProps) {
  const { id } = await params;

  const contact = await prisma.contact.findUnique({
  where: { id: id },
  include: {
    interactions: {
      orderBy: {
        createdAt: 'desc',
      },
    },
    aiMessages: {
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    },
  },
});

  if (!contact) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600">Contact not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/contacts"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← بازگشت به لیست مخاطبین
        </Link>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {contact.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <span className="font-semibold">نوع رابطه:</span>{' '}
              {contact.relationshipType}
            </div>

            {contact.company && (
              <div>
                <span className="font-semibold">شرکت:</span> {contact.company}
              </div>
            )}

            <div>
              <span className="font-semibold">اهمیت:</span> {contact.importance}
            </div>

            {contact.lastContactAt && (
              <div>
                <span className="font-semibold">آخرین تماس:</span>{' '}
                {new Date(contact.lastContactAt).toLocaleDateString('fa-IR')}
              </div>
            )}

            {contact.nextFollowUpAt && (
              <div>
                <span className="font-semibold">پیگیری بعدی:</span>{' '}
                {new Date(contact.nextFollowUpAt).toLocaleDateString('fa-IR')}
              </div>
            )}
          </div>

          {contact.notes && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="font-semibold text-gray-700">یادداشت‌ها:</span>
              <p className="text-gray-600 mt-2">{contact.notes}</p>
            </div>
          )}
        </div>
        {(needsFollowUp(contact) || contact.importance === 'HIGH') && (
  <AISuggestionSection contactId={contact.id} />
)}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">تعاملات</h2>
          <InteractionForm contactId={contact.id} />
          {contact.interactions.length === 0 ? (
            <p className="text-gray-500">هنوز تعاملی ثبت نشده است.</p>
          ) : (
            <div className="space-y-4">
              {contact.interactions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="border-r-4 border-blue-500 pr-4 py-2"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                      {interaction.type}
                    </span>

                    <span className="text-sm text-gray-500">
                      {new Date(interaction.createdAt).toLocaleDateString(
                        'fa-IR'
                      )}
                    </span>
                  </div>

                  <p className="text-gray-700">{interaction.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
