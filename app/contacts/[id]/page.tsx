import { prisma } from '@/lib/prisma';
import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { notFound } from 'next/navigation';
import InteractionForm from './InteractionForm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import AISuggestionSection from './AISuggestionSection';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { needsFollowUp } from '@/lib/followUp';

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
			<div className='min-h-screen bg-[#05060F] p-8'>
				<div className='max-w-4xl mx-auto'>
					<p className='text-slate-300'>مخاطب موردنظر یافت نشد.</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-[#05060F] p-8'>
			<div className='max-w-4xl mx-auto'>
				<Link
					href='/contacts'
					className='text-cyan-300 hover:text-white mb-6 inline-block'>
					بازگشت به لیست مخاطبین ←
				</Link>

				<div className='rounded-3xl bg-[#111327] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] border border-white/10 mb-6'>
					<h1 className='text-3xl font-bold text-white mb-4'>{contact.name}</h1>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300'>
						<div>
							<span className='font-semibold text-slate-100'>نوع رابطه:</span>{' '}
							{contact.relationshipType}
						</div>

						{contact.company && (
							<div>
								<span className='font-semibold text-slate-100'>شرکت:</span>{' '}
								{contact.company}
							</div>
						)}

						<div>
							<span className='font-semibold text-slate-100'>اهمیت:</span>{' '}
							{contact.importance === 'HIGH'
								? 'بالا'
								: contact.importance === 'MEDIUM'
									? 'متوسط'
									: 'کم'}
						</div>

						{contact.lastContactAt && (
							<div>
								<span className='font-semibold text-slate-100'>
									آخرین تماس:
								</span>{' '}
								{new Date(contact.lastContactAt).toLocaleDateString('fa-IR')}
							</div>
						)}

						{contact.nextFollowUpAt && (
							<div>
								<span className='font-semibold text-slate-100'>
									پیگیری بعدی:
								</span>{' '}
								{new Date(contact.nextFollowUpAt).toLocaleDateString('fa-IR')}
							</div>
						)}
					</div>

					{contact.notes && (
						<div className='mt-4 pt-4 border-t border-white/10'>
							<span className='font-semibold text-slate-100'>یادداشت‌ها:</span>
							<p className='text-slate-300 mt-2'>{contact.notes}</p>
						</div>
					)}
				</div>

				{(needsFollowUp(contact) || contact.importance === 'HIGH') && (
					<AISuggestionSection contactId={contact.id} />
				)}

				<div className='rounded-3xl bg-[#111327] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] border border-white/10'>
					<h2 className='text-2xl font-bold text-white mb-4'>تعاملات</h2>
					<InteractionForm contactId={contact.id} />
					{contact.interactions.length === 0 ? (
						<p className='text-slate-400'>هنوز تعاملی ثبت نشده است.</p>
					) : (
						<div className='space-y-4'>
							{contact.interactions.map((interaction) => (
								<div
									key={interaction.id}
									className='border-l-4 border-blue-500 pl-4 py-2 bg-[#111327] rounded-2xl'>
									<div className='flex items-center gap-2 mb-1 justify-between'>
										<span className='inline-block px-2 py-1 text-xs font-semibold text-cyan-100 bg-cyan-500/10 rounded'>
											{interaction.type}
										</span>

										<span className='text-sm text-slate-400'>
											{new Date(interaction.createdAt).toLocaleDateString(
												'fa-IR',
											)}
										</span>
									</div>

									<p className='text-slate-300'>{interaction.summary}</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
