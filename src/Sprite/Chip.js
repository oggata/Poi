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
        this.coloredCnt        = 0;
        this.colorAlpha        = 0;
        this.isSetColor        = false;

        this.isSetTower        = false;

        this.coloredTime       = 1;
        this.setColoredTime();

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
        this.chipSprite.setOpacity(255*0.3);
        this.addChild(this.chipSprite);
        this.chipSprite.setPosition(0,0);
        this.chipSprite.setAnchorPoint(0.5,0.5);
        this.setPosition(posX,posY);


        if(this.type == "normal"){
            this.chipSprite.setVisible(false);
        }else{
            /*
            //モーショントラックの作成
            this.motionTrack = new Array();
            for (var i=0 ; i < 10 ; i++){
                this.cube = new Cube(i,30,40,"CHIP");
                this.motionTrack.push(this.cube);
                this.addChild(this.cube,999);
            }*/
        }

        //世界が色づいたときのマップ
        this.colored = cc.Sprite.create(s_mapchip_001_colored);
        this.colored.setOpacity(255*0);
        this.colored.setPosition(0,0);
        this.colored.setAnchorPoint(0.5,0.5);
        this.addChild(this.colored);
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
            this.coloredCnt++;
            if(this.coloredCnt>=2*this.coloredTime){
                if(this.isSetColor==false){
                    this.isSetColor=true;
                    /*
                    var frameSeq = [];
                    for (var y = 0; y <= 3; y++) {
                        for (var x = 0; x <= 4; x++) {
                            var frame = cc.SpriteFrame.create(s_effect_pipo113,cc.rect(192*x,192*y,192,192));
                            frameSeq.push(frame);
                        }
                    }
                    var wa = cc.Animation.create(frameSeq,0.1);
                    this.energyRep = cc.Repeat.create(cc.Animate.create(wa),1);
                    this.energyRep.retain();
                    this.energySprite = cc.Sprite.create(s_enargy,cc.rect(0,0,48,96));
                    this.energySprite.retain();
                    this.energySprite.setPosition(0,70);
                    this.energySprite.runAction(this.energyRep);
                    this.addChild(this.energySprite);
                    */
                    this.colored.setOpacity(255*0.8);
                }
            }
        }

        //ポイ生成マスの場合に、仲間を生成する
        if(this.game.player.targetChip){
            if(this.game.player.targetType == "CHIP"){
                if(this.game.player.targetChip.id == this.id){
                    if(this.type == "poi"){
                        if(this.hp <= 0){
                            this.game.addColleagues(1,1);
                        }
                    }
                    if(this.type == "twitter"){
                        if(this.hp <= 0){
                            this.game.addColleagues(1,2);
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

    setColoredTime:function(){
        if(this.id == 13){
            this.coloredTime       = 1;
        }
        if(this.id == 18){
            this.coloredTime       = 2;
        }
        if(this.id == 14){
            this.coloredTime       = 3;
        }
        if(this.id == 9){
            this.coloredTime       = 4;
        }
        if(this.id == 5){
            this.coloredTime       = 5;
        }
        if(this.id == 8){
            this.coloredTime       = 6;
        }
        if(this.id == 12){
            this.coloredTime       = 7;
        }
        if(this.id == 7){
            this.coloredTime       = 8;
        }
        if(this.id == 21){
            this.coloredTime       = 9;
        }
        if(this.id == 24){
            this.coloredTime       = 10;
        }
        if(this.id == 22){
            this.coloredTime       = 11;
        }
        if(this.id == 19){
            this.coloredTime       = 12;
        }
        if(this.id == 15){
            this.coloredTime       = 13;
        }
        if(this.id == 10){
            this.coloredTime       = 14;
        }
        if(this.id == 6){
            this.coloredTime       = 15;
        }
        if(this.id == 3){
            this.coloredTime       = 16;
        }
        if(this.id == 1){
            this.coloredTime       = 17;
        }
        if(this.id == 2){
            this.coloredTime       = 18;
        }
        if(this.id == 4){
            this.coloredTime       = 19;
        }
        if(this.id == 7){
            this.coloredTime       = 20;
        }
        if(this.id == 11){
            this.coloredTime       = 21;
        }
        if(this.id == 16){
            this.coloredTime       = 22;
        }
        if(this.id == 20){
            this.coloredTime       = 23;
        }
        if(this.id == 23){
            this.coloredTime       = 24;
        }
        if(this.id == 25){
            this.coloredTime       = 25;
        }
    },
});
