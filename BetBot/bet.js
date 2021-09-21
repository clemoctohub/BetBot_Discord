module.exports = class Bet{
    constructor(id,name,answer,beter,choice,gain,opener,open,ttl){
        this.id = id;
        this.name = name;
        this.answer = answer;
        this.beter = beter;
        this.choice = choice;
        this.gain = gain;
        this.opener = opener;
        this.open = open;
        this.ttl = ttl;
    }

    isNotHere(arg){
        for(let i=0;i<this.beter.length;i++){
            if(this.beter[i].getId()==arg)
                return false;
        }
        return true;
    }

    getName(){
        return this.name;
    }

    addbeter(id){
        this.beter.push(id);
    }

    addchoice(choice){
        this.choice.push(choice);
    }

    getId(){
        return this.id;
    }

    beterExist(id){
        for(let i=0;i<this.beter.length;i++){
            if(this.beter[i].getId()==id)
                return true;
        }
        return false;
    }

    setGain(){
        this.gain.push(0);
    }

    addMoney(id,money){
        for(let i=0;i<this.beter.length;i++){
            if(this.beter[i].getId()==id){
                this.gain[i]+=parseInt(money);
            }
        }
    }

    getTot(){
        let tot = 0;
        for(let i=0;i<this.gain.length;i++)
            tot+=this.gain[i];
        return tot;
    }

    getBeter(){
        return this.beter;
    }

    getDescription(){
        phrase="";
        num_emoji = [":one:",":two:",":three:",":four:",":five:",":six:",":seven:",":eight:",":nine:"];
        for(let i=0;i<this.beter.length && i<8;i++){
            phrase+=num_emoji[i] + " "+this.beter[i].getUsername()+" a parié **"+this.gain[i]+"** PP sur ***"+this.choice[i]+"***\n";
        }
        return phrase;
    }

    getUserWallet(id,id_bet){
        for(let i=0;i<this.beter.length;i++){
            if(this.beter[i].getId()==id)
                return "- You bet **"+this.gain[i]+"** PP on ***"+this.choice[i]+"*** "+" ID : **"+id_bet+"**";
        }
        return "";
    }

    getOpener(){
        return this.opener;
    }

    addttl(time){
        this.ttl+=time;
    }

    getttl(){
        return this.ttl;
    }

    setOpen(condi){
        this.open = condi;
    }

    isOpen(){
        return this.open;
    }

    getSpeChoice(i){
        return this.choice[i];
    }

    getResults(label){
        let tot=0,percent;
        let tot_win = 0;
        let money_won = [];
        for(let i=0;i<this.beter.length;i++){
            tot+=this.gain[i];
            if(this.choice[i]==label){
                tot_win+=this.gain[i];
            }
        }
        for(let i=0;i<this.beter.length;i++){
            if(this.choice[i]==label){
                percent = this.gain[i]/tot_win;
                money_won.push(percent*tot)
            }
        }
        return money_won;
    }

    getUserByOne(i,label){
        for(i;i<this.beter.length;i++){
            if(this.choice[i]==label)
                return this.beter[i].getId();
        }
    }

    getNumberAnswer(){
        return this.answer.length;
    }

    getNumberBeter(){
        return this.beter.length;
    }

    getChoice(i){
        return this.answer[i];
    }

    getUserObO(i){
        return this.beter[i];
    }

    getMonObO(i){
        return this.gain[i];
    }
}