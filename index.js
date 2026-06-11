const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client();

client.on('ready', async () => {
  console.log(`تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);

  // هنا تضع ID الروم الصوتي الذي تريد البوت أن يدخله
  const channelId = '1414687975974895636';
  const guildId = '701688616614625360';

  const channel = client.channels.cache.get(channelId);
  if (channel) {
    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false, // اجعله false ليكون الصوت غير مكتوم
      selfMute: false  // اجعله false ليتمكن البوت من الكلام إذا أردت
    });
    console.log("تم الانضمام للروم بنجاح");
  }
});

// ضع التوكن هنا أو استخدم المتغيرات في Railway
client.login('OTM1NjM0MDE5NTg3MDY3OTk1.G54q35.YbCnjLD2oYCmEPs4LifZTqrQpiTg5QjhmWQ_No');
