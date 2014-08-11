//
//  Player.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Player = cc.Node.extend({

    ctor:function (game) {
        this._super();
        this.game              = game;
        this.storage           = this.game.storage;

        //status
        this.lv               = this.storage.lv;
        this.hp               = this.storage.hp;
        this.maxHp            = this.storage.maxHp;
        this.attack           = this.storage.attack;
        this.defence          = this.storage.defence;
        this.eyeSightRange    = this.storage.eyeSightRange;
        this.walkSpeed        = this.storage.walkSpeed;

        //image
        this.charactorCode     = this.storage.charactorCode;
        this.image             = s_chara007;
        this.imgWidth          = 60/3; 
        this.imgHeight         = 112/4;

        //init
        this.battleInterval    = 0;
        this.direction         = "front";
        this.bulletSpeed       = CONFIG.BULLET_SPEED;
        this.targetType        = "none";
        this.targetEnemy       = null;
        this.targetChip        = null;
        this.initializeWalkAnimation();
        this.alpha = 0;
        this.update();
    },
    
    init:function () {
    },

    update:function() {
        /*
        if(this.game.isFly == true){
            //this.sprite2.setVisible(true);
            //this.alpha = (this.game.flyTime * 0.01);
            //if(this.alpha > 1){this.alpha = 1;}
            //this.sprite2.setOpacity(255 * this.alpha);
            //this.sprite3.setOpacity(255 * this.alpha);
            //this.shadow2.setOpacity(255 * this.alpha);
        }else{
            this.alpha-=0.1;
            if(this.alpha<0){
                this.alpha=0;
            }
            this.sprite2.setOpacity(255 * this.alpha);
            this.sprite3.setOpacity(255 * this.alpha);
            this.shadow2.setOpacity(255 * this.alpha);
        }*/
    },

    remove:function() {
        this.removeChild(this.sprite);
    },
    
    damage:function(damagePoint) {
        playSE(s_se_attack);
        this.hp = this.hp - damagePoint;
        if(this.hp < 0){
            this.hp = 0;
        }
        this.storage.playerHp = this.hp;
    },

    getDirection:function(){
        return this.direction;
    },

    initializeWalkAnimation:function(){
        //足下の陰
        this.shadow = cc.Sprite.create(s_shadow);
        this.shadow.setPosition(0,-8);
        this.shadow.setOpacity(255*0.4);
        this.addChild(this.shadow);

        var frameSeq = [];
        for (var i = 0; i < 3; i++) {
            var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*0,this.imgWidth,this.imgHeight));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq,0.2);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image,cc.rect(0,0,this.imgWidth,this.imgHeight));
        this.sprite.runAction(this.ra);
        this.addChild(this.sprite);

        this.sprite.setAnchorPoint(0.5,0.25);
        this.sprite.setScale(1.4,1.4);

        /*
        this.shadow2 = cc.Sprite.create(s_shadow);
        this.shadow2.setPosition(0,-10);
        this.shadow2.setOpacity(255*0.4);
        this.shadow2.setScale(5,5);
        this.addChild(this.shadow2);

        var frameSeq2 = [];
        for (var i = 0; i < 3; i++) {
            var frame = cc.SpriteFrame.create(s_charaBig,cc.rect(100*i,141*0,100,141));
            frameSeq2.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq2,0.2);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite2 = cc.Sprite.create(this.image,cc.rect(0,0,100,141));
        this.sprite2.runAction(this.ra);
        this.sprite2.setAnchorPoint(0.5,0.1);
        this.sprite2.setScale(1.3,1.3);
        this.addChild(this.sprite2);

        var frameSeq3 = [];
        for (var i = 0; i < 10; i++) {
            var frame = cc.SpriteFrame.create(effect_eye,cc.rect(60*i,60*0,60,60));
            frameSeq3.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq3,0.2);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite3 = cc.Sprite.create(effect_eye,cc.rect(0,0,60,60));
        this.sprite3.runAction(this.ra);
        this.sprite3.setPosition(0,100);
        this.sprite3.setScale(2.7,2.7);
        this.addChild(this.sprite3);
        */
        
        //デバッグ
        if(CONFIG.DEBUG_FLAG==1){
            this.sigh = cc.LayerColor.create(cc.c4b(255,0,0,255),3,3);
            this.sigh.setPosition(0,0);
            this.addChild(this.sigh);
        }
    },

    moveToTargetMarker:function(targetSprite) {
        if(targetSprite == null) return;
        if(this.getPosition().x < targetSprite.getPosition().x){
            if(Math.abs(this.getPosition().x - targetSprite.getPosition().x) > this.walkSpeed){
                this.setPosition(
                    this.getPosition().x + this.walkSpeed,
                    this.getPosition().y
                );
            }else{
                this.setPosition(
                    targetSprite.getPosition().x,
                    this.getPosition().y
                );
            }
        }
        if(this.getPosition().x > targetSprite.getPosition().x){
            if(Math.abs(this.getPosition().x - targetSprite.getPosition().x) > this.walkSpeed){
                this.setPosition(
                    this.getPosition().x - this.walkSpeed,
                    this.getPosition().y
                );
            }else{
                this.setPosition(
                    targetSprite.getPosition().x,
                    this.getPosition().y
                );
            }
        }
        if(this.getPosition().y < targetSprite.getPosition().y){
            if(Math.abs(this.getPosition().y - targetSprite.getPosition().y) > this.walkSpeed){
                this.setPosition(
                    this.getPosition().x,
                    this.getPosition().y + this.walkSpeed
                );
            }else{
                this.setPosition(
                    this.getPosition().x,
                    targetSprite.getPosition().y
                );
            }
        }
        if(this.getPosition().y > targetSprite.getPosition().y){
            if(Math.abs(this.getPosition().y - targetSprite.getPosition().y) > this.walkSpeed){
                this.setPosition(
                    this.getPosition().x,
                    this.getPosition().y - this.walkSpeed
                );
            }else{
                this.setPosition(
                    this.getPosition().x,
                    targetSprite.getPosition().y
                );
            }
        }
    },

    setDirection:function(targetSprite){
        //横の距離が大きいとき
        var diffX = Math.floor(targetSprite.getPosition().x - this.getPosition().x);
        var diffY = Math.floor(targetSprite.getPosition().y - this.getPosition().y);
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
        //左下
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
        //右下
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
        //左上
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
        //右上
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