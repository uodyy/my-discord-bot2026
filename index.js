const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildVoiceStates
    ] 
});

// ضع هنا التوكن الجديد الذي حصلت عليه بعد الـ Reset
const TOKEN = "MTUxNDM3MjYyNzk2MjI2NTY5MA.GzV-Qp.EFk4juPsIDD9zLSNkw9--GfJLNetuHBEZLIthA"; 

client.on('ready', () => {
    console.log(`✅ البوت جاهز ويعمل باسم: ${client.user.tag}`);
    
    // تعيين حالة الستريم (تظهر للبوتات كـ Streaming)
    client.user.setActivity("Eyad's Stream", {
        type: ActivityType.Streaming,
        url: "https://www.twitch.tv/twitch"
    });
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('/')) return;
    
    const args = message.content.slice(1).split(' ');
    const command = args.shift().toLowerCase();

    // أمر /room <guildId> <channelId>
    if (command === 'room') {
        const [guildId, channelId] = args;
        const guild = client.guilds.cache.get(guildId);
        if (guild) {
            try {
                joinVoiceChannel({
                    channelId: channelId,
                    guildId: guildId,
                    adapterCreator: guild.voiceAdapterCreator,
                });
                message.reply("✅ تم الاتصال بالروم بنجاح!");
            } catch (error) {
                message.reply("❌ حدث خطأ أثناء الاتصال بالروم.");
            }
        } else {
            message.reply("❌ لم أجد السيرفر، تأكد من الـ ID.");
        }
    }

    // أمر /restart
    if (command === 'restart') {
        await message.reply("🔄 جاري إعادة التشغيل...");
        process.exit(); 
    }
});

client.login(TOKEN);
