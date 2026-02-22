# Multi Token VC Joiner

Join multiple Discord accounts into configured voice channels using user tokens and WebSocket connections.

---

## Features

- Validates tokens before use  
- Fetches display names automatically  
- Randomizes voice channel selection  
- Random self-mute / self-deaf states  
- Automatic reconnect on disconnect  
- Lightweight and fast startup  

---

## Requirements

- Node.js 18+  
- Dependencies:
  - `axios`
  - `ws`

Install:

npm install axios ws

---

## Setup

### 1. tokens.txt

Add one Discord user token per line

---

### 2. config.json

{
  "GUILD_ID": "your_guild_id",
  "VC_CHANNELS": [
    "vc_channel_id_1",
    "vc_channel_id_2"
  ]
}

---

## Usage

node index.js

The script will:

1. Sort and validate tokens  
2. Log valid accounts  
3. Assign each account a voice channel  
4. Connect via Discord Gateway  
5. Auto-reconnect if disconnected  

---

## How It Works

- Uses Discord REST API (/users/@me) to validate tokens  
- Connects to wss://gateway.discord.gg  
- Authenticates using opcode 2  
- Sends voice state update (opcode 4)  
- Maintains heartbeat interval  
- Reconnects after 5 seconds on close  

---

## Configuration Notes

- VC_CHANNELS rotates randomly per token  
- If only one channel is provided, all tokens join that channel  
- Self mute/deaf is randomized  

---

## File Structure

.
├── index.js
├── config.json
└── tokens.txt

---

## Disclaimer

This project uses user tokens. Misuse may result in account termination.
