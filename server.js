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
  
      if (user.flags) {
        const badges = [];
  
        if (user.flags & 1 << 0) {
          badges.push('discordstaff');
        }
        if (user.flags & 1 << 1) {
          badges.push('olddiscordpartner');
        }
        if (user.flags & 1 << 2) {
          badges.push('hypesquadevents');
        }
        if (user.flags & 1 << 3) {
          badges.push('discordbughunter1');
        }
        if (user.flags & 1 << 6) {
          badges.push('hypesquadbravery');
        }
        if (user.flags & 1 << 7) {
          badges.push('hypesquadbrilliance');
        }
        if (user.flags & 1 << 8) {
          badges.push('hypesquadbalance');
        }
        if (user.flags & 1 << 9) {
          badges.push('discordearlysupporter');
        }
        if (user.flags & 1 << 10) {
          badges.push('discordstaff');
        }
        if (user.flags & 1 << 12) {
          badges.push('SYSTEM');
        }
        if (user.flags & 1 << 14) {
          badges.push('discordbughunter2');
        }
        if (user.flags & 1 << 19) {
          badges.push('discordnitro');
        }
        if (user.flags & 1 << 20) {
          badges.push('discordmod');
        }
        if (user.flags & 1 << 21) {
          badges.push('activedeveloper');
        }
        if (user.premium_type === 1) {
          badges.push('discordnitro');
        } else if (user.premium_type === 2) {
          badges.push('1088605476788375573');
        }
        if (user.public_flags & 1 << 21) {
          badges.push('EARLY_VERIFIED_DEVELOPER');
        } 
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
