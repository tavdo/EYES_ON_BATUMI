import { Context, Telegraf, Markup } from "telegraf";
import { message } from "telegraf/filters";
import { INSTAGRAM_URL, TIKTOK_URL } from "@/lib/social";
import {
  adminTelegramId,
  BOOKING_BUTTON,
  botToken,
  botUsername,
  DELIVERY_CAPTION,
  INVALID_CODE_MESSAGE,
  isAdmin,
} from "./config";
import { isPhotoCode } from "./codes";
import {
  createTelegramBooking,
  getTelegramBooking,
  listPendingTelegramBookings,
  setTelegramBookingStatus,
} from "./bookings";
import { getTelegramPhotoByCode, saveTelegramPhoto } from "./photos";
import {
  clearSession,
  getSession,
  setSession,
  updateSessionData,
} from "./sessions";

type BotContext = Context;

function extractFileId(message: {
  document?: { file_id: string };
  photo?: { file_id: string }[];
}) {
  if (message.document?.file_id) return message.document.file_id;
  if (message.photo?.length) return message.photo[message.photo.length - 1].file_id;
  return null;
}

function bookingKeyboard() {
  return Markup.keyboard([[BOOKING_BUTTON]]).resize();
}

function removeKeyboard() {
  return Markup.removeKeyboard();
}

async function resolveUsername() {
  const configured = botUsername();
  if (configured) return configured.replace(/^@/, "");
  return "EYESONBATUMIbot";
}

async function startBooking(ctx: BotContext) {
  if (!ctx.chat) return;
  await setSession({ chatId: ctx.chat.id, flow: "booking", step: 0, data: {} });
  await ctx.reply("რომელი თარიღი გირჩევნია?", removeKeyboard());
}

async function deliverPhoto(ctx: BotContext, rawCode: string) {
  if (!ctx.chat) return;
  const photo = await getTelegramPhotoByCode(rawCode);

  if (!photo) {
    await ctx.reply(INVALID_CODE_MESSAGE, bookingKeyboard());
    return;
  }

  await ctx.telegram.sendDocument(ctx.chat.id, photo.file_id, {
    caption: DELIVERY_CAPTION,
  });
}

async function finishAddPhoto(ctx: BotContext, fileId: string, adminUserId: number) {
  if (!ctx.chat) return;
  const code = await saveTelegramPhoto({ fileId, addedBy: adminUserId });
  const username = await resolveUsername();
  const link = `https://t.me/${username}?start=${code}`;

  await clearSession(ctx.chat.id);
  await ctx.reply(`✅ კოდი: ${code}\n\nგაუზიარე ეს ბმული:\n${link}`);
}

async function handleBookingStep(ctx: BotContext, step: number, text: string) {
  if (!ctx.chat || !ctx.from) return;
  const chatId = ctx.chat.id;

  if (step === 0) {
    await updateSessionData(chatId, { preferredDate: text }, 1);
    await ctx.reply("სად გნებავთ გადაღება? (მაგ. ბულვარი, ძველი ბათუმი, სხვა)");
    return;
  }

  if (step === 1) {
    await updateSessionData(chatId, { location: text }, 2);
    await ctx.reply(
      "რამდენი ხნით/რა ტიპის გადაღება გინდათ? (პორტრეტი, წყვილი, ოჯახი და ა.შ.)",
    );
    return;
  }

  if (step === 2) {
    await updateSessionData(chatId, { sessionType: text }, 3);
    await ctx.reply("საკონტაქტო ნომერი ან სახელი");
    return;
  }

  if (step === 3) {
    const session = await getSession(chatId);
    if (!session) return;

    const draft = session.data;
    const bookingId = await createTelegramBooking({
      telegramUserId: ctx.from.id,
      telegramUsername: ctx.from.username ?? null,
      preferredDate: draft.preferredDate ?? "—",
      location: draft.location ?? "—",
      sessionType: draft.sessionType ?? "—",
      contact: text,
    });

    await clearSession(chatId);
    await ctx.reply(
      "მადლობა! თქვენი მოთხოვნა გადაეცა ფოტოგრაფს, მალე დაგიკავშირდებით ✅",
      bookingKeyboard(),
    );

    const adminId = adminTelegramId();
    if (adminId) {
      const username = ctx.from.username ? `@${ctx.from.username}` : "—";
      await ctx.telegram.sendMessage(
        adminId,
        [
          "🔔 ახალი ჯავშნის მოთხოვნა",
          `ID: ${bookingId}`,
          `თარიღი: ${draft.preferredDate ?? "—"}`,
          `ლოკაცია: ${draft.location ?? "—"}`,
          `ტიპი: ${draft.sessionType ?? "—"}`,
          `კონტაქტი: ${text}`,
          `Telegram: ${username}`,
        ].join("\n"),
      );
    }
  }
}

