const axios = require('axios');
const fs = require('fs');
const WebSocket = require('ws');
const config = require('./config.json');

const filepath = './tokens.txt';

function sort(filepath) {
  const fileContent = fs.readFileSync(filepath, 'utf-8'); 
  return fileContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .sort();
}

async function get_display_name(token) {
  try {
    const res = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: token }
    });
    return res.data.global_name || res.data.username;
  } catch {
    return 'Unknown';
  }
}

async function get_user_id(token) {
  try {
    const res = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: token }
    });
    return res.data.id;
  } catch {
    return null;
  }
}

async function checkTokens(tokens) {
  const validTokens = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    try {
      const res = await axios.get('https://discord.com/api/v10/users/@me', {
        headers: { Authorization: token }
      });
      const displayName = res.data.global_name || res.data.username;
      console.log(`Valid Token: ${displayName}`);
      validTokens.push({ token, displayName });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error(`Token ${i + 1} is invalid`);
      } else {
        console.error(`Error checking token ${i + 1}:`, error.message);
      }
    }
  }
  return validTokens;
}

function get_random_vc(exclude) {
  if (config.VC_CHANNELS.length === 1) return config.VC_CHANNELS[0];
  const options = config.VC_CHANNELS.filter(vc => vc !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

function get_random_mute_deaf_mode() {
  const mode = Math.floor(Math.random() * 3);
  return {
    self_mute: mode === 0 || mode === 1,
    self_deaf: mode === 1
  };
}

function ws_joiner(user_token, target_channel_id) {
  const { token, displayName, user_id } = user_token;
  const ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');

  const auth = {
    op: 2,
    d: {
      token: token,
      properties: {
        $os: 'Linux',
        $browser: 'Firefox',
        $device: 'desktop'
      }
    }
  };

  let heartbeatInterval;
  let joined = false;

  ws.on('open', () => {
    ws.send(JSON.stringify(auth));
  });

  ws.on('message', data => {
    const message = JSON.parse(data);

    if (message.op === 10) {
      const interval = message.d.heartbeat_interval;
      heartbeatInterval = setInterval(() => {
        ws.send(JSON.stringify({ op: 1, d: null }));
      }, interval);
    }

    if (message.t === 'READY' && !joined) {
      joined = true;
      const mode = get_random_mute_deaf_mode();

      const vc = {
        op: 4,
        d: {
          guild_id: config.GUILD_ID,
          channel_id: target_channel_id,
          self_mute: mode.self_mute,
          self_deaf: mode.self_deaf
        }
      };

      setTimeout(() => {
        ws.send(JSON.stringify(vc));
        console.info(`${displayName} joined VC ${target_channel_id}`);
      }, 1000);
    }

    if (message.op === 1) {
      ws.send(JSON.stringify({ op: 1, d: null }));
    }
  });

  ws.on('close', () => {
    clearInterval(heartbeatInterval);
    console.info(`${displayName} disconnected. Rejoining ${target_channel_id} in 5s...`);
    setTimeout(() => ws_joiner(user_token, target_channel_id), 5000);
  });

  ws.on('error', err => {
    console.error(`WebSocket error (${displayName}):`, err.message);
  });

  ws.on('ping', () => {
    ws.pong();
  });
}

async function main() {
  const tokens = sort(filepath);
  const validTokens = await checkTokens(tokens);

  let last_vc = null;

  for (const user_token of validTokens) {
    user_token.user_id = await get_user_id(user_token.token);
    const next_vc = get_random_vc(last_vc);
    last_vc = next_vc;

    await new Promise(resolve => setTimeout(resolve, 100));
    ws_joiner(user_token, next_vc);
  }
}

main();
