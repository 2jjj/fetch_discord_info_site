const express = require('express');
const app = express();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const config = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Bot está online com o usuário ${client.user.tag}`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Informações do usuário por GET
app.get('/userinfo/:userId', async (req, res) => {
  const userId = req.params.userId;
  const user = await client.users.fetch(userId);

  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }

  const banner = user.bannerURL({ format: 'png', dynamic: true, size: 1024 });
  const avatarURL = user.avatarURL({ format: 'png', dynamic: true, size: 1024 });
  const username = user.username;
  const id = user.id;
  const formattedDate = formatDate(user.createdAt);

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  async function getBadges(userId) {
    try {
      const response = await axios.get(`https://discord.com/api/v9/users/${userId}`, {
        headers: {
          Authorization: `Bot ${config.token}`,
          'Content-Type': 'application/json',
        },
      });
      const user = response.data;
  
      if (user.public_flags && typeof user.public_flags.toArray === 'function') {
        const badges = user.public_flags.toArray().map((flag) => `https://cdn.discordapp.com/attachments/876658705442764032/876660407743193364/${flag}.png`);
        return badges;
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const badges = await getBadges(userId);

  const userInfo = {
    avatarURL,
    username,
    id,
    banner,
    formattedDate,
    badges,
  };
  res.json(userInfo);
});

client.login(config.token);

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
