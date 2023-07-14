const express = require('express');
const app = express();
const { Client, Events, GatewayIntentBits } = require('discord.js');
const config = require("./config.json")

const client = new Client({ intents: [GatewayIntentBits.Guilds] });


client.on('ready', () => {
  console.log(`Bot está online com o usuário ${client.user.tag}`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//informacoes do usuario por get.
app.get('/userinfo/:userId', async (req, res) => {
  const userId = req.params.userId;
  const user = await client.users.fetch(userId);

  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }

  const avatarURL = user.avatarURL({ format: 'png', dynamic: true, size: 1024 });
  const username = user.username;
  const id = user.id

  const userInfo = {
    avatarURL,
    username,
    id,
  };

  res.json(userInfo);
});

client.login(config.token);

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
