"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { analyzeInteraction } from "./analyzeInteraction";

export async function createInteraction(formData: FormData) {
  const contactId = formData.get("contactId") as string;
  const type = formData.get("type") as string;
  const summary = formData.get("summary") as string;
  const happenedAt = formData.get("happenedAt") as string;
  const nextFollowUpDate = formData.get("nextFollowUpDate") as string;

  // اعتبارسنجی فیلدهای الزامی
  if (!contactId || !type || !summary || !happenedAt) {
    return { error: "لطفاً تمام فیلدهای الزامی را پر کنید." };
  }

  try {
    // دریافت نام مخاطب برای تحلیل هوشمند
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      select: { name: true },
    });

    if (!contact) {
      return { error: "مخاطب یافت نشد." };
    }

    // تحلیل هوشمند (fail-safe: اگر خطا داشت null برمی‌گردونه)
    const intelligence = await analyzeInteraction(contact.name, summary);

    // محاسبه تاریخ پیگیری خودکار (اگر AI پیشنهاد داده)
    let autoNextFollowUp: Date | null = null;
    if (intelligence?.follow_up_needed && intelligence.suggested_follow_up_days) {
      autoNextFollowUp = new Date();
      autoNextFollowUp.setDate(
        autoNextFollowUp.getDate() + intelligence.suggested_follow_up_days
      );
    }

    // ساخت تعامل جدید
    await prisma.interaction.create({
      data: {
        contactId,
        type,
        summary,
        happenedAt: new Date(happenedAt),
        nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : null,
        
        // Intelligence fields (optional - fail-safe)
        sentiment: intelligence?.sentiment || null,
        interactionTypeAI: intelligence?.interaction_type || null,
        topics: intelligence?.topics ? JSON.stringify(intelligence.topics) : null,
        relationshipSignal: intelligence?.relationship_signal || null,
        followUpNeeded: intelligence?.follow_up_needed ?? null,
        suggestedFollowUpDays: intelligence?.suggested_follow_up_days ?? null,
      },
    });

    // آپدیت مخاطب
    await prisma.contact.update({
      where: { id: contactId },
      data: {
        lastContactAt: new Date(),
        // اگر AI پیگیری پیشنهاد داده و کاربر تاریخ دستی نداده، از AI استفاده کن
        ...(autoNextFollowUp && !nextFollowUpDate && {
          nextFollowUpAt: autoNextFollowUp,
        }),
      },
    });

    revalidatePath(`/contacts/${contactId}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating interaction:", error);
    return { error: "خطا در ثبت تعامل. لطفاً دوباره تلاش کنید." };
  }
}
