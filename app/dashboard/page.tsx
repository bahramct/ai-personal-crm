import { prisma } from '@/lib/prisma';
import { needsFollowUp } from '@/lib/followUp';

export default async function DashboardPage() {
	// واکشی تمام مخاطبین برای محاسبه follow-up
	const contacts = await prisma.contact.findMany();

	// واکشی ۵ تعامل اخیر به همراه نام مخاطب
	const recentInteractions = await prisma.interaction.findMany({
		take: 5,
		orderBy: { createdAt: 'desc' },
		include: {
			contact: {
				select: { name: true },
			},
		},
	});

	// محاسبات
	const followUpCount = contacts.filter((c) => needsFollowUp(c)).length;
	const highPriorityCount = contacts.filter(
		(c) => c.importance === 'HIGH',
	).length;
	const totalContacts = contacts.length;

	const interactionTypeLabels: Record<string, string> = {
		CALL: 'تماس',
		EMAIL: 'ایمیل',
		MEETING: 'جلسه',
		TEXT: 'پیامک',
		SOCIAL: 'شبکه‌های اجتماعی',
		OTHER: 'سایر',
	};

	return (
		<div className='min-h-screen bg-[#05060F] p-8'>
			<div className='max-w-5xl mx-auto'>
				<h1 className='text-3xl font-bold text-white mb-8'>داشبورد</h1>

				{/* Summary Cards */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10'>
					{/* Total Contacts */}
					<SummaryCard
						title='تعداد مخاطبین'
						value={totalContacts}
						color='blue'
					/>

					{/* Follow-Up Needed */}
					<SummaryCard
						title='نیاز به پیگیری'
						value={followUpCount}
						color={followUpCount > 0 ? 'amber' : 'green'}
						subtitle={followUpCount > 0 ? 'نیاز به اقدام' : 'همه در جریان'}
					/>

					{/* High Priority */}
					<SummaryCard
						title='اولویت بالا'
						value={highPriorityCount}
						color='red'
					/>

					{/* AI Insights Placeholder */}
					<div className='rounded-3xl bg-[#111327] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border-l-4 border-purple-400'>
						<p className='text-sm font-medium text-slate-400'>
							دیدگاه‌های هوشمند
						</p>
						<p className='mt-2 text-sm text-purple-300 italic'>به زودی…</p>
					</div>
				</div>

				{/* Recent Interactions */}
				<section>
					<h2 className='text-xl font-semibold text-white mb-4'>
						تعاملات اخیر
					</h2>

					{recentInteractions.length === 0 ? (
						<div className='rounded-3xl bg-[#111327] shadow p-6 text-center text-slate-400'>
							هنوز تعاملی ثبت نشده است
						</div>
					) : (
						<div className='rounded-3xl bg-[#111327] shadow divide-y divide-white/5'>
							{recentInteractions.map((interaction) => (
								<div
									key={interaction.id}
									className='p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
									<div className='flex-1 min-w-0'>
										<p className='text-sm font-medium text-white truncate'>
											{interaction.contact.name}
										</p>
										<p className='text-sm text-slate-300 truncate'>
											{interaction.summary}
										</p>
									</div>
									<div className='mr-4 shrink-0 text-right'>
										<span className='inline-block px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/10 text-cyan-200'>
											{interactionTypeLabels[interaction.type] ||
												interaction.type}
										</span>
										<p className='text-xs text-slate-400 mt-1'>
											{new Date(interaction.createdAt).toLocaleDateString(
												'fa-IR',
											)}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}

// ─── کامپوننت کمکی کارت خلاصه ────────────────────────────────────────────────

type CardColor = 'blue' | 'amber' | 'green' | 'red';

const colorMap: Record<CardColor, string> = {
	blue: 'border-blue-400 text-blue-700',
	amber: 'border-amber-400 text-amber-700',
	green: 'border-green-400 text-green-700',
	red: 'border-red-400 text-red-700',
};

function SummaryCard({
	title,
	value,
	color,
	subtitle,
}: {
	title: string;
	value: number;
	color: CardColor;
	subtitle?: string;
}) {
	return (
		<div
			className={`rounded-3xl bg-[#111327] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border-l-4 ${colorMap[color]}`}>
			<p className='text-sm font-medium text-slate-400'>{title}</p>
			<p className={`mt-1 text-3xl font-bold ${colorMap[color].split(' ')[1]}`}>
				{value}
			</p>
			{subtitle && <p className='mt-1 text-xs text-slate-400'>{subtitle}</p>}
		</div>
	);
}
