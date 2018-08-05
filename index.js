const { ShardingManager } = require('discord.js');
const shard = new ShardingManager('./yo.js',{
  totalShards: 1,
  token: process.env.TOKEN
});

shard.on('launch', pecahan => {
  console.log(`💎Launching Shard ${pecahan.id} [ ${pecahan.id + 1} of ${shard.totalShards} ]`);
});
shard.on('message', (pecahan, msg) => {
  console.log(`[${new Date().toString().split(" ", 5).join(" ")}] #${pecahan.id} | ${msg._eval} | ${pecahan._result}`);
});
shard.spawn();

//require('./server.js');

process.on('unhandledRejection', e => console.error(e))
.on('uncaughtException', e => console.error(e));
