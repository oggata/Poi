//
//  Colleague.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Colleague = cc.Node.extend({
    ctor:function (game,type) {
        this._super();
        this.game              = game;
        this.storage           = this.game.storage;
        this.player            = this.game.player;
        this.flashCnt          = 0;
        this.isCharaVisible    = true;
        this.damageCnt         = 0;
        this.isDamageOn        = false;
        this.actionType        = "none";
        this.randId            = getRandNumberFromRange(1,19);
        this.randId2           = getRandNumberFromRange(1,10);
        //status
        this.lv                = this.storage.lv;
        this.hp                = this.storage.hp;
        this.maxHp             = this.storage.maxHp;
        this.attack            = this.storage.attack;
        this.defence           = this.storage.defence;
        this.eyeSightRange     = 20;
        this.walkSpeed         = this.storage.walkSpeed;
        this.createCot         = this.storage.createCot;
        //image
        this.charactorCode     = this.storage.charactorCode;
        this.imgWidth          = this.storage.imgWidth; 
        this.imgHeight         = this.storage.imgHeight;

        this.type = type;
        if(type == 1){
            this.image         = s_chara001;
            this.attackType    = "JUMP";
            this.followType    = "DEFENCE";
        }else if(type == 2){
            this.image         = s_chara002;
            this.attackType    = "BULLET";
            this.followType    = "DEFENCE";
        }else if(type == 3){
            this.image         = s_chara003;
            this.attackType    = "BULLET";
            this.followType    = "NORMAL";   
        }

        //init
        this.direction         = "front";
        this.initSprite();
        this.damangeTexts      = new Array();
        this.directionCnt      = 0;
        this.beforeX           = this.getPosition().x;
        this.beforeY           = this.getPosition().y;
        this.isWait            = false;
        this.bulletLncTime     = getRandNumberFromRange(1,90);
        this.jumpTime          = 0;
        this.jumpY             = 0;
        this.jumpYDirect       = "up";
        this.waitCnt           = 0;
        this.waitMaxCnt        = this.randId * 10;

        this.battleIntervalToEnemy = 0;
        this.targetEnemy       = null;
        this.targetBuilding    = null;
    },
    
    remove:function() {
        this.removeChild(this.sprite);
        //this.removeChild(this.gauge);
        //damage text
        for(var i=0;i<this.damangeTexts.length;i++){
            this.removeChild(this.damangeTexts[i]);
        }
    },

    addFlashCnt:function(){
        this.flashCnt++;
        if(this.flashCnt>=3){
            this.flashCnt=0;
            if(this.isCharaVisible == true){
                this.isCharaVisible = false;
                this.sprite.setOpacity(255*0.2);
            }else{
                this.isCharaVisible = true;
                this.sprite.setOpacity(255*1);
            }
        }
    },

    moveToEscapeZone:function(){
        this.waitCnt++;
        if(this.waitCnt>= this.waitMaxCnt){
            this.moveToPositions(
                this.game.stage.escape.getPosition().x,
                this.game.stage.escape.getPosition().y,
                0
            );
        }
        if(this.game.stage.escape.getPosition().x - 50 <= this.getPosition().x
            && this.getPosition().x <= this.game.stage.escape.getPosition().x + 50
            && this.game.stage.escape.getPosition().y - 50 <= this.getPosition().y
            && this.getPosition().y <= this.game.stage.escape.getPosition().y + 50
        ){
            this.hp = 0;
        }
    },

    moveToEnemy:function(){
        this.actionType = "ENEMY";

        if(this.attackType == "JUMP"){
            this.moveToPositions(
                this.targetEnemy.getPosition().x + this.targetEnemy.markerSprite.enemyMotionTrack[this.randId].rollingCube.getPosition().x,
                this.targetEnemy.getPosition().y + this.targetEnemy.markerSprite.enemyMotionTrack[this.randId].rollingCube.getPosition().y,
                1
            );
        }else if(this.attackType == "BULLET"){
            this.moveToPositions(
                this.targetEnemy.getPosition().x + this.targetEnemy.markerSprite.enemyFarMotionTrack[this.randId].rollingCube.getPosition().x,
                this.targetEnemy.getPosition().y + this.targetEnemy.markerSprite.enemyFarMotionTrack[this.randId].rollingCube.getPosition().y,
                1
            );
        }
    },

    moveToBuilding:function(){
        this.actionType = "CHIP";

        this.moveToPositions(
            this.targetBuilding.getPosition().x + this.targetBuilding.markerSprite.mapMotionTrack[this.randId].rollingCube.getPosition().x,
            this.targetBuilding.getPosition().y + this.targetBuilding.markerSprite.mapMotionTrack[this.randId].rollingCube.getPosition().y,
            0
        );
/*
        if(this.followType=="NORMAL"){
            this.moveToPositions(
                this.targetBuilding.getPosition().x + this.targetBuilding.markerSprite.mapMotionTrack[this.randId].rollingCube.getPosition().x,
                this.targetBuilding.getPosition().y + this.targetBuilding.markerSprite.mapMotionTrack[this.randId].rollingCube.getPosition().y,
                0
            );
        }else if(this.followType=="DEFENCE"){
            this.moveToPositions(
                this.targetBuilding.getPosition().x + this.targetBuilding.markerSprite.weaponMotionTrack[this.randId].rollingCube.getPosition().x,
                this.targetBuilding.getPosition().y + this.targetBuilding.markerSprite.weaponMotionTrack[this.randId].rollingCube.getPosition().y,
                0
            );
        }
*/
    },

    setFly:function(){
        if(this.game.isFly == true){
            this.jumpY+=3;
            if(this.jumpY >= this.randId*10 - 10){
                this.jumpY = this.randId*10 - 10;
                this.jumpTime++;
                if(this.jumpTime >= 30 * 0.5){
                    this.setPosition(
                        this.game.player.getPosition().x + getRandNumberFromRange(1,40) - 20,
                        this.game.player.getPosition().y + getRandNumberFromRange(1,40) - 20
                    );
                }
            }
        } else {
            this.sprite.setOpacity(255*1);
            this.jumpTime = 0;
            this.sprite.setVisible(true);
            this.shadow.setVisible(true);
            this.jumpY-=3;
            if(this.jumpY < 0){
                this.jumpY = 0;
            }
        }
    },

    update:function() {
        this.setFly();

        this.sprite.setPosition(0,this.jumpY);

        //攻撃タイプが弾丸だった場合は、一定時間毎に弾丸を発射する
        if(this.targetEnemy != null && this.attackType == "BULLET"){
            this.bulletLncTime++;
            if(this.bulletLncTime>=30*3){
                this.bulletLncTime = 0;
                this.game.addColleagueBullet(this.targetEnemy,this);
            }
        }

        if(this.isDamageOn == true){
            this.addFlashCnt();
            this.damageCnt++;
            if(this.damageCnt>=50){
                this.damageCnt = 0;
                this.isDamageOn = false;
                this.sprite.setOpacity(255*1);
            }
        }

        if(this.hp == 0){
            this.remove();
            return false;
        }

        //目標を達成した後には、皆エスケープゾーンに向かって走る
        if(this.game.stage.isColored == true){
            this.moveToEscapeZone();
        }else{
            if(this.targetEnemy != null){
                this.moveToEnemy();
            }else if(this.targetBuilding != null){
                this.moveToBuilding();
            }else{
                this.actionType = "FOLLOW";
                this.moveTo(this.player);
            }
        }

        //向きの制御
        this.directionCnt++;
        if(this.directionCnt >= 5){
            this.directionCnt = 0;
            this.setDirection(this.beforeX,this.beforeY);
            this.beforeX = this.getPosition().x;
            this.beforeY = this.getPosition().y;
        }

        return true;
    },

    damage:function(damagePoint) {
        playSE(s_se_attack);
        this.hp = this.hp - damagePoint;
        if(this.hp < 0){
            this.hp = 0;
        }
        this.isDamageOn = true;
    },

    getDirection:function(){
        return this.direction;
    },

    initSprite:function(){
        //足下の影
        this.shadow = cc.Sprite.create(s_shadow);
        this.shadow.setPosition(0,-8);
        this.shadow.setOpacity(255*0.4);
        this.addChild(this.shadow);

        var frameSeq = [];
        for (var i = 0; i < 3; i++) {
            //96/3,194/4
            var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*0,this.imgWidth,this.imgHeight));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq,0.2);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image,cc.rect(0,0,this.imgWidth,this.imgHeight));
        this.sprite.runAction(this.ra);
        this.addChild(this.sprite);

        //デバッグ
        if(CONFIG.DEBUG_FLAG==1){
            this.sigh = cc.LayerColor.create(cc.c4b(255,0,0,255),3,3);
            this.sigh.setPosition(0,0);
            this.addChild(this.sigh);
        }
    },

    moveTo:function(player) {
        this.jumpYDirect = "up";
        var dX = this.game.player.getPosition().x - this.getPosition().x;
        var dY = this.game.player.getPosition().y - this.getPosition().y;
        var rad = Math.atan2(dX,dY);
        var speedX = this.walkSpeed * Math.sin(rad);
        var speedY = this.walkSpeed * Math.cos(rad);
        this.setPosition(
            this.getPosition().x + speedX,
            this.getPosition().y + speedY
        );
    },

    moveToPositions:function(posX,posY,jumpType) {
        if(jumpType==1 && this.attackType == "JUMP"){
            if(this.jumpYDirect=="up"){
                this.jumpY+=5;
                if(this.jumpY >= this.randId2*5 + 20){
                    this.jumpY = this.randId2*5 + 20;
                    this.jumpYDirect="down";
                }
            }else if(this.jumpYDirect=="down"){
                this.jumpY-=15;
                if(this.jumpY <= 0){
                    this.jumpY = 0;
                    this.jumpYDirect="up";
                }
            }
        }
        var dX = posX - this.getPosition().x;
        var dY = posY - this.getPosition().y;
        //if(Math.abs(dX)>3 && Math.abs(dY)>3){
            var rad = Math.atan2(dX,dY);
            var speedX = this.walkSpeed * Math.sin(rad);
            var speedY = this.walkSpeed * Math.cos(rad);
            this.setPosition(
                this.getPosition().x + speedX,
                this.getPosition().y + speedY
            );
        //}
    },

    setDirection:function(DX,DY){
        //横の距離が大きいとき
        var diffX = Math.floor(this.getPosition().x - DX);
        var diffY = Math.floor(this.getPosition().y - DY);
        if(diffX > 0 && diffY > 0){
            this.walkRightUp();
        }
        if(diffX > 0 && diffY < 0){
            this.walkRightDown();
        }
        if(diffX < 0 && diffY > 0){
            this.walkLeftUp();
        }
        if(diffX < 0 && diffY < 0){
            this.walkLeftDown();
        }
    },

    walkLeftDown:function(){
        if(this.direction != "front"){
            this.direction = "front";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*0,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },

    walkRightDown:function(){
        if(this.direction != "left"){
            this.direction = "left";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*1,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },

    walkLeftUp:function(){
        if(this.direction != "right"){
            this.direction = "right";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*2,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },

    walkRightUp:function(){
        if(this.direction != "back"){
            this.direction = "back";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*3,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },

});