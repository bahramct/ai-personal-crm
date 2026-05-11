'use client';

import { createInteraction } from '@/app/actions/interactions';
import { useState } from 'react';
import JalaliDatePicker from '@/app/components/JalaliDatePicker';

export default function InteractionForm({ contactId }: { contactId: string }) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);

	// State for dates
	const [happenedAt, setHappenedAt] = useState<Date | undefined>();
	const [nextFollowUpDate, setNextFollowUpDate] = useState<Date | undefined>();

	async function handleSubmit(formData: FormData) {
		setIsSubmitting(true);
		setMessage(null);

		try {
			if (happenedAt) {
				formData.set('happenedAt', happenedAt.toISOString());
			}

			if (nextFollowUpDate) {
				formData.set('nextFollowUpDate', nextFollowUpDate.toISOString());
			}

			const result = await createInteraction(formData);

			if (result.success) {
				setMessage({ type: 'success', text: 'تعامل با موفقیت ثبت شد!' });
				// Reset form
				setHappenedAt(undefined);
				setNextFollowUpDate(undefined);
				const form = document.getElementById(
					'interaction-form',
				) as HTMLFormElement;
				form?.reset();
			} else {
				setMessage({
					type: 'error',
					text: result.error || 'ثبت تعامل با خطا مواجه شد',
				});
			}
		} catch (error) {
			console.error(error);
			setMessage({
				type: 'error',
				text: 'خطای غیرمنتظره رخ داد',
			});
		}

		setIsSubmitting(false);
	}

	return (
		<div className='rounded-3xl bg-[#111327] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]'>
			<h2 className='text-xl font-semibold mb-4 text-white'>ثبت تعامل جدید</h2>

			<form id='interaction-form' action={handleSubmit} className='space-y-4'>
				<input type='hidden' name='contactId' value={contactId} />
				<div>
					<label
						htmlFor='type'
						className='block text-sm font-medium text-slate-200 mb-1'>
						نوع تعامل *
					</label>
					<select
						id='type'
						name='type'
						required
						className='w-full px-3 py-2 border border-slate-700 rounded-md bg-[#0D0E1F] text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-[Vazirmatn]'>
						<option value=''>نوع تعامل را انتخاب کنید...</option>
						<option value='CALL'>تماس</option>
						<option value='EMAIL'>ایمیل</option>
						<option value='MEETING'>جلسه</option>
						<option value='TEXT'>پیامک</option>
						<option value='SOCIAL'>شبکه‌های اجتماعی</option>
						<option value='OTHER'>سایر</option>
					</select>
				</div>
				<div>
					<label
						htmlFor='summary'
						className='block text-sm font-medium text-slate-200 mb-1'>
						خلاصه تعامل *
					</label>
					<textarea
						id='summary'
						name='summary'
						required
						rows={3}
						className='w-full px-3 py-2 border border-slate-700 rounded-md bg-[#0D0E1F] text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-[Vazirmatn]'
						placeholder='خلاصه‌ای از اتفاقات این تعامل را بنویسید'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-slate-200 mb-2'>
						تاریخ و ساعت تعامل *
					</label>
					<JalaliDatePicker
						value={happenedAt}
						onChange={setHappenedAt}
						placeholder='تاریخ تعامل را انتخاب کنید'
						includeTime={true}
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-slate-200 mb-2'>
						تاریخ پیگیری بعدی (اختیاری)
					</label>
					<JalaliDatePicker
						value={nextFollowUpDate}
						onChange={setNextFollowUpDate}
						placeholder='تاریخ پیگیری را انتخاب کنید'
						includeTime={true}
					/>
				</div>{' '}
				<button
					type='submit'
					disabled={isSubmitting}
					className={`w-full px-4 py-2 rounded-md text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150
            ${
							isSubmitting
								? 'bg-gray-400 cursor-not-allowed'
								: 'bg-cyan-500 hover:bg-cyan-400 focus:ring-cyan-500'
						}`}>
					{isSubmitting ? 'در حال ثبت...' : 'ثبت تعامل'}
				</button>
			</form>

			{message && (
				<p
					className={`mt-4 text-center text-sm font-medium ${message.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>
					{message.text}
				</p>
			)}
		</div>
	);
}
