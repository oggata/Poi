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