export function createTelegramBot() {
  const token = botToken();
  if (!token) {
    throw new Error("BOT_TOKEN is not set");
  }

  const bot = new Telegraf(token);

  bot.command("portfolio", async (ctx) => {
    await ctx.reply(
      "👁️ eyes.on.batumi\n\nInstagram: @eyes_on_batumi\nTikTok: @eyes_on_batumi",
      Markup.inlineKeyboard([
        [Markup.button.url("Instagram", INSTAGRAM_URL)],
        [Markup.button.url("TikTok", TIKTOK_URL)],
      ]),
    );
  });

  bot.command("booking", async (ctx) => {
    await startBooking(ctx);
  });

  bot.command("addphoto", async (ctx) => {
    if (!isAdmin(ctx.from?.id)) {
      await ctx.reply("ეს ბრძანება მხოლოდ ფოტოგრაფისთვისაა.");
      return;
    }
    if (!ctx.chat) return;
    await setSession({ chatId: ctx.chat.id, flow: "addphoto", step: 0 });
    await ctx.reply(
      "ატვირთე ფოტო ფაილად (document) ან სურათად — სრული ხარისხისთვის document უკეთესია.",
    );
  });

  bot.command("bookings", async (ctx) => {
    if (!isAdmin(ctx.from?.id)) {
      await ctx.reply("ეს ბრძანება მხოლოდ ფოტოგრაფისთვისაა.");
      return;
    }

    const pending = await listPendingTelegramBookings();
    if (pending.length === 0) {
      await ctx.reply("ახალი ჯავშანი არ არის.");
      return;
    }

    const lines = pending.map(
      (item) =>
        `#${item.id}\n${item.preferred_date} · ${item.location}\n${item.session_type}\n${item.contact}\n@${item.telegram_username ?? "—"}`,
    );
    await ctx.reply(`🔔 მოლოდინში:\n\n${lines.join("\n\n")}`);
  });

  bot.command("confirm", async (ctx) => {
    if (!isAdmin(ctx.from?.id)) {
      await ctx.reply("ეს ბრძანება მხოლოდ ფოტოგრაფისთვისაა.");
      return;
    }

    const id = ctx.message.text.split(/\s+/)[1]?.trim();
    if (!id) {
      await ctx.reply("გამოიყენე: /confirm {id}");
      return;
    }

    const booking = await getTelegramBooking(id);
    if (!booking) {
      await ctx.reply("ჯავშანი ვერ მოიძებნა.");
      return;
    }

    await setTelegramBookingStatus(id, "confirmed");
    await ctx.reply(`✅ #${id} დადასტურებულია.`);
    await ctx.telegram.sendMessage(
      booking.telegram_user_id,
      "თქვენი ჯავშანი დადასტურებულია! ✅",
    );
  });

  bot.command("decline", async (ctx) => {
    if (!isAdmin(ctx.from?.id)) {
      await ctx.reply("ეს ბრძანება მხოლოდ ფოტოგრაფისთვისაა.");
      return;
    }

    const id = ctx.message.text.split(/\s+/)[1]?.trim();
    if (!id) {
      await ctx.reply("გამოიყენე: /decline {id}");
      return;
    }

    const booking = await getTelegramBooking(id);
    if (!booking) {
      await ctx.reply("ჯავშანი ვერ მოიძებნა.");
      return;
    }

    await setTelegramBookingStatus(id, "declined");
    await ctx.reply(`უარყოფილია: #${id}`);
    await ctx.telegram.sendMessage(
      booking.telegram_user_id,
      "სამწუხაროდ ამ დროისთვის ვერ შევძლებთ — სცადეთ სხვა თარიღი 🙏",
    );
  });

  bot.start(async (ctx) => {
    const payload = ctx.startPayload?.trim();
    if (payload) {
      await deliverPhoto(ctx, payload);
      return;
    }

    await ctx.reply(
      "მოგესალმები! 👁️ ეს არის @eyes.on.batumi-ს ბოტი.\n\nთუ გაქვს ფოტოს კოდი, გამომიგზავნე, ან დააჭირე /booking ფოტოსესიის დასაჯავშნად.",
      bookingKeyboard(),
    );
  });

  bot.on(message("text"), async (ctx) => {
    if (!ctx.chat) return;
    const text = ctx.message.text.trim();

    if (text === BOOKING_BUTTON) {
      await startBooking(ctx);
      return;
    }

    const session = await getSession(ctx.chat.id);
    if (session?.flow === "booking") {
      await handleBookingStep(ctx, session.step, text);
      return;
    }

    if (session?.flow === "addphoto" && isAdmin(ctx.from?.id)) {
      await ctx.reply("გთხოვ ატვირთე სურათის ფაილი.");
      return;
    }

    if (isPhotoCode(text)) {
      await deliverPhoto(ctx, text);
    }
  });

  bot.on(message("photo"), async (ctx) => {
    if (!ctx.chat) return;
    const session = await getSession(ctx.chat.id);

    if (session?.flow === "addphoto" && isAdmin(ctx.from?.id) && ctx.from) {
      const fileId = extractFileId(ctx.message);
      if (!fileId) return;
      await finishAddPhoto(ctx, fileId, ctx.from.id);
    }
  });

  bot.on(message("document"), async (ctx) => {
    if (!ctx.chat) return;
    const session = await getSession(ctx.chat.id);

    if (session?.flow === "addphoto" && isAdmin(ctx.from?.id) && ctx.from) {
      const fileId = extractFileId(ctx.message);
      if (!fileId) return;
      await finishAddPhoto(ctx, fileId, ctx.from.id);
    }
  });

  return bot;
}

let botInstance: Telegraf<BotContext> | null = null;

export function getTelegramBot() {
  if (!botInstance) {
    botInstance = createTelegramBot();
  }
  return botInstance;
}
