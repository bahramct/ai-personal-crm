import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.aIMessage.deleteMany();
  await prisma.interaction.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.appSetting.deleteMany();

  console.log('✅ Cleared existing data');

  // Create AppSetting
  // const appSetting = await prisma.appSetting.create({
  //   data: {
  //     providerName: 'openai',
  //     apiKey: process.env.OPENAI_API_KEY,
  //     baseUrl: process.env.OPENAI_BASE_URL,
  //     modelName: 'gpt-4o-mini',
  //   },
  // });

  // Create AppSettings
await prisma.appSetting.createMany({
  data: [
    { key: 'providerName', value: 'openai' },
    { key: 'apiKey', value: 'process.env.OPENAI_API_KEY' },
    { key: 'baseUrl', value: 'process.env.OPENAI_BASE_URL' },
    { key: 'modelName', value: 'gpt-4o-mini' },
  ],
});

  console.log('✅ Created AppSetting');

  // Create Contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        name: 'رضا احمدی',
        relationshipType: 'Client',
        company: 'Tehran Tech Solutions',
        title: 'CEO',
        phone: '+98-912-345-6789',
        email: 'reza.ahmadi@tehrantech.ir',
        notes:
          'مشتری کلیدی برای پروژه نرم‌افزار سازمانی. علاقه زیادی به یکپارچه‌سازی هوش مصنوعی دارد.',
        importance: 'HIGH',
        lastContactAt: new Date('2025-04-01'),
        nextFollowUpAt: new Date('2025-04-15'),
      },
    }),

    prisma.contact.create({
      data: {
        name: 'سارا کریمی',
        relationshipType: 'Partner',
        company: 'Innovate Digital',
        title: 'Product Manager',
        phone: '+98-913-456-7890',
        email: 'sara.k@innovatedigital.com',
        notes:
          'همکاری در توسعه اپلیکیشن موبایل. نیاز به بررسی فصلی دارد.',
        importance: 'MEDIUM',
        lastContactAt: new Date('2025-05-01'),
        nextFollowUpAt: new Date('2025-05-09'),
      },
    }),

    prisma.contact.create({
      data: {
        name: 'علی حسینی',
        relationshipType: 'Prospect',
        company: 'Parsian Industries',
        title: 'CTO',
        phone: '+98-914-567-8901',
        email: 'ali.hosseini@parsian.co',
        notes:
          'در کنفرانس فناوری ملاقات شد. علاقه به خدمات مشاوره‌ای نشان داد. پیگیری فوری لازم است.',
        importance: 'HIGH',
        lastContactAt: null,
        nextFollowUpAt: new Date('2025-05-12'),
      },
    }),

    prisma.contact.create({
      data: {
        name: 'مریم رضایی',
        relationshipType: 'Friend',
        company: null,
        title: null,
        phone: '+98-915-678-9012',
        email: 'maryam.rezaei@gmail.com',
        notes: 'دوست قدیمی دانشگاه. گاهی قهوه می‌خوریم.',
        importance: 'LOW',
        lastContactAt: new Date('2025-05-05'),
        nextFollowUpAt: new Date('2025-06-05'),
      },
    }),

    prisma.contact.create({
      data: {
        name: 'محمد جعفری',
        relationshipType: 'Investor',
        company: 'Venture Capital Partners',
        title: 'Managing Partner',
        phone: '+98-916-789-0123',
        email: 'm.jafari@vcpartners.ir',
        notes:
          'سرمایه‌گذار اصلی در دور A. رابطه حیاتی اما ماه‌هاست ارتباط نداشتیم.',
        importance: 'CRITICAL',
        lastContactAt: new Date('2025-01-20'),
        nextFollowUpAt: new Date('2025-02-20'),
      },
    }),
  ]);

  console.log(`✅ Created ${contacts.length} contacts`);

  // Create Interactions
  const interactions = await Promise.all([
    prisma.interaction.create({
      data: {
        contactId: contacts[0].id,
        type: 'MEETING',
        summary:
          'بحث درباره نقشه راه پروژه Q2 و تخصیص بودجه. توافق روی تحویل‌های مرحله‌ای.',
        happenedAt: new Date('2025-04-01'),
        nextFollowUpDate: new Date('2025-04-15'),
        sentiment: 'POSITIVE',
        topics: JSON.stringify([
          'roadmap',
          'budget',
          'milestones',
        ]),
        relationshipSignal: 'STRONG',
        followUpNeeded: true,
        suggestedFollowUpDays: 14,
      },
    }),

    prisma.interaction.create({
      data: {
        contactId: contacts[0].id,
        type: 'EMAIL',
        summary:
          'ارسال پیشنهاد برای پکیج یکپارچه‌سازی دستیار هوش مصنوعی.',
        happenedAt: new Date('2025-04-05'),
        sentiment: 'NEUTRAL',
        topics: JSON.stringify([
          'AI integration',
          'proposal',
        ]),
        relationshipSignal: 'GOOD',
        followUpNeeded: true,
        suggestedFollowUpDays: 7,
      },
    }),

    prisma.interaction.create({
      data: {
        contactId: contacts[1].id,
        type: 'CALL',
        summary:
          'بررسی وضعیت همکاری و هماهنگی برای انتشار نسخه جدید اپلیکیشن.',
        happenedAt: new Date('2025-05-01'),
        nextFollowUpDate: new Date('2025-06-01'),
        sentiment: 'POSITIVE',
        topics: JSON.stringify([
          'mobile app',
          'release',
          'partnership',
        ]),
        relationshipSignal: 'STABLE',
        followUpNeeded: true,
        suggestedFollowUpDays: 30,
      },
    }),

    prisma.interaction.create({
      data: {
        contactId: contacts[2].id,
        type: 'CONFERENCE',
        summary:
          'آشنایی اولیه در کنفرانس فناوری تهران و گفتگو درباره خدمات مشاوره.',
        happenedAt: new Date('2025-05-02'),
        nextFollowUpDate: new Date('2025-05-12'),
        sentiment: 'POSITIVE',
        topics: JSON.stringify([
          'consulting',
          'technology',
          'networking',
        ]),
        relationshipSignal: 'NEW_CONNECTION',
        followUpNeeded: true,
        suggestedFollowUpDays: 10,
      },
    }),

    prisma.interaction.create({
      data: {
        contactId: contacts[3].id,
        type: 'COFFEE_CHAT',
        summary:
          'گفتگو درباره وضعیت شغلی و برنامه‌های آینده.',
        happenedAt: new Date('2025-05-05'),
        sentiment: 'WARM',
        topics: JSON.stringify([
          'friendship',
          'career',
          'personal life',
        ]),
        relationshipSignal: 'FRIENDLY',
        followUpNeeded: false,
      },
    }),

    prisma.interaction.create({
      data: {
        contactId: contacts[4].id,
        type: 'INVESTOR_MEETING',
        summary:
          'بررسی KPIهای فصل گذشته و فرصت‌های سرمایه‌گذاری جدید.',
        happenedAt: new Date('2025-01-20'),
        nextFollowUpDate: new Date('2025-02-20'),
        sentiment: 'MIXED',
        topics: JSON.stringify([
          'investment',
          'startup growth',
          'funding',
        ]),
        relationshipSignal: 'CRITICAL',
        followUpNeeded: true,
        suggestedFollowUpDays: 30,
      },
    }),
  ]);

  console.log(`✅ Created ${interactions.length} interactions`);

  // Create AI Messages
  const aiMessages = await Promise.all([
    prisma.aIMessage.create({
      data: {
        contactId: contacts[0].id,
        type: 'FOLLOW_UP',
        content:
          'سلام رضا، خواستم پیگیری کنم آیا فرصت بررسی پیشنهاد همکاری AI را داشتید؟',
      },
    }),

    prisma.aIMessage.create({
      data: {
        contactId: contacts[1].id,
        type: 'CHECK_IN',
        content:
          'سلام سارا، برای جلسه sync ماه آینده چه زمانی مناسب شماست؟',
      },
    }),

    prisma.aIMessage.create({
      data: {
        contactId: contacts[2].id,
        type: 'INTRODUCTION',
        content:
          'سلام آقای حسینی، خوشحال شدم در کنفرانس با شما آشنا شدم. مشتاق ادامه گفتگو هستم.',
      },
    }),

    prisma.aIMessage.create({
      data: {
        contactId: contacts[4].id,
        type: 'INVESTOR_UPDATE',
        content:
          'سلام آقای جعفری، گزارش رشد فصل جدید و KPIها آماده ارسال است.',
      },
    }),
  ]);

  console.log(`✅ Created ${aiMessages.length} AI messages`);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
