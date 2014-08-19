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
        this.flashCnt          = 0;
        this.isCharaVisible    = true;
        this.damageCnt         = 0;
        this.isDamageOn        = false;

        this.randId            = getRandNumberFromRange(1,10);
        this.randId2           = getRandNumberFromRange(1,10);
        //status
        this.lv                = this.game.storage.lv;
        this.hp                = this.game.storage.hp;
        this.maxHp             = this.game.storage.maxHp;
        this.attack            = this.game.storage.attack;
        this.defence           = this.game.storage.defence;
        this.walkSpeed         = this.game.storage.walkSpeed;
        this.createCot         = this.game.storage.createCot;
        //image
        this.charactorCode     = this.game.storage.charactorCode;
        this.imgWidth          = this.game.storage.imgWidth; 
        this.imgHeight         = this.game.storage.imgHeight;

        this.type = type;
        if(this.type == 1){
            this.image            = s_chara001;
            this.attackMotionCode = "JUMP";
        }else if(this.type == 2){
            this.image            = s_chara002;
            this.attackMotionCode = "BULLET";
        }else if(this.type == 3){
            this.image            = s_chara003;
            this.attackMotionCode = "BULLET";  
        }
        /*
        if(this.type == 1){
            this.image            = s_chara008;
            this.imgWidth          = 72/3; 
            this.imgHeight         = 112/4;
            this.attackMotionCode = "JUMP";
        }else if(this.type == 2){
            this.image             = s_chara009;
            this.imgWidth          = 72/3; 
            this.imgHeight         = 120/4;
            this.attackMotionCode = "BULLET";
        }else if(this.type == 3){
            this.image             = s_chara003;
            this.imgWidth          = this.game.storage.imgWidth; 
            this.imgHeight         = this.game.storage.imgHeight;
            this.attackMotionCode = "BULLET";  
        }
        */
        //init
        this.initSprite();
        //this.damangeTexts      = new Array();
        //方向制御用
        this.direction         = "front";
        this.directionCnt      = 0;
        this.beforeX           = this.getPosition().x;
        this.beforeY           = this.getPosition().y;
        this.isWait            = false;
        this.bulletLncTime     = getRandNumberFromRange(1,90);
        //ジャンプさせるための位置
        this.jumpTime          = 0;
        this.jumpY             = 0;
        this.jumpYDirect       = "up";
        //脱出時の順番
        this.escapeWaitCnt     = 0;
        this.escapeWaitMaxCnt  = this.randId * 10;
        //敵との戦闘
        this.battleIntervalToEnemy = 0;
        this.targetEnemy       = null;
        this.targetBuilding    = null;
        //マップ上の位置

        //レンダリング用
        this.renderingCnt      = getRandNumberFromRange(1,5);
        this.renderingMaxCnt   = 1;
        this.isStop = false;

        this.launchTimeCnt = 0;
    },

    setPos:function(mapX,mapY){
        this.mapX  = mapX;
        this.mapY  = mapY;
        this.setPosition(mapX,mapY);
    },
    
    remove:function() {
        this.removeChild(this.sprite);
        //this.removeChild(this.gauge);
        //damage text
        /*
        for(var i=0;i<this.damangeTexts.length;i++){
            this.removeChild(this.damangeTexts[i]);
        }*/
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
        this.escapeWaitCnt++;
        if(this.escapeWaitCnt>= this.escapeWaitMaxCnt){
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
        if(this.attackMotionCode == "JUMP"){
            this.moveToPositions(
                this.targetEnemy.getPosition().x + this.targetEnemy.markerSprite.enemyMotionTrack[this.randId].rollingCube.getPosition().x,
                this.targetEnemy.getPosition().y + this.targetEnemy.markerSprite.enemyMotionTrack[this.randId].rollingCube.getPosition().y,
                1
            );
        }else if(this.attackMotionCode == "BULLET"){
            this.moveToPositions(
                this.targetEnemy.getPosition().x + this.targetEnemy.markerSprite.enemyFarMotionTrack[this.randId].rollingCube.getPosition().x,
                this.targetEnemy.getPosition().y + this.targetEnemy.markerSprite.enemyFarMotionTrack[this.randId].rollingCube.getPosition().y,
                1
            );
        }
    },

    moveToBuilding:function(){
        this.moveToPositions(
            this.targetBuilding.getPosition().x + this.targetBuilding.markerSprite.mapMotionTrack[this.randId].rollingCube.getPosition().x,
            this.targetBuilding.getPosition().y + this.targetBuilding.markerSprite.mapMotionTrack[this.randId].rollingCube.getPosition().y,
            0
        );
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

    setLaunchMotion:function(){
        if(this.launchTimeCnt>=1){
            this.depAnimation.setVisible(true);
            this.launchTimeCnt++;
            if(this.launchTimeCnt>=30*3){
                this.depAnimation.setVisible(false);
            }
        }
        /*
        //出発時に飛び出す
        this.launchTimeCnt++;
        if(this.launchTimeCnt <= 30 * 1){
            this.jumpY+=5;
        }else{
            this.launchTimeCnt = 999;
            this.jumpYDirect="up";
            this.jumpY = 0;
        }*/
    },

    update:function() {

        if(this.game.isCameraRange(this.mapX,this.mapY)){
            this.setVisible(true);
        }else{
            this.setVisible(false);
        }

        this.setLaunchMotion();
        this.setFly();
        this.sprite.setPosition(0,this.jumpY);

        //攻撃タイプが弾丸だった場合は、一定時間毎に弾丸を発射する
        if(this.targetEnemy != null && this.attackMotionCode == "BULLET"){
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

        //パフォーマンスによってフレーム毎にsetPositionを行う回数を制限する
        this.renderingCnt++;
        if(this.renderingCnt >= this.renderingMaxCnt){
            this.renderingCnt = 0;
        }

        //目標を達成した後には、皆エスケープゾーンに向かって走る
        if(this.game.stage.isMissionClear()){
            this.moveToEscapeZone();
        }else{
            if(this.isStop) return;
            if(this.isTargetEnemy()){
                this.moveToEnemy();
            }else if(this.isTargetBuilding()){
                this.moveToBuilding();
            }else if(this.isTargetFollowPlayer()){
                this.moveTo(this.game.player);
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
        for (var y = 0; y < 1; y++) {
            for (var x = 0; x < 10; x++) {
                var frame = cc.SpriteFrame.create(effect_allow_up,cc.rect(120*x,120*y,120,120));
                frameSeq.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeq,0.1);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.depAnimation = cc.Sprite.create(effect_allow_up,cc.rect(0,0,120,120));
        this.depAnimation.runAction(this.ra);
        this.addChild(this.depAnimation);
        this.depAnimation.setPosition(0,25);
        this.depAnimation.setScale(0.5,1);
        this.depAnimation.setVisible(false);

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

        if(CONFIG.SET_POSITION_TYPE==1){
            this.setPosition(
                this.getPosition().x + speedX,
                this.getPosition().y + speedY
            );
        }else{
            this.mapX+=speedX;
            this.mapY+=speedY;
            //if(this.renderingCnt == 0){
                this.setPosition(
                    this.mapX,
                    this.mapY
                );
            //}
        }
    },

    moveToPositions:function(posX,posY,jumpType) {
        if(jumpType==1 && this.attackMotionCode == "JUMP"){
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
        var rad = Math.atan2(dX,dY);
        var speedX = this.walkSpeed * Math.sin(rad);
        var speedY = this.walkSpeed * Math.cos(rad);
        
        if(CONFIG.SET_POSITION_TYPE==1){
            this.setPosition(
                this.getPosition().x + speedX,
                this.getPosition().y + speedY
            );
        }else{
            this.mapX+=speedX;
            this.mapY+=speedY;
            //if(this.renderingCnt == 0){
                this.setPosition(
                    this.mapX,
                    this.mapY
                );
            //}
        }
    },

    isTargetEnemy:function(){
        if(this.targetEnemy != null) return true;
        return false;
    },

    isTargetBuilding:function(){
        if(this.targetBuilding != null) return true;
        return false;
    },

    isTargetFollowPlayer:function(){
        if(this.targetEnemy == null && this.targetBuilding == null) return true;
        return false
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