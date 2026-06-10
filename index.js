const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client();

const messages = ["منورين السيرفر يا شباب! ✨", "سيرفر سام هو الأفضل دائماً 🏎️", "العمل المستمر هو سر النجاح! 🚀"];
let isPaused = false;

const APP_ID = "1513361397327593562";

client.on('rateLimit', (info) => {
    isPaused = true;
    console.log(`⚠️ نظام الحماية مفعل! توقف لمدة ${Math.round(info.timeout / 1000)} ثانية.`);
    setTimeout(() => { isPaused = false; }, info.timeout + 1000);
});

// دالة الـ Streaming المحدثة بالطريقة التي تقبلها سيرفرات ديسكورد حالياً
const updateStreaming = () => {
    if (isPaused) return;

    client.user.setPresence({
        status: 'online',
        activities: [{
            name: "Eyad's Stream",
            type: "STREAMING",
            url: "https://www.twitch.tv/twitch",
            applicationId: APP_ID,
            details: "Eyad's Stream",
            assets: {
                largeImage: "mp:external/1344473859664539668/https/i.imgur.com/83pZpGZ.png",
                largeText: "Eyad's Stream"
            },
            buttons: [{ label: "Watch Stream", url: "https://www.twitch.tv/twitch" }]
        }]
    });
    console.log("تم تحديث حالة الـ Streaming بنجاح.");
};

async function connectToVoice() {
    const guild = await client.guilds.fetch('701688616614625360').catch(() => null);
    if (guild) {
        try {
            joinVoiceChannel({
                channelId: '1414687975974895636',
                guildId: '701688616614625360',
                adapterCreator: guild.voiceAdapterCreator,
            });
        } catch (error) { console.error("Voice Error:", error); }
    }
}

client.on('ready', async () => {
    console.log(`تم التشغيل كـ: ${client.user.tag}`);
    
    // تشغيل الستات فوراً
    updateStreaming();
    
    // اتصال الصوت
    await connectToVoice();
});

// نظام السبام
setInterval(async () => {
    if (isPaused) return;
    const channel = await client.channels.fetch('1117424312006230057').catch(() => null);
    if (channel) {
        await channel.send(messages[Math.floor(Math.random() * messages.length)]).catch(() => {});
    }
}, 600000);

// نظام الأوتو كويست
client.on('messageCreate', async (message) => {
    if (message.author.system && message.components.length > 0 && !isPaused) {
        const button = message.components[0].components.find(c => c.type === 2);
        if (button && message.content.toLowerCase().includes('quest')) {
            const appId = button.url ? new URL(button.url).searchParams.get('application_id') : "0";
            await message.clickButton(button.customId).catch(() => {});
            spoofQuestProgress(message.id, appId, message.embeds[0]?.title || "مهمة");
        }
    }
});

async function spoofQuestProgress(questId, appId, name) {
    for (let i = 0; i < 45; i++) {
        if (isPaused) break;
        try {
            await client.rest.post(`/quests/${questId}/heartbeat`, { body: { application_id: appId, terminal: false }});
            await new Promise(r => setTimeout(r, 20000));
        } catch (e) { break; }
    }
    await client.rest.post(`/quests/${questId}/heartbeat`, { body: { application_id: appId, terminal: true }});
}

client.login(process.env.TOKEN);
