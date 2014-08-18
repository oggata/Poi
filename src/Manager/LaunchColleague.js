var launchColleague = cc.Class.extend({
    ctor:function (game) {
        this.game = game;
        this.depColleagues = new Array();
        this.depTimeCnt = 0;
        for(var i=0;i<this.game.storage.colleagues.length;i++){
            for(var j=0;j<this.game.storage.colleagues[i]["count"];j++){
                var depID = "";
                if(this.game.storage.colleagues[i]["colleagueId"] == 1){
                    depID = "poi_red";
                }else if(this.game.storage.colleagues[i]["colleagueId"] == 2){
                    depID = "poi_blue";
                }else if(this.game.storage.colleagues[i]["colleagueId"] == 3){
                    depID = "poi_yellow";
                }
                var depColleague = {
                    "typeId" : this.game.storage.colleagues[i]["colleagueId"],
                    "depId"  : depID
                }
                this.depColleagues.push(depColleague);
            }
        }
    },

    update:function(dt){
        this.depTimeCnt++;
        if(this.depTimeCnt>=5){
            var depChip = this.game.stage.getChipByTypeID("poi_red");
            for(var i=0;i<this.depColleagues.length;i++){
                this.game.addColleagues(
                    1,
                    this.depColleagues[0]["typeId"],
                    this.game.stage.getChipByTypeID(this.depColleagues[0]["depId"])
                );
                this.depColleagues.splice(i,1);
                break;
            }
            this.depTimeCnt = 0;
        }
    },

    isDepLaunchFinished:function(){
        if(this.depColleagues.length > 0){
            return false;
        }
        return true;
    }
});


var setTargetBuilding = function(game){
    //全部の仲間のターゲットタイプを変更する
    for(var i=0;i<game.colleagues.length;i++){
        //既に戦闘中をのぞき、launchしたいコードを選別
        if(game.colleagues[i].isTargetFollowPlayer()){
            if(game.colleagues[i].type == game.launchColleagueType){
                game.colleagues[i].targetBuilding = game.player.targetChip;
                game.colleagues[i].launchTimeCnt = 0;
                //配列の最後に追加する
                game.colleagues.push(game.colleagues[i]);
                game.colleagues.splice(i,1);
                break;
            }
        }
    }
};

var setTargetEnemy = function(game){
    //全部の仲間のターゲットタイプを変更する
    for(var i=0;i<game.colleagues.length;i++){
        //既に戦闘中をのぞき、launchしたいコードを選別
        if(game.colleagues[i].isTargetFollowPlayer()){
            if(game.colleagues[i].type == game.launchColleagueType){
                game.colleagues[i].targetEnemy = game.player.targetEnemy;
                game.colleagues[i].launchTimeCnt = 0;
                //配列の最後に追加する
                game.colleagues.push(game.colleagues[i]);
                game.colleagues.splice(i,1);
                break;
            }
        }
    }
};