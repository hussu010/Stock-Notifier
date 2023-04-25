import { EmbedBuilder, WebhookClient } from 'discord.js';

const sendMessageToDiscord = (title: string, content: string) => {
  const { DISCORD_WEBHOOK_ID, DISCORD_WEBHOOK_TOKEN } = process.env;

  if (!DISCORD_WEBHOOK_ID || !DISCORD_WEBHOOK_TOKEN) {
    throw new Error('Discord webhook not configured');
  }

  const webhookClient = new WebhookClient({
    id: DISCORD_WEBHOOK_ID,
    token: DISCORD_WEBHOOK_TOKEN,
  });

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(0x00ffff)
    .setDescription(content);

  webhookClient.send({
    content: '@everyone',
    embeds: [embed],
  });
};

export { sendMessageToDiscord };
