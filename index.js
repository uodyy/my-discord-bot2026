const { Client } = require('discord.js-selfbot-v14');
const client = new Client();

client.on('ready', async () => {
    console.log(`تم تسجيل الدخول كـ ${client.user.tag}`);
    
    // ايديات السيرفر والروم
    const guildId = '701688616614625360';
    const channelId = '1414687975974895636';

    try {
        const channel = await client.channels.fetch(channelId);
        if (channel && channel.isVoiceBased()) {
            await channel.join(); // أمر الانضمام للروم
            console.log('تم دخول الروم بنجاح!');
        } else {
            console.log('لم يتم العثور على الروم أو الروم ليس صوتياً.');
        }
    } catch (error) {
        console.error('حدث خطأ أثناء محاولة دخول الروم:', error);
    }
});

// هنا تضع التوكن الخاص بحسابك (الذي يبدأ بـ OT)
client.login(process.env.TOKEN);
