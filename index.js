const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // دخول الروم الصوتي
  try {
    const guild = client.guilds.cache.get('701688616614625360');
    if (guild) {
        joinVoiceChannel({
            channelId: '1414687975974895636',
            guildId: '701688616614625360',
            adapterCreator: guild.voiceAdapterCreator,
        });
        console.log("Joined your voice channel successfully!");
    }
  } catch (error) {
    console.error("Error joining channel:", error);
  }

  // تحديث الحالة
  client.user.setActivity("Eyad", {
    type: "STREAMING",
    url: "https://www.twitch.tv/twitch"
  });
});

client.login(process.env.TOKEN);
