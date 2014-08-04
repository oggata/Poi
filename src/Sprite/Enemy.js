//
//  Enemy.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.

var Enemy = cc.Node.extend({
    ctor:function (game,code,routes) {
        this._super();
        this.game    = game;
        this.storage = this.game.storage;
        this.routes  = routes;
        this.id      = getRandNumberFromRange(1,9999999);

        //dep
        this.routeId = 0;
        var dep = this.game.stage.getChipPosition(this.routes[this.routeId]);
        this.depX = dep[0];
        this.depY = dep[1];
        this.depChipId = this.routes[this.routeId];
        this.setPosition(this.depX,this.depY);


        //initialize
        this.initializeParam(code);
        this.initSprite();
        this.update();
    },

    loadEnemyJson : function() {
        var jsonFile = cc.FileUtils.getInstance().getStringFromFile(enemy_json);
        this.dict    = JSON.parse(jsonFile);
        return this.dict["enemies"];
    },

    initializeParam:function(code){
        var jsonData = [];
        var datas = this.loadEnemyJson();
        for(var i=0;i<datas.length;i++){
            if(datas[i]["id"] == code){
                jsonData = datas[i];
            }
        }
        this.hp              = jsonData["hp"];
        this.maxHp           = jsonData["hp"];
        this.attack          = jsonData["attack"];
        this.defence         = jsonData["defence"];
        this.imagePath       = jsonData["image"];
        this.imgWidth        = jsonData["image_width"];
        this.imgHeight       = jsonData["image_height"];
        this.walkSpeed       = jsonData["walk_speed"];
        this.type            = jsonData["type"];
        this.bullet          = jsonData["bullet"];
        this.walkRangeX      = jsonData["eye_sight"];
        this.walkRangeY      = jsonData["eye_sight"];
        this.eyeSight        = jsonData["eye_sight"];
        this.trackNum        = jsonData["track_num"];
        this.direction       = "front";
        this.damangeTexts    = new Array();
        this.battleIntervalToPlayer     = 0;
        this.walkDistination = new Array();
        this.waklDistSeqNum  = 0;

        //歩行方向
        this.beforeX         = this.getPosition().x;
        this.beforeY         = this.getPosition().y;
        this.directionCnt    = 0;
        //ダメージ表示
        this.flashCnt          = 0;
        this.isCharaVisible    = true;
        this.damageCnt         = 0;
        this.isDamageOn        = false;

        this.dmCnt             = 0;
        //弾丸発射用
        this.bulletLncTime     = 0;
        this.bulletLncMaxTime  = 30 * 2;

        this.cockroachTime      = 0;
        this.cockroachActiveFlg = 0;
        this.cockroachDistX     = 0;
        this.cockroachDistY     = 0

        //軌跡（ヘビ型)
        this.trackSnakeInterval = 0;
        this.trackSnakes = [];
        for(var i=0;i<this.trackNum;i++){
            var track = new Track(i,this,this.game);
            this.game.mapNode.addChild(track);
            this.trackSnakes.push(track);
        }

        //キャラクターの胴体を作成する
        this.enemyBodies = [];
        var bodyCnt = 0;
        if(this.type == "snake"){
            bodyCnt = this.trackSnakes.length;
        }
        if(this.type == "jellyfish"){
            bodyCnt = 18;
        }
        for(var i=0;i<bodyCnt;i++){
            var eBody = new EnemyBody(this.game,i,this);
            this.game.mapNode.addChild(eBody);
            eBody.setPosition(
                this.depX,this.depY
            );
            this.enemyBodies.push(eBody);
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

    removeBodies:function(){
        for(var i=0;i<this.enemyBodies.length;i++){
            this.game.mapNode.removeChild(this.enemyBodies[i]);
            this.enemyBodies.splice(i,1);
        }
    },

    update:function() {
        if(this.routes){
            var pos = this.game.stage.getChipPosition(this.routes[this.routeId]);
            var margin = 1;
            if(
                this.getPosition().x  - margin <= pos[0] 
            &&  pos[0] <= this.getPosition().x + margin

            &&  this.getPosition().y - margin <= pos[1]
            &&  pos[1] <= this.getPosition().y + margin

            ){
                this.routeId+=1;
                if(this.routeId >= this.routes.length){
                    this.routeId = 0;
                }
            }
        }

        //body
        for(var i=0;i<this.enemyBodies.length;i++){
            this.enemyBodies[i].update();
            this.game.mapNode.reorderChild(
                this.enemyBodies[i],
                Math.floor(this.game.mapHeight - this.enemyBodies[i].getPosition().y)
            );
        }

        //自身が通った座標の履歴
        this.trackSnakeInterval++;
        if(this.trackSnakeInterval >= 30){
            this.trackSnakeInterval=0;
            //add
            var track = new Track(1,this,this.game);
            this.game.mapNode.addChild(track);
            track.setPosition(
                this.getPosition().x,
                this.getPosition().y
            );
            this.trackSnakes.push(track);
            //remove
            this.game.mapNode.removeChild(this.trackSnakes[0]);
            this.trackSnakes.splice(0,1);
        }

        //bulletが有効の場合は弾を発射する
        if(this.bullet == "fire"){
            this.bulletLncTime++;
            if(this.bulletLncTime >= this.bulletLncMaxTime){
                this.bulletLncTime = 0;
                this.game.addEnemyBullet(this);
            }
        }

        if(this.dmCnt>=1){
            this.dmCnt++;
            if(this.dmCnt>=30*2){
                this.dmCnt = 0;
            }
        }

        //ダメージを受けた場合は、透過で点滅する
        if(this.isDamageOn == true){
            this.dmCnt=1;
            this.addFlashCnt();
            this.damageCnt++;
            if(this.damageCnt>=40){
                this.damageCnt = 0;
                this.isDamageOn = false;
                this.sprite.setOpacity(255*1);
            }
        }

        var distance = cc.pDistance(
            this.game.player.getPosition(),
            this.getPosition()
        );


if(this.dmCnt==0){
        if(distance <= this.eyeSight){
            var dX = this.game.player.getPosition().x - this.getPosition().x;
            var dY = this.game.player.getPosition().y - this.getPosition().y;
            var rad = Math.atan2(dX,dY);
            var speedX = this.walkSpeed * Math.sin(rad);
            var speedY = this.walkSpeed * Math.cos(rad);
            if(this.isDamageOn == false){
                this.setPosition(
                    this.getPosition().x + speedX,
                    this.getPosition().y + speedY
                );
            }
        }else{
            if(this.routes){
                var posi = this.game.stage.getChipPosition(this.routes[this.routeId]);
                var dX = posi[0] - this.getPosition().x;
                var dY = posi[1] - this.getPosition().y;


                var distance = Math.sqrt(dX * dX + dY * dY);


                var rad = Math.atan2(dX,dY);
                var speedX = this.walkSpeed * Math.sin(rad);
                var speedY = this.walkSpeed * Math.cos(rad);

                if(speedX > distance || speedY > distance){
                    this.setPosition(
                        posi[0],
                        posi[1]
                    );
                }else{
                    this.setPosition(
                        this.getPosition().x + speedX,
                        this.getPosition().y + speedY
                    );
                }
            }
        }
}

        this.gauge.update(this.hp/this.maxHp);

        //HPが0になった場合は死ぬ
        if(this.hp == 0){
            this.remove();
            return false;
        }

        //ダメージを受けたら表示する漫画テキスト
        for(var i=0;i<this.damangeTexts.length;i++){
            if(this.damangeTexts[i].update() == false){
                //ここでRemoveしないと、spriteがどんどん増えていく
                this.removeChild(this.damangeTexts[i]);
                this.damangeTexts.splice(i, 1);
            }
        }

        //方向制御
        this.directionCnt++;
        if(this.directionCnt >= 5){
            this.directionCnt = 0;
            this.setDirection(this.beforeX,this.beforeY);
            this.beforeX = this.getPosition().x;
            this.beforeY = this.getPosition().y;
        }

        return true;
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

    remove:function() {
        this.removeChild(this.sprite);
        this.removeChild(this.gauge);
        /*
        //damage text
        for(var i=0;i<this.damangeTexts.length;i++){
            this.removeChild(this.damangeTexts[i]);
        }*/
    },

    damage:function(damagePoint) {
        playSE(s_se_attack);

        this.hp = this.hp - damagePoint;
        if(this.hp < 0){
            this.hp = 0;
        }
        
        this.damageText = new DamageText();
        this.damageText.setScale(0.2);
        this.addChild(this.damageText,5);

        this.damangeTexts.push(this.damageText);

        this.isDamageOn = true;
    },

    initSprite:function(){
        //足下の影
        this.shadow = cc.Sprite.create(s_shadow);
        this.shadow.setPosition(0,-10);
        this.shadow.setOpacity(255*0.4);
        this.shadow.setScale(5,5);
        this.addChild(this.shadow);

        //HPゲージ
        this.gauge = new Gauge(30,4,'red');
        this.gauge.setPosition(-20,70);
        this.addChild(this.gauge,100);

        var frameSeq = [];
        for (var i = 0; i < 3; i++) {
            var frame = cc.SpriteFrame.create(this.imagePath,cc.rect(this.imgWidth*i,this.imgHeight*0,this.imgWidth,this.imgHeight));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq,0.2);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.imagePath,cc.rect(0,0,this.imgWidth,this.imgHeight));
        this.sprite.setPosition(0,50);
        this.sprite.runAction(this.ra);
        this.addChild(this.sprite);

        //デバッグ
        if(CONFIG.DEBUG_FLAG==1){
            this.sigh = cc.LayerColor.create(cc.c4b(255,0,0,255),3,3);
            this.sigh.setPosition(0,0);
            this.addChild(this.sigh);
        }
    },

    walkLeftDown:function(){
        if(this.direction != "front"){
            this.direction = "front";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.imagePath,cc.rect(this.imgWidth*i,this.imgHeight*0,this.imgWidth,this.imgHeight));
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
                var frame = cc.SpriteFrame.create(this.imagePath,cc.rect(this.imgWidth*i,this.imgHeight*1,this.imgWidth,this.imgHeight));
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
                var frame = cc.SpriteFrame.create(this.imagePath,cc.rect(this.imgWidth*i,this.imgHeight*2,this.imgWidth,this.imgHeight));
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
                var frame = cc.SpriteFrame.create(this.imagePath,cc.rect(this.imgWidth*i,this.imgHeight*3,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
});