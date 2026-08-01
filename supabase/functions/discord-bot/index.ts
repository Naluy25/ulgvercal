import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BOT_TOKEN = Deno.env.get("DISCORD_BOT_TOKEN") || "";
const GUILD_ID = "1075522145876201532";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function discordFetch(path: string, method: string, body?: object) {
  const res = await fetch(`https://discord.com/api/v10${path}`, {
    method,
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace("/functions/v1/discord-bot", "");
    const { action } = await req.json();

    // ── Grant role ──
    if (action === "grant_role") {
      const { discord_id, role_id, role_name, admin_name, reason } = await req.json();
      const res = await discordFetch(`/guilds/${GUILD_ID}/members/${discord_id}/roles/${role_id}`, "PUT");
      if (!res.ok && res.status !== 204) {
        const errText = await res.text();
        return new Response(JSON.stringify({ error: errText }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      await supabase.from("role_changes").insert({
        discord_id, role_id, role_name, action: "grant", reason, admin_name,
      });
      await supabase.from("admin_logs").insert({
        admin_name, action: "grant_role", target: discord_id,
        details: `Role: ${role_name} (${role_id}) — ${reason}`,
      });
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Revoke role ──
    if (action === "revoke_role") {
      const { discord_id, role_id, role_name, admin_name, reason } = await req.json();
      const res = await discordFetch(`/guilds/${GUILD_ID}/members/${discord_id}/roles/${role_id}`, "DELETE");
      if (!res.ok && res.status !== 204) {
        const errText = await res.text();
        return new Response(JSON.stringify({ error: errText }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      await supabase.from("role_changes").insert({
        discord_id, role_id, role_name, action: "revoke", reason, admin_name,
      });
      await supabase.from("admin_logs").insert({
        admin_name, action: "revoke_role", target: discord_id,
        details: `Role: ${role_name} (${role_id}) — ${reason}`,
      });
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Get member roles ──
    if (action === "get_roles") {
      const { discord_id } = await req.json();
      const res = await discordFetch(`/guilds/${GUILD_ID}/members/${discord_id}`, "GET");
      if (!res.ok) {
        return new Response(JSON.stringify({ error: "Member not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const member = await res.json();
      return new Response(JSON.stringify({ roles: member.roles || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Get guild roles ──
    if (action === "get_guild_roles") {
      const res = await discordFetch(`/guilds/${GUILD_ID}/roles`, "GET");
      if (!res.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch roles" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const roles = await res.json();
      return new Response(JSON.stringify({ roles }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
