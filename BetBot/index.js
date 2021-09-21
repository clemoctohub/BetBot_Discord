const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
require('discord-buttons')(client); 
const { MessageButton } = require("discord-buttons");
const Bet = require('./bet.js');
const Beter = require('./beter.js');

tab_bet = []
tab_user = []
num_emoji = [":one:",":two:",":three:",":four:",":five:",":six:",":seven:",":eight:",":nine:"];

const chan = '852240146790875167';

client.on("ready", () => {
    client.users.cache.find(user => {
        tab_user.push(new Beter(user.id,user.username,user.avatarURL,1000));
    });
});

client.on('message', message => {
    //if(!message.channel == "852240146790875167") return;
    console.log(message.channel.id)
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

    if (command === 'newbet') {
        let name="",answer=[],i,options="",buttons_tab=[];
        let tabSize = tab_bet.length
        let condi = true;

        for(i=0;args[i]!="c1:";i++){
            name+=args[i]+" ";
        }

        for(i=1;condi!=false;i++){
            temp = "c"+i.toString()+":";
            if(args.includes(temp)){   
                if(args.includes("c"+(i+1).toString()+":")){
                    let phrase = args.slice(args.indexOf(temp),args.indexOf("c"+(i+1).toString()+":"));
                    const index = phrase.indexOf(temp)
                    if(index >-1)
                        phrase.splice(index,1)
                    answer.push(phrase.join(" "));
                }
                else{
                    phrase = args.slice(args.indexOf(temp))
                    const index = phrase.indexOf(temp)
                    if(index >-1)
                        phrase.splice(index,1)
                    answer.push(phrase.join(" "));
                }
            }
            else
                condi=false;
        }
        tab_bet.push(new Bet(tabSize,name,answer,[],[],[],message.member.user.id,true,0));

        for(i=0; i<answer.length; i++){
            options += num_emoji[i]+" "+answer[i]+"\n";
        }

        var newEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(name + "/ID : "+tabSize)
            .setDescription(options)
	        .setTimestamp()
	        .setFooter('Passe ton PayPal', 'https://upload.wikimedia.org/wikipedia/commons/8/88/ClientCardSample.png')
            .setThumbnail('https://45secondes.fr/wp-content/uploads/2021/04/Lhistoire-de-Stonks-le-meme-stock-qui-est-maintenant-un.jpg');
        
        
        for(i=0;i<answer.length;i++){
            const c = new MessageButton()
            .setStyle("green")
            .setLabel(answer[i])
            .setID(i+"_"+tabSize)

            buttons_tab.push(c);
        }
        

        message.channel.send("New Bet !",{
            buttons: buttons_tab,
            embed: newEmbed
        });
        
	}
    else if(command == "bet"){
        let num = checkExist(args[0])
        if(num>=0){
            if(tab_bet[num].isOpen())
                if(tab_bet[num].beterExist(message.member.user.id)){
                    let id_user = getBeter(message.member.user.id);
                    if(Number.isInteger(parseInt(args[1])) && args[1]<= tab_user[id_user].getMoney() && args[1]>0){
                        tab_user[id_user].removeMoney(args[1]);
                        tab_bet[num].addMoney(tab_user[id_user].getId(),args[1]);
                    }
                    else
                        message.channel.send("Entre un nombre correct <@"+message.member.user.id+">");
                }
                else
                    message.channel.send("Tu n'as pas encore choisi sur quoi tu paries <@"+message.member.user.id+">");
            else
                message.channel.send("Ce pari est fermé <@"+message.member.user.id+">"); 
        }
        else
            message.channel.send("Ce pari n'exite pas <@"+message.member.user.id+">");

    }
    else if(command == "flush"){
        if(message.member.hasPermission("ADMINISTRATOR"))
            tab_bet = [];
    }
    else if (command === 'info') {
        let num = checkExist(args[0])
        if(num>=0 && Number.isInteger(parseInt(args[0]))){
            let tot = tab_bet[num].getTot();
            let description = tab_bet[num].getDescription();
            const embeds = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Top parieur #'+tab_bet[num].getId())
                .setDescription(description)
                .setFooter('Argent en jeu : '+tot+' PP')
                .setTimestamp()
                .setThumbnail("");
                
            message.channel.send({
                embed: embeds
            });
        }
	}
    else if(command=="wallet"){
        let user = getBeterbyID(message.member.user.id);
        phrase="";
        for(let i=0;i<tab_bet.length;i++){
            if(tab_bet[i].isOpen())
                phrase += tab_bet[i].getUserWallet(message.member.user.id,tab_bet[i].getId());
        }
        message.reply("Tu as **"+ user.getMoney()+"** PP dans ton porte monnaie\n"+phrase);
    }
    else if(command=="close"){
        let num = checkExist(args[0])
        if(tab_bet[num].getOpener()==message.member.user.id && num>=0 && Number.isInteger(parseInt(args[0]))){
            tab_bet[num].setOpen(false);
        }
    }
    else if(command=="release"){
        let num = checkExist(args[0])
        let buttons_tab = []
        if(tab_bet[num].getOpener()==message.member.user.id && num>=0 && Number.isInteger(parseInt(args[0]))){
            tab_bet[num].setOpen(false);
            for(i=0;i<tab_bet[num].getNumberAnswer();i++){
                const c = new MessageButton()
                .setStyle("green")
                .setLabel(tab_bet[num].getChoice(i))
                .setID("answer"+i+"_"+num)
                buttons_tab.push(c);
            }
            message.channel.send("What was the correct answer ?",{
                buttons: buttons_tab
            });
        }
    }
    else if(command=="cancel"){
        let num = checkExist(args[0])
        if(tab_bet[num].getOpener()==message.member.user.id && num>=0 && Number.isInteger(parseInt(args[0]))){
            tab_bet[num].setOpen(false);
            for(let i=0;i<tab_bet[num].getNumberBeter();i++){
                let mon = tab_bet[num].getMonObO(i);
                let thUser = tab_bet[num].getUserObO(i);
                tab_user[getBeter(thUser)].addMoney(mon);
            }
        }

    }
});

