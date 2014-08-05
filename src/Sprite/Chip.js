//
//  Chip.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Chip = cc.Node.extend({

    ctor:function (posX,posY,game,id) {
        this._super();
        this.game              = game;
        this.id                = id;
        this.isOccupied        = false;
        this.posX              = posX;
        this.posY              = posY;
        this.colorAlpha        = 0;
        this.isSetTower        = false;

        //デバッグ用の中心を表示するサインマーカー
        if(CONFIG.DEBUG_FLAG==1){
            this.sigh = cc.LayerColor.create(cc.c4b(255,0,0,255),3,3);
            this.sigh.setPosition(posX,posY);
            this.addChild(this.sigh,-9995);
        }

        //マップチップの作成(default)
        this.type            = "normal";
        this.hp              = 0;
        this.maxHp           = 0;
        this.routes          = [];
        this.enemyId         = 0;
        this.enemyDepTime    = 0;
        this.enemyDepMaxTime = 0;
        this.reproduction    = false;
        this.destroy         = false;
        this.chipSprite      = cc.Sprite.create(s_mapchip_001);

        //マップチップの作成(confに設定されている場合)
        for(var i=0;i<storage.stageDatas.length;i++){
            if(storage.stageDatas[i].id == this.id){
                this.type            = storage.stageDatas[i].type;
                this.hp              = storage.stageDatas[i].hp;
                this.maxHp           = storage.stageDatas[i].maxHp;
                this.routes          = storage.stageDatas[i].route;
                this.enemyId         = storage.stageDatas[i].enemyId;
                this.enemyDepTime    = 30 * storage.stageDatas[i].depTime;
                this.enemyDepMaxTime = 30 * storage.stageDatas[i].depMaxTime;
                this.reproduction    = storage.stageDatas[i].reproduction;
                this.destroy         = storage.stageDatas[i].destroy;
                this.img             = storage.stageDatas[i].img;
                this.chipSprite      = cc.Sprite.create(this.img);
            }
        }

        //マップ配置
        //this.chipSprite.setOpacity(255*0.3);
        this.addChild(this.chipSprite);
        this.chipSprite.setPosition(0,0);
        this.chipSprite.setAnchorPoint(0.5,0.5);
        this.setPosition(posX,posY);

        if(this.type == "normal"){
            this.chipSprite.setVisible(false);
        }
/*
        //mapNumber
        this.missionLabel = cc.LabelTTF.create(this.id,"Arial",14);
        this.addChild(this.missionLabel);
*/
        //timeNumber
        this.timeLabel = cc.LabelTTF.create("","Arial",35);
        this.addChild(this.timeLabel);
    },

    getCirclePos:function(cubeAngle){
        if(cubeAngle>=360){
            cubeAngle = 0;
        }
        var cubeRad = cubeAngle * Math.PI / 180;
        var cubeX = 50 * Math.cos(cubeRad) + this.posX;
        var cubeY = 50 * Math.sin(cubeRad) + this.posY;
        return [cubeX,cubeY];
    },

    update:function() {

        //世界が色づいたときの処理
        if(this.colorAlpha >= 1){
            this.chipSprite.setVisible(false);
            this.timeLabel.setVisible(false);
            return;
        }

        //ポイ生成マスの場合に、仲間を生成する
        if(this.game.player.targetChip){
            if(this.game.player.targetType == "CHIP"){
                if(this.game.player.targetChip.id == this.id){
                    if(this.type == "poi_red"){
                        if(this.hp <= 0){
                            this.game.addColleagues(5,1);
                        }
                    }
                    if(this.type == "poi_blue"){
                        if(this.hp <= 0){
                            this.game.addColleagues(5,2);
                        }
                    }
                    if(this.type == "poi_yellow"){
                        if(this.hp <= 0){
                            this.game.addColleagues(5,3);
                        }
                    }
                    if(this.type == "twitter"){
                        if(this.hp <= 0){
                            this.game.addColleagues(5,2);
                        }
                    }
                }
            }
        }

        //アジトとボスの場合のみ、敵を生成する
        if(this.type == "azito" || this.type == "boss"){
            var depEnemyCnt = 0;
            for(var i=0;i<this.game.enemies.length;i++){
                if(this.game.enemies[i].depChipId == this.id){
                    depEnemyCnt++;
                }
            }
            //if(depEnemyCnt == 0){
                this.enemyDepTime++;
            //}
            var nokori = Math.floor((this.enemyDepMaxTime-this.enemyDepTime)/30);
            this.timeLabel.setString("" + nokori);
            if(this.enemyDepTime >= this.enemyDepMaxTime){
                if(this.type == "azito"){
                    this.enemyDepTime = 0;
                    this.game.addEnemyByPos(this.enemyId,this.routes);
                }
                if(this.type == "boss"){
                    this.enemyDepTime = 0;
                    this.game.addEnemyByPos(this.enemyId,this.routes);
                }
            }
        }

        //プレイヤーが占領する
        if(this.isOccupied == false && this.hp <= 0){
            //SE
            //playSE(s_se_occupied);
            if(this.type == "tree"){  
                this.isOccupied = true;
                this.game.storage.occupiedCnt++;
                //this.game.setTerritoryCnt();
                //占領ミッションの場合はカットインを表示する
                if(this.game.storage.missionGenre == "occupy"){
                    this.game.cutIn.set_text(
                        "占領した!.[" + this.game.territoryCnt + "]"
                    );
                }
            }
        }

        //再生可能な場合は、0まで行ったらまた戻る
        if(this.reproduction==true){
            if(this.hp <= 0) this.hp = this.maxHp;
            if(this.hp >= this.maxHp) this.hp = this.maxHp;
        }else{
            if(this.hp <= 0)   this.hp = 0;
            if(this.hp >= this.maxHp) this.hp = this.maxHp;
        }
    },

    isOccupieType:function(){
        if(this.type == "normal"){
            return false;
        }
        return true;
    },

});
