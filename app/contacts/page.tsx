import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { needsFollowUp } from '@/lib/followUp';

export default async function ContactsPage() {
	const contacts = await prisma.contact.findMany({
		orderBy: {
			createdAt: 'desc',
		},
	});

	if (contacts.length === 0) {
		return (
			<div className='min-h-screen bg-[#05060F] p-8'>
				<div className='max-w-5xl mx-auto'>
					<h1 className='text-3xl font-bold text-white mb-8'>مخاطبین</h1>
					<div className='rounded-3xl bg-[#111327] p-10 text-center text-slate-300 shadow-lg border border-white/10'>
						هنوز مخاطبی ثبت نشده است.
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-[#05060F] p-8'>
			<div className='max-w-5xl mx-auto'>
				<h1 className='text-3xl font-bold text-white mb-8'>مخاطبین</h1>

				<div className='space-y-4'>
					{contacts.map((contact) => (
						<div
							key={contact.id}
							className='rounded-3xl bg-[#111327] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition hover:shadow-[0_25px_60px_rgba(108,99,255,0.2)]'>
							<div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
								<div className='flex-1'>
									<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
										<h2 className='text-xl font-semibold text-white'>
											<Link
												href={`/contacts/${contact.id}`}
												className='text-cyan-300 hover:text-cyan-100 font-semibold'>
												{contact.name}
											</Link>
										</h2>

										{needsFollowUp(contact) && (
											<span className='inline-flex items-center rounded-full bg-amber-100/10 px-3 py-1 text-xs font-medium text-amber-200 border border-amber-300/20'>
												نیاز به پیگیری
											</span>
										)}
									</div>

									<div className='mt-4 space-y-2 text-slate-300'>
										<p className='text-sm'>
											<span className='font-medium text-slate-100'>
												نوع رابطه:
											</span>{' '}
											{contact.relationshipType}
										</p>

										{contact.company && (
											<p className='text-sm'>
												<span className='font-medium text-slate-100'>
													شرکت:
												</span>{' '}
												{contact.company}
											</p>
										)}

										<p className='text-sm'>
											<span className='font-medium text-slate-100'>اهمیت:</span>{' '}
											<span
												className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
													contact.importance === 'HIGH'
														? 'bg-red-100 text-red-800'
														: contact.importance === 'MEDIUM'
															? 'bg-yellow-100 text-yellow-800'
															: 'bg-gray-100 text-gray-800'
												}`}>
												{contact.importance === 'HIGH'
													? 'بالا'
													: contact.importance === 'MEDIUM'
														? 'متوسط'
														: 'کم'}
											</span>
										</p>
									</div>
								</div>

								<div className='mr-4 text-right text-sm text-slate-400'>
									{contact.lastContactAt && (
										<p>
											<span className='font-medium text-slate-100'>
												آخرین تماس:
											</span>
											<br />
											{new Date(contact.lastContactAt).toLocaleDateString(
												'fa-IR',
											)}
										</p>
									)}

									{contact.nextFollowUpAt && (
										<p className='mt-2'>
											<span className='font-medium text-slate-100'>
												پیگیری بعدی:
											</span>
											<br />
											{new Date(contact.nextFollowUpAt).toLocaleDateString(
												'fa-IR',
											)}
										</p>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
