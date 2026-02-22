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

Replace the IDs required in the config file to properly use script, multiple vc channels may be added and each user-token has a RNG to join one of the listed IDs.
Guild ID is required for the script to work.
Muted and Deafen randomize each accounts voice states, they can be unmuted, muted, or deafened by RNG. set the values to `False` in order to disable custom voice states

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

---

## Credits

This project is a remake / modified version inspired by:
https://github.com/00nx/discord-vc-spammer

Original concept and foundation by 00nx.
This version has been rewritten and adjusted with structural and functional changes.

