const { RichEmbed } = require('discord.js');
const figlet = require('figlet');

exports.run = async (client, msg, args) => {
  
   var maxLen = 14 // You can modify the max characters here
  
  if(args.join(' ').length > maxLen) return msg.channel.send({embed: {
                                                           color: 0xfc0f0f, 
                                                           description: `${msg.author} Only 14 characters admitted!`
                                                          }});
  
  if(args.length < 1) return args.missing(msg, 'No text provided', this.help);
  
  figlet(`${args.join(' ')}`, function(err, data) {
      if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
      }
    
    let embed = new RichEmbed() 
     .setColor('RANDOM') 
     .setDescription(`\`\`\`${data}\`\`\``, {code: 'AsciiArt'});

      msg.channel.send(embed)
  });
}

exports.conf = {
  aliases: ['ascii', 'unik'],
  clientPerm: '',
  authorPerm: ''
}

exports.help = {
  name: 'asciify',
  description: 'Convert text to ascii',
  usage:'asciify <text>',
  example: ['asciify morning']
}