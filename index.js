const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client();

const APP_ID = "1514372627962265690";
let isPaused = false;

// --- دالة الستريم المدمجة ---
const setStreaming = () => {
    client.user.setPresence({
        status: 'online',
        activities: [{
            name: "Eyad's Stream",
            type: "STREAMING",
            url: "https://www.twitch.tv/twitch",
            applicationId: APP_ID,
            assets: { largeImage: "stream_logo", largeText: "Eyad's Stream" },
            buttons: [{ label: "Watch Stream", url: "https://www.twitch.tv/twitch" }]
        }]
    });
};

// --- نظام الأوامر (Slash-like) ---
client.on('messageCreate', async (message) => {
    if (message.author.id !== client.user.id) return; // البوت يستجيب لك فقط

    const args = message.content.slice(1).split(' ');
    const command = args.shift().toLowerCase();

    // /room <guildId> <channelId>
    if (command === 'room') {
        const [guildId, channelId] = args;
        const guild = await client.guilds.fetch(guildId).catch(() => null);
        if (guild) {
            joinVoiceChannel({ channelId, guildId, adapterCreator: guild.voiceAdapterCreator });
            message.reply(`✅ تم الاتصال بالروم: ${channelId}`);
        } else message.reply("❌ تعذر العثور على السيرفر.");
    }

    // /restart
    if (command === 'restart') {
        message.reply("🔄 إعادة تشغيل البوت...");
        process.exit(); // سيعيد تشغيله تلقائياً إذا كنت تستخدم PM2
    }

    // /stream
    if (command === 'stream') {
        setStreaming();
        message.reply("📺 تم تفعيل الستريم.");
    }
});

client.on('ready', () => {
    console.log(`تم التشغيل كـ: ${client.user.tag}`);
    setStreaming();
});

// --- الأوتو كويست ---
client.on('messageCreate', async (message) => {
    if (message.author.system && message.components.length > 0) {
        const button = message.components[0].components.find(c => c.type === 2);
        if (button && message.content.toLowerCase().includes('quest')) {
            const appId = button.url ? new URL(button.url).searchParams.get('application_id') : "0";
            await message.clickButton(button.customId).catch(() => {});
        }
    }
});

client.login(process.env.TOKEN);
