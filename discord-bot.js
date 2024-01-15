const Discord = require('discord.js');
const { Client, GatewayIntentBits, REST, Routes, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, } = require('discord.js');
const fetch = require('node-fetch');

const VERIFICATION_URL = 'YOUR_VERIFICATION_SITE_URL';
const ROLE_ID = 'YOUR_ROLE_ID';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase() === '!verify') {
    const embed = new Discord.MessageEmbed()
      .setTitle('Verification')
      .setDescription('Click the button below to verify')
      .setColor('#00ff00'); // You can customize the color

    const button = new ButtonBuilder()
      .setStyle('ButtonStyle.Link')
      .setLabel('Verify')
      .setURL(VERIFICATION_URL);

    const row = new Discord.MessageActionRow().addComponents(button);

    const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });

    const filter = (interaction) => interaction.customId === 'verify_button';
    const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async (interaction) => {
      const user = interaction.user;

      const response = await fetch(VERIFICATION_URL); 
      const data = await response.json();

      if (data.isVPN) {
        user.send('You are on a VPN, disable your VPN and verify again.');
      } else {
        const guild = client.guilds.cache.get('YOUR_GUILD_ID');
        const member = guild.members.cache.get(user.id);
        const role = guild.roles.cache.get(ROLE_ID);

        member.roles.add(role);
      }

      interaction.update({ content: 'Verification Successful!', components: [] });
    });
  }
});

client.login('YOUR_BOT_TOKEN');
