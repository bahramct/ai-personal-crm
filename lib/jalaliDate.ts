/**
 * تبدیل تاریخ میلادی به جلالی
 * @param gregorianDate تاریخ میلادی
 * @returns {year, month, day} سال، ماه و روز جلالی
 */
export function gregorianToJalali(gregorianDate: Date) {
	const gy = gregorianDate.getFullYear();
	const gm = gregorianDate.getMonth() + 1;
	const gd = gregorianDate.getDate();

	let g_d_n =
		365 * gy +
		Math.floor((gy + 3) / 4) -
		Math.floor((gy + 99) / 100) +
		Math.floor((gy + 399) / 400);

	for (let i = 0; i < gm; ++i) {
		switch (i) {
			case 0:
			case 2:
			case 4:
			case 6:
			case 7:
			case 9:
			case 11:
				g_d_n += 31;
				break;
			case 1:
				if (gy % 400 === 0 || (gy % 100 !== 0 && gy % 4 === 0)) {
					g_d_n += 29;
				} else {
					g_d_n += 28;
				}
				break;
			case 3:
			case 5:
			case 8:
			case 10:
				g_d_n += 30;
				break;
		}
	}

	g_d_n += gd;

	let j_d_n = g_d_n - 79;

	const j_np = Math.floor(j_d_n / 12053);
	j_d_n %= 12053;

	let jy = 979 + 33 * j_np + 4 * Math.floor(j_d_n / 1461);

	j_d_n %= 1461;

	if (j_d_n > 365) {
		jy += Math.floor((j_d_n - 1) / 365);
		j_d_n = (j_d_n - 1) % 365;
	}

	let jm: number;
	let jd: number;

	if (j_d_n < 186) {
		jm = 1 + Math.floor(j_d_n / 31);
		jd = 1 + (j_d_n % 31);
	} else {
		jm = 7 + Math.floor((j_d_n - 186) / 30);
		jd = 1 + ((j_d_n - 186) % 30);
	}

	return { year: jy, month: jm, day: jd };
}

/**
 * تبدیل تاریخ جلالی به میلادی
 * @param jy سال جلالی
 * @param jm ماه جلالی
 * @param jd روز جلالی
 * @returns تاریخ میلادی
 */
export function jalaliToGregorian(jy: number, jm: number, jd: number) {
	let j_d_n =
		365 * jy +
		Math.floor(jy / 33) * 8 +
		Math.floor(((jy % 33) + 3) / 4) +
		186 +
		31 * jm -
		Math.floor(jm / 7) * 6 +
		jd;

	let gy = 400 * Math.floor(j_d_n / 146097);
	j_d_n %= 146097;

	let flag = true;
	if (j_d_n >= 36525) {
		j_d_n--;
		gy += 100 * Math.floor(j_d_n / 36524);
		j_d_n %= 36524;

		if (j_d_n >= 365) {
			j_d_n++;
		}
		flag = false;
	}

	gy += 4 * Math.floor(j_d_n / 1461);
	j_d_n %= 1461;

	if (flag) {
		if (j_d_n >= 366) {
			j_d_n--;
			gy += Math.floor(j_d_n / 365);
			j_d_n = j_d_n % 365;
		}
	}

	const gm: Record<number, number> = {
		0: 31,
		1: 28,
		2: 31,
		3: 30,
		4: 31,
		5: 30,
		6: 31,
		7: 31,
		8: 30,
		9: 31,
		10: 30,
		11: 31,
	};

	if (gy % 400 === 0 || (gy % 100 !== 0 && gy % 4 === 0)) {
		gm[1] = 29;
	}

	let gd = 0;
	let gm_index = 0;
	for (gm_index = 0; gm_index < 12; gm_index++) {
		if (j_d_n < gm[gm_index]) {
			break;
		}
		j_d_n -= gm[gm_index];
	}

	gd = j_d_n + 1;

	return { year: gy, month: gm_index + 1, day: gd };
}

/**
 * فرمت کردن تاریخ جلالی
 * @param year سال جلالی
 * @param month ماه جلالی
 * @param day روز جلالی
 * @returns string از فرمت YYYY-MM-DD جلالی
 */
export function formatJalaliDate(
	year: number,
	month: number,
	day: number,
): string {
	return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * تبدیل ISO string میلادی به format جلالی
 * @param isoString ISO string تاریخ میلادی
 * @returns string از فرمت YYYY-MM-DD جلالی
 */
export function isoToJalaliString(isoString: string): string {
	const date = new Date(isoString);
	const jalali = gregorianToJalali(date);
	return formatJalaliDate(jalali.year, jalali.month, jalali.day);
}
