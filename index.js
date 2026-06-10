const { Client } = require('discord.js-selfbot-v13');
const client = new Client();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // دخول الروم الصوتي
  const channel = await client.channels.fetch('1414687975974895636');
  if (channel) {
    channel.join().catch(console.error);
    console.log("Joined your voice channel!");
  }

  // تحديث الحالة (Streaming)
  client.user.setActivity("Eyad", {
    type: "STREAMING",
    url: "https://www.twitch.tv/twitch"
  });
});

client.login(process.env.TOKEN);
