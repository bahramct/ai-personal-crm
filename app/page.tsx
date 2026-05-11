export default function HomePage() {
	return (
		<main className='min-h-screen bg-[#05060F] px-6 py-10'>
			<div className='mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-10'>
				<section className='grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center'>
					<div className='space-y-6'>
						<span className='inline-flex rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 ring-1 ring-cyan-500/20'>
							مدیریت ارتباطات شخصی با هوش مصنوعی
						</span>

						<h1 className='text-5xl font-extrabold tracking-tight text-white sm:text-6xl'>
							CRM هوشمند برای ساخت و تقویت روابط شما
						</h1>

						<p className='max-w-2xl text-lg leading-8 text-slate-300'>
							با یک داشبورد ساده و پیشنهادهای AI، پیگیری مخاطبین و تعاملات شما
							دقیق‌تر، هدفمندتر و سریع‌تر می‌شود.
						</p>

						<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3'>
							<a
								href='/contacts'
								className='inline-flex items-center justify-center rounded-full bg-[#6C63FF] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5b54e6]'>
								مشاهده مخاطبین
							</a>
							<div className='rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200'>
								پشتیبانی از Next.js • Prisma • SQLite
							</div>
						</div>
					</div>

					<div className='rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl'>
						<div className='rounded-3xl bg-[#111327] p-6'>
							<div className='flex items-center justify-between mb-6 rounded-3xl bg-linear-to-l from-[#6C63FF] to-[#00D4FF] p-4 text-white'>
								<div>
									<p className='text-sm font-medium'>
										سیستم مدیریت ارتباطات هوشمند
									</p>
									<p className='text-xs text-slate-100/80'>داشبورد مرکزی شما</p>
								</div>
								<div className='h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center text-xl'>
									🤖
								</div>
							</div>
							<div className='space-y-4'>
								<div className='rounded-3xl bg-[#0D0E1F] p-4 text-slate-100'>
									<p className='text-sm text-slate-400'>مخاطبین فعال</p>
									<p className='mt-2 text-3xl font-semibold text-white'>۲۴</p>
								</div>
								<div className='rounded-3xl bg-[#0D0E1F] p-4 text-slate-100'>
									<p className='text-sm text-slate-400'>تعاملات اخیر</p>
									<p className='mt-2 text-3xl font-semibold text-white'>۸</p>
								</div>
								<div className='rounded-3xl bg-[#0D0E1F] p-4 text-slate-100'>
									<p className='text-sm text-slate-400'>پیشنهاد هوشمند</p>
									<p className='mt-2 text-3xl font-semibold text-white'>
										آماده
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
