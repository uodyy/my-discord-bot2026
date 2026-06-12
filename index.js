const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildVoiceStates 
    ] 
});

client.once('ready', () => {
    console.log(`تم تسجيل الدخول بنجاح كـ ${client.user.tag}`);

    // إعداد حالة البث
    client.user.setActivity('مباشر الآن', { 
        type: ActivityType.Streaming,
        url: 'https://www.twitch.tv/example' // ضع رابط تويتش حقيقي
    });

    // الدخول للروم الصوتي باستخدام الأيديات من الموقع
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const channel = guild?.channels.cache.get(process.env.CHANNEL_ID);

    if (channel) {
        joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });
        console.log('تم دخول الروم بنجاح!');
    } else {
        console.log('لم يتم العثور على الروم، تأكد من الأيديات في Variables');
    }
});

client.login(process.env.TOKEN);
