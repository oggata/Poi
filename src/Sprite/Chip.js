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
        //this.colorAlpha        = 0;
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
        this.chipSprite      = cc.Sprite.create(s_initSprite);

        this.markerFlg = 0;
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

                //markerSprite
                this.markerFlg    = 1;
                this.markerSprite = new TargetMarker("BUILDING");
                this.addChild(this.markerSprite);

                //占領エフェクト
                var frameSeqOccupy= [];
                for (var y = 0; y <= 0; y++) {
                    for (var x = 0; x <= 7; x++) {
                        var frame = cc.SpriteFrame.create(effect_water,cc.rect(120*x,120*y,120,120));
                        frameSeqOccupy.push(frame);
                    }
                }
                this.wa = cc.Animation.create(frameSeqOccupy,0.1);
                this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
                this.occupyAnimation = cc.Sprite.create(effect_water,cc.rect(0,0,120,120));
                this.occupyAnimation.runAction(this.ra);
                this.occupyAnimation.setScale(3,3);
                this.occupyAnimation.setOpacity(255*0.8);
                this.occupyAnimation.setPosition(0,0);
                this.addChild(this.occupyAnimation);
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

        this.cutInFlg = 0;
        this.damageCnt = 0;
/*
        //崩壊
        var frameSeqEffect2= [];
        for (var y = 0; y < 1; y++) {
            for (var x = 0; x < 8; x++) {
                var frame = cc.SpriteFrame.create(effect_sand,cc.rect(120*x,60*y,120,60));
                frameSeqEffect2.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeqEffect2,0.2);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.destroyAnimation2 = cc.Sprite.create(effect_sand,cc.rect(0,0,120,60));
        this.destroyAnimation2.runAction(this.ra);
        this.destroyAnimation2.setScale(3.2,3.2);
        this.destroyAnimation2.setAnchorPoint(0.5,0.5);
        this.destroyAnimation2.setOpacity(255*0.7);
        this.addChild(this.destroyAnimation2,999999999);
        this.destroyAnimation2.setVisible(false);
*/
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

        if(this.game.isCameraRange(this.getPosition().x,this.getPosition().y)){
            this.setVisible(true);
        }else{
            this.setVisible(false);
        }

        if(this.damageCnt >= 1){
            this.damageCnt++;
            if(this.damageCnt>=30*1){
                this.damageCnt = 0;
            }
        }

        if(this.markerFlg == 1){
            this.markerSprite.update();
            if(this.damageCnt == 0){
                this.occupyAnimation.setVisible(false);
            }else{
                this.occupyAnimation.setVisible(true);
            }
        }

/*
        if(this.game.stage.isMissionClear()){
            this.destroyAnimation2.setVisible(true);
        }
*/

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
            if(this.hp <= 0){
                this.hp = 0;
                //ターゲットをnullにする
                for(var j=0;j<this.game.colleagues.length;j++){
                    if(this.game.colleagues[j].targetBuilding == this){
                        if(this.cutInFlg == 0){
                            this.cutInFlg = 1;
                            this.game.setCutIn(this);
                        }
                        //:pattern A
                        //this.game.colleagues[j].targetBuilding = null;
                        //this.game.setCutIn(this);
                    
                        //:pattern B
                        this.game.colleagues[j].hp = 0;
                    }
                }
                //this.game.setCutIn(this);
            }
            if(this.hp >= this.maxHp) this.hp = this.maxHp;
        }
    },

    damage:function(damagePoint){
        this.hp -= damagePoint;
        this.damageCnt = 1;
    },

    isOccupieType:function(){
        if(this.type == "normal"){
            return false;
        }
        return true;
    },

});
