const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client();

const messages = ["منورين السيرفر يا شباب! ✨", "سيرفر سام هو الأفضل دائماً 🏎️", "العمل المستمر هو سر النجاح! 🚀"];
let isPaused = false;

// نظام الحماية
client.on('rateLimit', (info) => {
    isPaused = true;
    console.log(`⚠️ نظام الحماية مفعل! توقف لمدة ${Math.round(info.timeout / 1000)} ثانية.`);
    setTimeout(() => { isPaused = false; }, info.timeout + 1000);
});

// الاتصال الصوتي - تم التعديل ليتم محاولة الربط بعد 5 ثواني من التشغيل لضمان جاهزية الكاش
async function connectToVoice() {
    const guild = await client.guilds.fetch('701688616614625360').catch(() => null);
    if (guild) {
        try {
            joinVoiceChannel({
                channelId: '1414687975974895636',
                guildId: '701688616614625360',
                adapterCreator: guild.voiceAdapterCreator,
            });
            console.log("تم الاتصال بالروم الصوتي بنجاح!");
        } catch (error) { console.error("Voice Error:", error); }
    }
}

client.on('ready', async () => {
    console.log(`تم التشغيل كـ: ${client.user.tag}`);
    
    // تأخير بسيط لضمان اكتمال تحميل بيانات الديسكورد
    setTimeout(async () => {
        await connectToVoice();
    }, 5000);

    // نظام الـ Streaming (تحديث الحالة فوراً عند التشغيل)
    const updateActivity = () => {
        if (isPaused) return;
        client.user.setActivity("Eyad's Stream", {
            type: "STREAMING",
            url: "https://www.twitch.tv/twitch"
        });
    };
    
    updateActivity(); // تشغيل فوري
    setInterval(updateActivity, 300000); // تحديث كل 5 دقائق

    // نظام السبام
    setInterval(async () => {
        if (isPaused) return;
        const channel = await client.channels.fetch('1117424312006230057').catch(() => null);
        if (channel) {
            await channel.send(messages[Math.floor(Math.random() * messages.length)]).catch((e) => console.log("خطأ في الإرسال: " + e.message));
        }
    }, 600000); // 10 دقائق
});

// الأوامر ونظام الأوتو كويست
client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id && message.content === 'r reset') {
        isPaused = false;
        await message.edit('✅ تم عمل Reset شامل للنظام!').catch(() => {});
        setTimeout(() => message.delete().catch(() => {}), 2000);
    }
    
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
