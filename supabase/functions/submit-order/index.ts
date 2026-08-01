import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1527431383340023839/be9_A-GwaPIHVJlb2a8VS5IPqnRWPAv3zJ95iKdABjtrZ8AdvgQXz2Bz2agZ70uA3qh3";

const PAYMENT_LABELS: Record<string, string> = {
  visa: "بطاقة فيزا (Visa)",
  paypal: "PayPal",
  instapay: "InstaPay",
  vodafone_cash: "فودافون كاش (Vodafone Cash)",
};

const PAYMENT_EMOJI: Record<string, string> = {
  visa: "💳",
  paypal: "🅿️",
  instapay: "📱",
  vodafone_cash: "🏦",
};

const STATUS_EMOJI = {
  pending: "⏳",
  processing: "🔄",
  completed: "✅",
  cancelled: "❌",
  refunded: "↩️",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      orderNumber,
      productName,
      productCategory,
      price,
      playerName,
      playerDiscordId,
      paymentMethod,
    } = body;

    if (!orderNumber || !productName || !playerName || !playerDiscordId || !paymentMethod) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const paymentLabel = PAYMENT_LABELS[paymentMethod] || paymentMethod;
    const paymentEmoji = PAYMENT_EMOJI[paymentMethod] || "💰";
    const timestamp = new Date().toISOString();
    const unixTime = Math.floor(Date.now() / 1000);

    // Discord mention format — only valid if the ID is a pure number
    const isNumericId = /^\d{17,20}$/.test(playerDiscordId.trim());
    const discordMention = isNumericId ? `<@${playerDiscordId.trim()}>` : `\`${playerDiscordId}\``;

    // Main order embed
    const orderEmbed = {
      title: "🛒 طلب جديد — متجر ULG CFW",
      description: `**رقم الطلب:** \`${orderNumber}\`\nتم استلام طلب جديد من متجر ULG CFW. يرجى مراجعة التفاصيل أدناه.`,
      color: 0xe07b20,
      fields: [
        {
          name: "📦 المنتج",
          value: `\`${productName}\``,
          inline: false,
        },
        {
          name: "🏷️ القسم",
          value: productCategory ? `\`${productCategory}\`` : "—",
          inline: true,
        },
        {
          name: "💰 السعر",
          value: `\`$${price} USD\``,
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: false,
        },
        {
          name: "🎮 اسم اللاعب",
          value: `\`${playerName}\``,
          inline: false,
        },
        {
          name: "🆔 ايدي ديسكورد اللاعب",
          value: `${discordMention}\n\`${playerDiscordId}\``,
          inline: false,
        },
        {
          name: `${paymentEmoji} طريقة الدفع`,
          value: `\`${paymentLabel}\``,
          inline: true,
        },
        {
          name: "📅 تاريخ الطلب",
          value: `<t:${unixTime}:F>`,
          inline: true,
        },
      ],
      footer: { text: `ULG CFW Store • ${orderNumber}` },
      timestamp,
      thumbnail: {
        url: "https://a.top4top.io/p_3849ne4pe1.png",
      },
    };

    // Staff action embed with mention
    const staffEmbed = {
      title: "🔔 تنبيه للفريق الفني",
      description: `تم استلام طلب جديد برقم \`${orderNumber}\`\n**اللاعب:** ${discordMention}\nيرجى فتح تذكرة والتواصل مع العميل لإتمام العملية.`,
      color: 0x5865f2,
      footer: { text: "نظام الطلبات التلقائي" },
      timestamp,
    };

    const discordRes = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "ULG CFW Store",
        embeds: [orderEmbed, staffEmbed],
        content: `🔔 **طلب جديد** — ${discordMention}`,
      }),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      return new Response(
        JSON.stringify({ error: "Discord webhook failed", details: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, orderNumber }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
