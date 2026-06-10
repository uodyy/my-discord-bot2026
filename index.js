// 1. استيراد المكتبات الأساسية
require('dotenv').config(); // لقراءة التوكن من ملف .env
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

// 2. إعداد الصلاحيات (Intents)
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildVoiceStates
    ] 
});

// 3. عند تشغيل البوت
client.on('ready', () => {
    console.log(`✅ البوت جاهز ويعمل باسم: ${client.user.tag}`);
    
    // تعيين حالة الستريم
    client.user.setActivity("Eyad's Stream", {
        type: ActivityType.Streaming,
        url: "https://www.twitch.tv/twitch"
    });
});

// 4. نظام الأوامر
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
                console.error(error);
                message.reply("❌ حدث خطأ أثناء الاتصال بالروم، تأكد من الصلاحيات.");
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

// 5. تسجيل الدخول باستخدام التوكن من ملف .env
client.login(process.env.TOKEN);
