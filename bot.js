const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const app = express();

// === CONFIG ===
const BOT_TOKEN = 'MTQzODA5NzgzNTEzNTMzNjQ3OA.GEqfdq.EU4nuubkSQTw83yHMGUYjbSLRPxIp22Rq3UafQ';
const PORT = process.env.PORT || 3000;

// === DISCORD BOT SETUP ===
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.guilds.cache.forEach(g => console.log(`Guild: ${g.name} (${g.id})`));
});

client.login(BOT_TOKEN);

// === EXPRESS ENDPOINT ===
app.get('/check', async (req, res) => {
  const guildId = req.query.guild;
  const userId = req.query.user;

  if (!guildId || !userId) {
    return res.status(400).json({ error: 'Missing guild or user parameter' });
  }

  try {
    const guild = await client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId);
    if (member) return res.json({ isMember: true });
  } catch (err) {
    // If not found, discord.js throws an error, which we treat as "not a member"
    return res.json({ isMember: false, error: err.code || err.message });
  }
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`🌐 Bot API listening on port ${PORT}`);
});
