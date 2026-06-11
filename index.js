const { Client } = require('discord.js-selfbot-v13');
const client = new Client();

const TOKEN = 'OTM1NjM0MDE5NTg3MDY3OTk1.GzD2RG.i5qlPmfFKc_THtBLgHNtmVv6ondcin5Dvdk-wI';
const CHANNEL_ID = '1414687975974895636';

client.on('ready', async () => {
    console.log(`تم تسجيل الدخول بنجاح: ${client.user.tag}`);
    
    // دالة الدخول للروم
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (channel) {
        channel.join();
    }

    // إعداد الستريم
    client.user.setActivity('https://www.twitch.tv/', {
        type: 'STREAMING',
        url: 'https://www.twitch.tv/twitchusername'
    });
});

client.login(TOKEN);
