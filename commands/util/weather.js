/*
credit to : https://github.com/AdityaTD/PenguBot/master
for following code.
*/

const { RichEmbed } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const { DRAK_SKY, GOOGLE_KEY } = process.env;
const link = 'https://raw.githubusercontent.com/AdityaTD/PenguBot/master';

exports.run = async (client, msg, args) => {
	args = args.join(' ').trim().split('--');
	if(args.length < 1) return args.missing(msg, 'No location provided', this.help);
	const query = encodeURIComponent(args[0]);
	try{
		if(args.length < 2 && args[1] !== 'span'){
			const { body } = await client.snek.get('https://query.yahooapis.com/v1/public/yql')
			.query({
				q: `select * from weather.forecast where u='f' AND woeid in (select woeid from geo.places(1) where text="${args[0]}")`,
				format: 'json'
			});
			if (!body.query.count) return msg.channel.send('❌ I Could not find that location! Please try again with a different one.');
			const data = body.query.results.channel;
			const embed = new RichEmbed()
			.setColor('#0000FF')
			.setAuthor(data.title, 'https://i.imgur.com/IYF2Pfa.jpg', 'https://www.yahoo.com/news/weather')
			.setURL(data.link)
			.setTimestamp()
			.addField('🏙️ City', data.location.city, true)
			.addField('🗾 Country', data.location.country, true)
			.addField('🌍 Region', data.location.region, true)
			.addField('🌫️ Condition', data.item.condition.text, true)
			.addField('🌡️ Temperature', `${data.item.condition.temp}°F`, true)
			.addField('🌡️ Humidity', data.atmosphere.humidity, true)
			.addField('🌡️ Pressure', data.atmosphere.pressure, true)
			.addField('🌡️ Rising', data.atmosphere.rising, true)
			.addField('🛡️ Visibility', data.atmosphere.visibility, true)
			.addField('💨 Wind Chill', data.wind.chill, true)
			.addField('💨 Wind Direction', data.wind.direction, true)
			.addField('💨 Wind Speed', data.wind.speed, true);
			return msg.channel.send(embed);
		}
		const del = await msg.channel.send('Painting 🖌️');
		const res = await client.snek.get('https://maps.googleapis.com/maps/api/geocode/json')
		.query({
			address: query,
			key: GOOGLE_KEY
		}).then(x => x.body);
		if (!res.results.length) return msg.reply('❌ I Could not find that location! Please try again with a different one.');
		const geocodelocation = res.results[0].formatted_address;
		const params = `${res.results[0].geometry.location.lat},${res.results[0].geometry.location.lng}`;
		const locality = res.results[0].address_components.find(loc => loc.types.includes('locality'));
		const governing = res.results[0].address_components.find(gov => gov.types.includes('administrative_area_level_1'));
		const country = res.results[0].address_components.find(cou => cou.types.includes('country'));
		const continent = res.results[0].address_components.find(con => con.types.includes('continent'));
		const city = locality || governing || country || continent || {};
		const state = locality && governing ? governing : locality ? country : {};
		const wRes = await client.snek.get(`https://api.darksky.net/forecast/${DRAK_SKY}/${params}`)
		.query({
			exclude: 'minutely,hourly,flags',
			units: 'auto'
		}).then(x => x.body);
		const condition = wRes.currently.summary;
		const { icon } = wRes.currently;
		const chanceofrain = Math.round((wRes.currently.precipProbability * 100) / 5) * 5;
		const temperature = Math.round(wRes.currently.temperature);
		const humidity = Math.round(wRes.currently.humidity * 100);
		let theme = 'light';
		if (icon === 'snow' || icon === 'sleet' || icon === 'fog') {
			theme = 'dark';
			fontColor = '#444444';
		}
		const bg = await client.snek.get(getBase(icon)).then(x => x.body);
		const cond = await client.snek.get(`${link}/assets/weather/icons/${theme}/${icon}.png`).then(x => x.body);
		const hum = await client.snek.get(`${link}/assets/weather/icons/${theme}/humidity.png`).then(x => x.body);
		const precip = await client.snek.get(`${link}/assets/weather/icons/${theme}/precip.png`).then(x => x.body);
		const img = new Canvas(400, 180)
		.addImage(bg, 0, 0, 400, 180)
		.setColor('#FFFFFF')
		.setTextFont('20px Roboto')
		.addText(city.long_name ? city.long_name : 'Unknown', 35, 50)
		.setTextFont('16px Roboto')
		.addText(state.long_name ? state.long_name : '', 35, 72.5)
		.setTextFont('48px Roboto Mono')
		.addText(`${temperature}°`, 35, 140)
		.addImage(cond, 325, 31, 48, 48)
		.addImage(hum, 358, 88, 13, 13)
		.addImage(precip, 358, 108, 13, 13)
		.setTextAlign('right')
		.setTextFont('16px Roboto')
		.addText(condition, 370, 142)
		.setTextFont('16px \'Roboto Condensed\'')
		.addText(`${humidity}%`, 353, 100)
		.addText(`${chanceofrain}%`, 353, 121)
		.toBuffer();
		await msg.channel.send({file: {attachment: img, name: 'weather.png'}});
		await del.delete();
		return undefined;
	}catch(e){
		return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
	}
}

function getBase(icon) {
	if (icon === 'clear-day' || icon === 'partly-cloudy-day') {
		return `${link}/assets/weather/base/day.png`;
	} else if (icon === 'clear-night' || icon === 'partly-cloudy-night') {
		return `${link}/assets/weather/base/night.png`;
	} else if (icon === 'rain') {
		return `${link}/assets/weather/base/rain.png`;
	} else if (icon === 'thunderstorm') {
		return `${link}/assets/weather/base/thunderstorm.png`;
	} else if (icon === 'snow' || icon === 'sleet' || icon === 'fog') {
		return `${link}/assets/weather/base/snow.png`;
	} else if (icon === 'wind' || icon === 'tornado') {
		return `${link}/assets/weather/base/windy.png`;
	} else if (icon === 'cloudy') {
		return `${link}/assets/weather/base/cloudy.png`;
	} else {
		return `${link}/assets/weather/base/cloudy.png`;
	}
}

exports.conf = {
  aliases: ['wt'],
  clientPerm: '',
  authorPerm: 'ATTACH_FILES'
}

exports.help = {
  name: 'weather',
  description: 'Look weather in location you provided',
  usage: 'weather <location>',
  example: ['weather indonesia']
}
