import { prisma } from '@/lib/prisma'
import { needsFollowUp } from '@/lib/followUp'

export default async function DashboardPage() {
  // واکشی تمام مخاطبین برای محاسبه follow-up
  const contacts = await prisma.contact.findMany()

  // واکشی ۵ تعامل اخیر به همراه نام مخاطب
  const recentInteractions = await prisma.interaction.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      contact: {
        select: { name: true },
      },
    },
  })

  // محاسبات
  const followUpCount = contacts.filter((c) => needsFollowUp(c)).length
  const highPriorityCount = contacts.filter((c) => c.importance === 'HIGH').length
  const totalContacts = contacts.length

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Total Contacts */}
          <SummaryCard
            title="Total Contacts"
            value={totalContacts}
            color="blue"
          />

          {/* Follow-Up Needed */}
          <SummaryCard
            title="Need Follow-Up"
            value={followUpCount}
            color={followUpCount > 0 ? 'amber' : 'green'}
            subtitle={followUpCount > 0 ? 'Action required' : 'All caught up'}
          />

          {/* High Priority */}
          <SummaryCard
            title="High Priority"
            value={highPriorityCount}
            color="red"
          />

          {/* AI Insights Placeholder */}
          <div className="bg-white rounded-lg shadow p-5 border-l-4 border-purple-400">
            <p className="text-sm font-medium text-gray-500">AI Insights</p>
            <p className="mt-2 text-sm text-purple-600 italic">
              Coming soon…
            </p>
          </div>
        </div>

        {/* Recent Interactions */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Interactions
          </h2>

          {recentInteractions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No interactions yet
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
              {recentInteractions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {interaction.contact.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {interaction.summary}
                    </p>
                  </div>
                  <div className="ml-4 shrink-0 text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                      {interaction.type}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(interaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

// ─── کامپوننت کمکی کارت خلاصه ────────────────────────────────────────────────

type CardColor = 'blue' | 'amber' | 'green' | 'red'

const colorMap: Record<CardColor, string> = {
  blue: 'border-blue-400 text-blue-700',
  amber: 'border-amber-400 text-amber-700',
  green: 'border-green-400 text-green-700',
  red: 'border-red-400 text-red-700',
}

function SummaryCard({
  title,
  value,
  color,
  subtitle,
}: {
  title: string
  value: number
  color: CardColor
  subtitle?: string
}) {
  return (
    <div className={`bg-white rounded-lg shadow p-5 border-l-4 ${colorMap[color]}`}>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`mt-1 text-3xl font-bold ${colorMap[color].split(' ')[1]}`}>
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
      )}
    </div>
  )
}
