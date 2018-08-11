const { RichEmbed } = require('discord.js');

exports.run = async (client, msg, args ) => {
  const us = Date.now();
	let code = '```js\n'+ args.join(' ') +'```';
	if(args.length > 1024) code = await client.util.hastebin(args.join(' '));
  const emb = new RichEmbed()
  .setColor('#81FF00')
  .addField('📥 INPUT', code);
  
  try {
      const code = args.join(' ');
      let evaled = eval(code);

      if (typeof evaled !== 'string')
        evaled = require('util').inspect(evaled);
      let output = this.clean(evaled);
    output.replace(new RegExp(`${client.token}`, 'g'), 'You stuppid');
      if(output.length > 1024){
        const body = await client.util.hastebin(output);
        emb.addField('📤 OUTPUT', body);
      }else{
        emb.addField('📤 OUTPUT', '```\n'+ output +'```');
      }

      msg.channel.send(emb);
    } catch (err) {
      let error = this.clean(err);
      emb.setColor('#8F1000');
      if(error.length > 1024){
        const body = await client.util.hastebin(error);
        emb.addField('❌ERROR', body);
      }else{
      emb.addField('❌ERROR', '```\n'+ error +'```');
      }
      msg.channel.send(emb.setFooter(`⏱️${Date.now() - us}mμ`));
    }
}

exports.clean = (text) => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

/*
const { post } = require('node-superfetch');
async function hastebin(text){
	const { body } = await post('https://www.hastebin.com/documents').send(text);
	return `https://www.hastebin.com/${body.key}.js`
}
*/

exports.conf = {
  aliases: ['e'],
  clientPerm: '',
  authorPerm: ''
}

exports.help = {
  name: 'eval',
  description: 'evaluate javascript code',
  usage: 'eval <code>',
  example: ['eval 1+1']
}