client.on('clickButton', async (button) =>{
    button.defer();
    const index = button.id.indexOf("_");
    let j=0;
    if(button.id.includes("answer")){
        let description = "";
        j = button.id.slice(index+1);
        if(tab_bet[j].getOpener()==button.clicker.user.id){
            money_won = tab_bet[j].getResults(button.message.components[0].components[button.id.slice(6,index)].label);
            for(let i=0;i<money_won.length;i++){
                let id_user = tab_bet[j].getUserByOne(i,button.message.components[0].components[button.id.slice(6,index)].label);
                tab_user[getBeter(id_user)].addMoney(money_won[i]);
                let name = getBeterbyID(id_user);
                description+= name.getUsername()+" won "+money_won[i]+" PP\n";
            }
            var newEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(tab_bet[j].getName() + "/ID : "+tab_bet[j].getId())
            .setDescription(description)
            .setTimestamp();

            const channel = client.channels.cache.get(chan);
            channel.send(newEmbed);
        }
    }
    else if(index >-1){
        try{
            j = button.id.slice(index+1);
            if(tab_bet[j].isNotHere(button.clicker.user.id)){
                tab_bet[j].addbeter(getBeterbyID(button.clicker.user.id));
                tab_bet[j].addchoice(button.message.components[0].components[button.id.slice(0,index)].label);
                tab_bet[j].setGain();
            }
            else{
                button.channel.send("Tu as déja choisi ton vote ici <@"+button.clicker.user.id+">");
            }
        }
        catch(error){
            console.log(error);
        }
    }
});

function checkExist(num){
    for(let i=0; i<tab_bet.length;i++){
        if(tab_bet[i].getId()==num)
            return tab_bet[i].getId();
    }
    return -1;
}

function getBeter(id){
    for(let i=0;i<tab_user.length;i++){
        if(tab_user[i].getId()==id)
            return i;
    }
}

function getBeterbyID(id){
    for(let i=0;i<tab_user.length;i++){
        if(tab_user[i].getId()==id)
            return tab_user[i];
    }
}

function addUserMoney(id){
    for(let i=0;i<tab_user.length;i++){
        if(tab_user[i].getId()==id)
            tab_user[i].addMoney(1);
    }
}

setInterval(function(){
	client.users.cache.find(user => {
        if(user.presence.status!="offline" && user.presence.status!="idle"){
            addUserMoney(user.id);
        }
    });
    for(let i=0;i<tab_bet.length;i++){
        if(tab_bet[i].isOpen() == true){
            tab_bet[i].addttl(60);
            if(tab_bet[i].getttl()>60000){
                tab_bet[i].setOpen(false);
                const channel = client.channels.cache.get(chan);
                channel.send("Le pari : '"+tab_bet[i].getName()+"' #"+tab_bet[i].getId()+" est fermé");
            }
        }
    }
}, 60000);

client.login(config.token);