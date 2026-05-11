/**
 * تبدیل اعداد لاتین به فارسی
 * @param num عدد یا string
 * @returns عدد تبدیل شده به فارسی
 */
export function toPersianNumbers(num: string | number): string {
	const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
	return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

/**
 * تبدیل اعداد فارسی به لاتین
 * @param num string حاوی اعداد فارسی یا عربی
 * @returns عدد تبدیل شده به لاتین
 */
export function toLatinaNumbers(num: string): string {
	const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
	const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

	let result = num;

	// تبدیل اعداد فارسی
	persianDigits.forEach((digit, index) => {
		result = result.replace(new RegExp(digit, 'g'), String(index));
	});

	// تبدیل اعداد عربی
	arabicDigits.forEach((digit, index) => {
		result = result.replace(new RegExp(digit, 'g'), String(index));
	});

	return result;
}
