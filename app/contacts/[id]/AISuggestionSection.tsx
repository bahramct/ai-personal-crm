'use client';

import { useState } from 'react';
import { generateAISuggestion } from '@/app/actions/generateSuggestion';
import { toPersianNumbers } from '@/lib/persianNumbers';

interface Props {
	contactId: string;
}

export default function AISuggestionSection({ contactId }: Props) {
	const [loading, setLoading] = useState(false);
	const [suggestion, setSuggestion] = useState('');
	const [urgency, setUrgency] = useState<string>('');
	const [recommendedAction, setRecommendedAction] = useState<string>('');
	const [followUpInDays, setFollowUpInDays] = useState<number | null>(null);
	const [relationshipTemperature, setRelationshipTemperature] =
		useState<string>('');
	const [error, setError] = useState('');

	async function handleGenerate() {
		setLoading(true);
		setError('');
		setSuggestion('');
		setUrgency('');
		setRecommendedAction('');
		setFollowUpInDays(null);
		setRelationshipTemperature('');

		try {
			const result = await generateAISuggestion(contactId);

			if (result.error) {
				setError(result.error);
			} else if (result.suggestion) {
				setSuggestion(result.suggestion);
				setUrgency(result.urgency || '');
				setRecommendedAction(result.recommendedAction || '');
				setFollowUpInDays(result.followUpInDays || null);
				setRelationshipTemperature(result.relationshipTemperature || '');
			} else {
				setError('پاسخ نامعتبر از سرور دریافت شد');
			}
		} catch (err) {
			console.error(err);
			setError('خطای غیرمنتظره رخ داد');
		} finally {
			setLoading(false);
		}
	}

	const urgencyColors = {
		HIGH: 'bg-red-100 text-red-800 border-red-200',
		MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
		LOW: 'bg-green-100 text-green-800 border-green-200',
	};

	const urgencyLabels: Record<string, string> = {
		HIGH: 'فوری',
		MEDIUM: 'متوسط',
		LOW: 'کم',
	};

	const temperatureLabels: Record<string, string> = {
		HOT: 'داغ',
		WARM: 'گرم',
		COLD: 'سرد',
	};

	const temperatureColors = {
		HOT: 'bg-red-100 text-red-800 border-red-200',
		WARM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
		COLD: 'bg-blue-100 text-blue-800 border-blue-200',
	};

	const actionLabels: Record<string, string> = {
		CALL: 'تماس تلفنی',
		EMAIL: 'ایمیل',
		MEETING: 'جلسه',
		MESSAGE: 'پیام',
		OTHER: 'سایر',
	};

	return (
		<div className='rounded-3xl border border-white/10 bg-[#111327] shadow-[0_20px_50px_rgba(0,0,0,0.35)] p-6 mt-6'>
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h2 className='text-xl font-bold text-white'>
						پیشنهاد هوشمند هوش مصنوعی
					</h2>

					<p className='text-sm text-slate-400 mt-1'>
						پیشنهاد حرفه‌ای برای ادامه ارتباط با مخاطب
					</p>
				</div>

				<button
					onClick={handleGenerate}
					disabled={loading}
					className='bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-950 px-5 py-2 rounded-lg font-semibold transition-colors'>
					{loading ? 'در حال تولید...' : 'ایجاد پیشنهاد'}
				</button>
			</div>

			{error && (
				<div className='bg-red-950/40 border border-red-500/20 text-red-200 rounded-lg p-4 mb-4'>
					{error}
				</div>
			)}

			{!suggestion && !loading && !error && (
				<div className='text-center py-10 border-2 border-dashed border-white/10 rounded-lg'>
					<p className='text-slate-400'>هنوز پیشنهادی تولید نشده است</p>
				</div>
			)}

			{suggestion && (
				<div className='space-y-5'>
					<div className='bg-white/5 border border-white/10 rounded-xl p-5'>
						<p className='text-slate-100 leading-8 text-right'>{suggestion}</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{urgency && (
							<div className='border rounded-lg p-4 bg-white/5'>
								<div className='text-sm text-slate-400 mb-2'>سطح فوریت</div>

								<span
									className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${
										urgencyColors[urgency as keyof typeof urgencyColors] ||
										'bg-gray-100 text-gray-700'
									}`}>
									{urgencyLabels[urgency] || urgency}
								</span>
							</div>
						)}

						{recommendedAction && (
							<div className='border rounded-lg p-4 bg-white/5'>
								<div className='text-sm text-slate-400 mb-2'>
									اقدام پیشنهادی
								</div>

								<div className='font-medium text-slate-100'>
									{actionLabels[recommendedAction] || recommendedAction}
								</div>
							</div>
						)}

						{followUpInDays !== null && (
							<div className='border rounded-lg p-4 bg-white/5'>
								<div className='text-sm text-slate-400 mb-2'>زمان پیگیری</div>

								<div className='font-medium text-slate-100'>
									{toPersianNumbers(followUpInDays)} روز دیگر
								</div>
							</div>
						)}

						{relationshipTemperature && (
							<div className='border rounded-lg p-4 bg-white/5'>
								<div className='text-sm text-slate-400 mb-2'>وضعیت رابطه</div>

								<span
									className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${
										temperatureColors[
											relationshipTemperature as keyof typeof temperatureColors
										] || 'bg-gray-100 text-gray-700'
									}`}>
									{temperatureLabels[relationshipTemperature] ||
										relationshipTemperature}
								</span>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
