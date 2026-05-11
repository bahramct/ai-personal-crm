'use client';

import { useState, useRef, useEffect } from 'react';
import { gregorianToJalali, jalaliToGregorian } from '@/lib/jalaliDate';
import { toPersianNumbers } from '@/lib/persianNumbers';

interface JalaliDatePickerProps {
	value?: Date;
	onChange: (date: Date) => void;
	placeholder?: string;
	className?: string;
	includeTime?: boolean;
}

export default function JalaliDatePicker({
	value,
	onChange,
	placeholder = 'تاریخ را انتخاب کنید',
	className = '',
	includeTime = false,
}: JalaliDatePickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [currentJalali, setCurrentJalali] = useState(() => {
		if (value) {
			return gregorianToJalali(value);
		}
		return gregorianToJalali(new Date());
	});
	const [hour, setHour] = useState(() => value?.getHours() ?? 12);
	const [minute, setMinute] = useState(() => value?.getMinutes() ?? 0);

	useEffect(() => {
		if (value) {
			setCurrentJalali(gregorianToJalali(value));
			setHour(value.getHours());
			setMinute(value.getMinutes());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	const pickerRef = useRef<HTMLDivElement>(null);

	const monthsFA = [
		'فروردین',
		'اردیبهشت',
		'خرداد',
		'تیر',
		'مرداد',
		'شهریور',
		'مهر',
		'آبان',
		'آذر',
		'دی',
		'بهمن',
		'اسفند',
	];

	const daysInMonth = (year: number, month: number) => {
		if (month <= 6) return 31;
		if (month <= 11) return 30;
		// اسفند در سال‌های کبیسه 30 روز است
		const leapYear =
			(year % 33 === 1 && year % 128 !== 65) ||
			(year % 33 === 5 && year % 128 === 65);
		return leapYear ? 30 : 29;
	};

	const getDaysInCurrentMonth = () => {
		return daysInMonth(currentJalali.year, currentJalali.month);
	};

	const getFirstDayOfMonth = () => {
		const gregorian = jalaliToGregorian(
			currentJalali.year,
			currentJalali.month,
			1,
		);
		const date = new Date(gregorian.year, gregorian.month - 1, gregorian.day);
		return (date.getDay() + 1) % 7; // Convert to Persian week (Sat = 0)
	};

	const handleDateSelect = (day: number) => {
		const gregorian = jalaliToGregorian(
			currentJalali.year,
			currentJalali.month,
			day,
		);
		const newDate = new Date(
			gregorian.year,
			gregorian.month - 1,
			gregorian.day,
			hour,
			minute,
		);
		onChange(newDate);
		setIsOpen(false);
	};

	const handlePrevMonth = () => {
		setCurrentJalali((prev) => {
			if (prev.month === 1) {
				return { year: prev.year - 1, month: 12, day: 1 };
			}
			return { year: prev.year, month: prev.month - 1, day: 1 };
		});
	};

	const handleNextMonth = () => {
		setCurrentJalali((prev) => {
			if (prev.month === 12) {
				return { year: prev.year + 1, month: 1, day: 1 };
			}
			return { year: prev.year, month: prev.month + 1, day: 1 };
		});
	};

	const handleClickOutside = (e: MouseEvent) => {
		if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const daysArray = Array.from(
		{ length: getDaysInCurrentMonth() },
		(_, i) => i + 1,
	);
	const firstDayEmpty = Array.from(
		{ length: getFirstDayOfMonth() },
		() => null,
	);

	const displayDate = value
		? `${toPersianNumbers(gregorianToJalali(value).year)}/${toPersianNumbers(String(gregorianToJalali(value).month).padStart(2, '0'))}/${toPersianNumbers(String(gregorianToJalali(value).day).padStart(2, '0'))}`
		: placeholder;

	return (
		<div ref={pickerRef} className='relative font-[Vazirmatn]'>
			<button
				type='button'
				onClick={() => setIsOpen(!isOpen)}
				className={`w-full px-3 py-2 border border-slate-700 rounded-md bg-[#0D0E1F] text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-right font-[Vazirmatn] flex items-center justify-between ${className}`}>
				<span>{displayDate}</span>
				<span className='text-slate-400'>📅</span>
			</button>

			{isOpen && (
				<div className='absolute top-full left-0 right-0 mt-2 z-50 bg-[#111327] border border-slate-700 rounded-lg shadow-lg p-4 font-[Vazirmatn]'>
					{/* Header */}
					<div className='flex items-center justify-between mb-4'>
						<button
							type='button'
							onClick={handlePrevMonth}
							className='p-1 hover:bg-slate-700 rounded text-slate-200'>
							→
						</button>
						<div className='text-center'>
							<div className='text-slate-100 font-semibold'>
								{monthsFA[currentJalali.month - 1]}{' '}
								{toPersianNumbers(currentJalali.year)}
							</div>
						</div>
						<button
							type='button'
							onClick={handleNextMonth}
							className='p-1 hover:bg-slate-700 rounded text-slate-200'>
							←
						</button>
					</div>

					{/* Days of week header */}
					<div className='grid grid-cols-7 gap-1 mb-2'>
						{['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((day) => (
							<div
								key={day}
								className='text-center text-slate-400 text-xs font-semibold py-1'>
								{day}
							</div>
						))}
					</div>

					{/* Calendar grid */}
					<div className='grid grid-cols-7 gap-1 mb-4'>
						{[...firstDayEmpty, ...daysArray].map((day, index) => (
							<div key={index}>
								{day ? (
									<button
										type='button'
										onClick={() => handleDateSelect(day)}
										className={`w-full h-8 rounded text-sm font-medium transition ${
											currentJalali.day === day &&
											currentJalali.month ===
												gregorianToJalali(value || new Date()).month &&
											currentJalali.year ===
												gregorianToJalali(value || new Date()).year
												? 'bg-cyan-500 text-slate-950'
												: 'text-slate-200 hover:bg-slate-700'
										}`}>
										{toPersianNumbers(day)}
									</button>
								) : (
									<div />
								)}
							</div>
						))}
					</div>

					{/* Time selector */}
					{includeTime && (
						<div className='border-t border-slate-700 pt-4'>
							<div className='text-xs text-slate-400 mb-2'>ساعت و دقیقه</div>
							<div className='flex gap-2'>
								<div className='flex-1'>
									<input
										type='number'
										min='0'
										max='23'
										value={hour}
										onChange={(e) =>
											setHour(
												Math.max(
													0,
													Math.min(23, parseInt(e.target.value) || 0),
												),
											)
										}
										className='w-full px-2 py-1 border border-slate-700 rounded bg-[#0D0E1F] text-slate-100 text-center text-sm'
										placeholder='ساعت'
									/>
									<div className='text-xs text-slate-500 text-center mt-1'>
										ساعت
									</div>
								</div>
								<div className='flex-1'>
									<input
										type='number'
										min='0'
										max='59'
										value={minute}
										onChange={(e) =>
											setMinute(
												Math.max(
													0,
													Math.min(59, parseInt(e.target.value) || 0),
												),
											)
										}
										className='w-full px-2 py-1 border border-slate-700 rounded bg-[#0D0E1F] text-slate-100 text-center text-sm'
										placeholder='دقیقه'
									/>
									<div className='text-xs text-slate-500 text-center mt-1'>
										دقیقه
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
