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

// ضع التوكن الخاص بك هنا بين علامتي التنصيص
const TOKEN = "MTUxNDM3MjYyNzk2MjI2NTY5MA.GKoSBG.aSfZf_kqZy1DdAZCVl1_5m6-Nmsa4CPIo_Dbic";

client.on('ready', () => {
    console.log(`✅ البوت متصل بنجاح: ${client.user.tag}`);
    client.user.setActivity("Eyad's Stream", {
        type: ActivityType.Streaming,
        url: "https://www.twitch.tv/twitch"
    });
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('/')) return;
    const args = message.content.slice(1).split(' ');
    const command = args.shift().toLowerCase();

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
                message.reply("✅ تم الاتصال بالروم!");
            } catch (error) {
                message.reply("❌ حدث خطأ أثناء الاتصال بالروم.");
            }
        } else {
            message.reply("❌ لم أجد السيرفر.");
        }
    }
});

client.login(TOKEN).catch(err => {
    console.error("❌ فشل تسجيل الدخول. تأكد أن التوكن صحيح!");
});
