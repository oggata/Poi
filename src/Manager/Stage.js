//
//  Stage.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Stage = cc.Class.extend({

    ctor:function (game) {
        this.game             = game;
        this.storage          = this.game.storage;
        this.chips            = [];
        this.trees            = [];
        this.status           = "GAMING";

        this.clearTargetCnt   = 0;
        this.field = cc.Sprite.create(s_field);
        this.field.setPosition(795,318);
        this.game.mapNode.addChild(this.field);
        this.escape = cc.Sprite.create(s_scape_zone);
        this.escape.setPosition(800,560);
        this.game.mapNode.addChild(this.escape);
        var excludeNums = [];
        var items = [];
        for(var i=0;i<game.storage.stageItems.length;i++){            
            var type  = game.storage.stageItems[i]["type"];
            var count = game.storage.stageItems[i]["count"];
            for(var j=0;j<count;j++){
                var num = getRandNumberFromRangeAndExcludeNumbers(1,25,excludeNums);
                var obj = {"type":type,"count":count,"chipNum":num};
                items.push(obj);
                excludeNums.push(num);
            }
        }

        //床のマップチップを張る
        var chipNum = 1;
        var stageBaseNum = 0;
        for (var j=0 ; j< 9 ; j++){
            for(var i=0 ; i < 9 ; i++){
                if(CONFIG.STAGE_BASE[stageBaseNum] == 1){

                    //奇数行と偶数行で列の位置をずらす
                    if(Math.floor(j%2)==0){
                        var posX = 150 * i + 60;
                        var posY = (105) * j;
                    }else{
                        var posX = 150/2 + Math.floor(150 * i) + 60;
                        var posY = (105) * j;  
                    }

                    //マップチップを張る
                    this.chipSprite = new Chip(posX,posY,this.game,chipNum);
                    this.game.mapNode.addChild(this.chipSprite);
                    this.chips.push(this.chipSprite);

                    //目印になるタワーを建てる
                    if(this.chipSprite.type == "poi_red"){
                        this.tree = new Tower(posX,posY,this.game,2);
                        this.game.mapNode.addChild(this.tree,1000 - posY);
                        this.tree.setPosition(posX,posY);
                        this.trees.push(this.tree);
                    }else if(this.chipSprite.type == "poi_blue"){
                        this.tree = new Tower(posX,posY,this.game,3);
                        this.game.mapNode.addChild(this.tree,1000 - posY);
                        this.tree.setPosition(posX,posY);
                        this.trees.push(this.tree);
                    }else if(this.chipSprite.type == "poi_yellow"){
                        this.tree = new Tower(posX,posY,this.game,4);
                        this.game.mapNode.addChild(this.tree,1000 - posY);
                        this.tree.setPosition(posX,posY);
                        this.trees.push(this.tree);
                    }else if(this.chipSprite.type == "tree"){
                        this.tree = new Tower(posX,posY,this.game,1);
                        this.game.mapNode.addChild(this.tree,1000 - posY);
                        this.tree.setPosition(posX,posY);
                        this.trees.push(this.tree);
                    }else{
                        this.tree = new Tower(posX,posY,this.game,999);
                        this.game.mapNode.addChild(this.tree,1000 - posY);
                        this.trees.push(this.tree);
                    }
                    if(this.chipSprite.type == "tree"){
                        this.clearTargetCnt++;
                    }
                    chipNum++;
                }
                stageBaseNum++;
            }
        }

        for(var i=0;i<this.trees.length;i++){
            //zソートする
            this.game.mapNode.reorderChild(
                this.trees[i],
                Math.floor(1000 - this.trees[i].getPosition().y)
            );
        }
    },

    update:function(){

        //エスケープゾーンに逃げ込んだ時の処理
        if(
            this.escape.getPosition().x - 50 <= this.game.player.getPosition().x &&
            this.game.player.getPosition().x <= this.escape.getPosition().x + 50 &&
            this.escape.getPosition().y - 50 <= this.game.player.getPosition().y &&
            this.game.player.getPosition().y <= this.escape.getPosition().y + 50
        ){
            this.setGameClearStatus();
        }

        //ミッションの種類によってクリア条件を変更する
        if(storage.missionGenre == "INCREASE"){
            if(this.game.getColleagueCnt() >= storage.missionMaxCnt){
                this.setMissionClearStatus();
            }
        }
        if(storage.missionGenre == "KILLENEMY"){
            if(this.game.killedEnemyCnt >= storage.missionMaxCnt){
                this.setMissionClearStatus();
            }
        }
        if(storage.missionGenre == "OCCUPY"){
            var cnt = this.getTerritoryCnt();
            if(cnt >= storage.missionMaxCnt){
                this.setMissionClearStatus();
            }
        }

        for(var i=0;i<this.chips.length;i++){
            this.chips[i].update();

            if(this.chips[i].type == "poi_red" || this.chips[i].type == "poi_blue" || this.chips[i].type == "poi_yellow"){
                this.trees[i].update();
            }
            if(this.chips[i].type == "tree"){
                //占領が完了した場合に木がたつ
                if(this.chips[i].isOccupied == true && this.chips[i].type == "tree"){
                    this.trees[i].setVisible(false);
                }
                this.trees[i].update();
            }
        }
    },

    //<-------ステータス制御---------> GAMING->MISSIONCLEAR->GAMECLEAR

    setGameOverStatus:function(){
        if(this.status == "GAMING"){
            this.status = "GAMEOVER";
        }
    },

    setGameClearStatus:function(){
        if(this.status == "MISSIONCLEAR"){
            this.status = "GAMECLEAR";
        }
    },

    setMissionClearStatus:function(){
        if(this.status == "GAMING"){
            this.setMissionClearEvent();
            this.status = "MISSIONCLEAR";
        }
    },

    setMissionClearEvent:function(){
        for(var i=0;i<this.game.storage.clearedEnemies.length;i++){
            var enemyData = this.game.storage.clearedEnemies[i];
            this.game.addEnemyByPos(enemyData["enemyId"],enemyData["route"]);
        }
        for(var i=0;i<this.game.enemies.length;i++){
            this.game.enemies[i].eyeSight = 1000;
            this.game.enemies[i].walkSpeed = 2;
        }
        /*
        for(var i=0;i<this.chips.length;i++){
            var pos = this.chips[i].getPosition();
            this.game.stage.addCoin(pos.x,pos.y);
            this.chips[i].isOccupied = false;
            if(this.chips[i].colorAlpha == 0){
                this.chips[i].colorAlpha=1;
            }
        }*/
    },

    isGameOver:function(){
        if(this.status == "GAMEOVER") return true;
        return false;
    },

    isGameClear:function(){
        if(this.status == "GAMECLEAR") return true;
        return false;
    },

    isMissionClear:function(){
        if(this.status == "MISSIONCLEAR") return true;
        return false;
    },

    //<----Getter------>
    getChipByTypeID:function(chipType){
        var rtnChip = null;
        for(var i=0;i<this.chips.length;i++){
            if(this.chips[i].type == chipType){
                rtnChip = this.chips[i];
            }
        }
        return rtnChip;
    },

    getChipPosition:function(id){
        for(var i=0;i<this.chips.length;i++){
            if(this.chips[i].id == id){
                return [
                    this.chips[i].getPosition().x,
                    this.chips[i].getPosition().y
                ];
            }
        }
        return [0,0];
    },

    getTerritoryCnt:function(){
        var cnt = 0;
        for(var i=0;i<this.chips.length;i++){
            if(this.chips[i].isOccupied == true){
                cnt++;
            }
        }
        return cnt;
    },

    getMaxTerritoryCnt:function(){
        return CONFIG.MAX_X_CNT * CONFIG.MAX_Y_CNT;
    },

    addCoin:function(x,y){
        var randNum = getRandNumberFromRange(1,5)
        var power = 1;
        if(randNum == 1) power = 5;
        var coin = new Coin("HEART",power);
        this.game.mapNode.addChild(coin,999);
        coin.set_position(x,y);
        this.game.coins.push(coin);
    },
});

