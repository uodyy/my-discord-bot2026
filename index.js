const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client();

const statusWords = ["Hi", "My", "Word"];
const messages = ["منورين السيرفر يا شباب! ✨", "سيرفر سام هو الأفضل دائماً 🏎️", "العمل المستمر هو سر النجاح! 🚀"];
let isPaused = false;
let lastDeletedMessage = null;

// دالة الحماية
client.on('rateLimit', (info) => {
    isPaused = true;
    console.log(`⚠️ تم تفعيل نظام الحماية! توقف لمدة ${Math.round(info.timeout / 1000)} ثانية.`);
    setTimeout(() => { isPaused = false; }, info.timeout + 1000);
});

// حفظ الرسائل المحذوفة للـ Snipe
client.on('messageDelete', (message) => {
    if (message.author.id !== client.user.id) lastDeletedMessage = message;
});

async function connectToVoice() {
    const guild = client.guilds.cache.get('701688616614625360');
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
    console.log(`تم التشغيل كـ: ${client.user.tag}!`);
    await connectToVoice();

    // نظام الحالة
    setInterval(() => {
        if (isPaused) return;
        let i = Math.floor(Math.random() * statusWords.length);
        client.user.setActivity(statusWords[i], {
            type: "STREAMING",
            url: "https://www.twitch.tv/twitch"
        });
    }, 60000);

    // نظام التلفيل
    setInterval(async () => {
        if (isPaused) return;
        const channel = client.channels.cache.get('1117424312006230057');
        if (channel) {
            await channel.sendTyping();
            setTimeout(async () => {
                await channel.send(messages[Math.floor(Math.random() * messages.length)]);
            }, 3000);
        }
    }, 300000);
});

client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) {
        if (message.content === 'r reset') {
            isPaused = false;
            await message.edit('✅ تم عمل Reset شامل للنظام!');
            setTimeout(() => message.delete().catch(() => {}), 2000);
        }
        if (message.content === ',,snipe') {
            if (!lastDeletedMessage) return message.edit('لا توجد رسائل محذوفة!').catch(() => {});
            message.edit(`🗑️ آخر رسالة محذوفة: "${lastDeletedMessage.content}"`);
        }
    }

    // نظام الأوتو كويست (تصحيح كلمة const)
    if (message.author.system && message.components.length > 0 && !isPaused) {
        const button = message.components[0].components.find(c => c.type === 2); // تصحيح نوع الزر
        if (button && message.content.toLowerCase().includes('quest')) {
            const appId = button.url ? new URL(button.url).searchParams.get('application_id') : "0";
            await message.clickButton(button.customId);
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
