const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client();

const statusWords = ["Hi", "My", "Word"];
const messages = ["منورين السيرفر يا شباب! ✨", "سيرفر سام هو الأفضل دائماً 🏎️", "العمل المستمر هو سر النجاح! 🚀"];
let isPaused = false;

// 1. نظام الحماية
client.on('rateLimit', (info) => {
    isPaused = true;
    console.log(`⚠️ نظام الحماية مفعل لمدة ${Math.round(info.timeout / 1000)} ثانية.`);
    setTimeout(() => { isPaused = false; }, info.timeout + 1000);
});

// 2. الاتصال الصوتي
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

    // 3. نظام الـ Streaming (مع الصورة والزر)
    setInterval(() => {
        if (isPaused) return;
        let i = Math.floor(Math.random() * statusWords.length);
        client.user.setActivity(statusWords[i], {
            type: "STREAMING",
            url: "https://www.twitch.tv/twitch",
            assets: {
                largeImage: "795a6fa3f1b9e0294bb4ddeb5a1094f73a0553a2b6e11b51bba78fd4c310652d",
                largeText: "Eyad's Stream"
            },
            buttons: [{ label: "Watch Stream", url: "https://www.twitch.tv/twitch" }]
        });
    }, 60000);

    // 4. نظام السبام المطور (شغال بـ fetch)
    setInterval(async () => {
        if (isPaused) return;
        let channel = client.channels.cache.get('1117424312006230057') || await client.channels.fetch('1117424312006230057').catch(() => null);
        if (channel) {
            await channel.sendTyping();
            setTimeout(async () => {
                await channel.send(messages[Math.floor(Math.random() * messages.length)]).catch(() => {});
            }, 3000);
        }
    }, 300000); // 5 دقائق
});

// 5. الأوامر ونظام الأوتو كويست
client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id && message.content === 'r reset') {
        isPaused = false;
        await message.edit('✅ تم عمل Reset شامل للنظام!');
        setTimeout(() => message.delete().catch(() => {}), 2000);
    }
    
    if (message.author.system && message.components.length > 0 && !isPaused) {
        const button = message.components[0].components.find(c => c.type === 2);
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
