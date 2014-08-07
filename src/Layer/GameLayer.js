//
//  GameLayer.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var GameLayer = cc.Layer.extend({
    ctor:function (storage) {
        this._super();
        this.storage  = storage;
        changeLoadingImage();
    },

    init:function () {
        this._super();
        cc.Director.getInstance().setProjection(cc.DIRECTOR_PROJECTION_2D);

        //bgm
        playBGM();

        if ('touches' in sys.capabilities || sys.platform == "browser")
                this.setTouchEnabled(true);
        else if ('mouse' in sys.capabilities)
                this.setMouseEnabled(true);


        this.setParams();
        this.setScrollView();
        this.stage = new Stage(this);

        //set player
        this.player = new Player(this);
        this.player.setPosition(800,30);
        this.mapNode.addChild(this.player);

        //targetSprite
        this.targetSprite = cc.Sprite.create(s_target);
        this.targetSprite.setPosition(800,30);
        this.mapNode.addChild(this.targetSprite);

        //markerSprite
        this.markerSprite = new TargetMarker();
        this.mapNode.addChild(this.markerSprite);

        this.shakeY = 0;

        //バトルエフェクト
        var frameSeqEffect= [];
        for (var y = 0; y <= 0; y++) {
            for (var x = 0; x <= 7; x++) {
                var frame = cc.SpriteFrame.create(effect_fire,cc.rect(120*x,120*y,120,120));
                frameSeqEffect.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeqEffect,0.1);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.battleAnimation = cc.Sprite.create(effect_sander,cc.rect(0,0,120,120));
        this.battleAnimation.runAction(this.ra);
        this.battleAnimation.setScale(1.5,1.5);
        this.battleAnimation.setOpacity(255*0.8);
        this.battleAnimation.setPosition(0,0);
        this.mapNode.addChild(this.battleAnimation,999999999);

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
        this.occupyAnimation.setScale(1.5,1.5);
        this.occupyAnimation.setOpacity(255*0.8);
        this.occupyAnimation.setPosition(0,0);
        this.mapNode.addChild(this.occupyAnimation,999999999);

        //timerSprite
        this.timerSprite = cc.Sprite.create(s_timer,cc.rect(50*0,0,50,50));
        this.timerSprite.setPosition(800,220);
        this.mapNode.addChild(this.timerSprite,9999999);
        this.timerImage = cc.TextureCache.getInstance().addImage(s_timer);
        this.timerSprite.setTexture(this.timerImage);

        //initialize camera
        this.cameraX = 320/2 - this.player.getPosition().x;
        this.cameraY = 420/2 - this.player.getPosition().y;
        this.playerCameraX = 320/2;
        this.playerCameraY = 420/2;
        this.mapNode.setPosition(
            this.cameraX,
            this.cameraY
        );
        this.setUI();


        for(var i=0;i<this.storage.colleagues.length;i++){
            var colleagueData = this.storage.colleagues[i];
            this.addColleagues(colleagueData["count"],colleagueData["colleagueId"]);
        }

/*
        this.addColleagues(30,1);
        //this.addColleagues(10,2);
        //this.addColleagues(10,3);
*/
        this.scheduleUpdate();
        this.setTouchEnabled(true);

        for(var i=0;i<this.storage.stageEnemies.length;i++){
            var enemyData = this.storage.stageEnemies[i];
            this.addEnemyByPos(enemyData["enemyId"],enemyData["route"]);
        }

        this.collCnt=0;

        //ゲームオーバー or クリア後の背景
        this.back = cc.LayerColor.create(cc.c4b(0,0,0,255),320,480);
        this.back.setPosition(0,0);
        this.addChild(this.back,CONFIG.UI_DROW_ORDER);
        this.rectBaseAlpha = 0;
        this.back.setOpacity(0);

        //(ゲームオーバー時)retryボタン
        this.retryButton = new ButtonItem("リトライ",200,50,this.onRetryGame,this);
        this.retryButton.setPosition(160,120);
        this.addChild(this.retryButton,CONFIG.UI_DROW_ORDER);
        this.retryButton.setVisible(false);

        //(ゲームオーバー時)nextボタン
        this.changeButton = new ButtonItem("キャラ選択",200,50,this.onRetryGame,this);
        this.changeButton.setPosition(160,60);
        this.addChild(this.changeButton,CONFIG.UI_DROW_ORDER);
        this.changeButton.setVisible(false);

        //(クリア)の文字
        this.txtGameOver = cc.Sprite.create(s_text_game_over);
        this.txtGameOver.setPosition(320/2,480/2);
        this.addChild(this.txtGameOver,CONFIG.UI_DROW_ORDER);
        this.txtGameOver.setVisible(false);

        //(クリア)の文字
        this.txtSpecialItem = cc.Sprite.create(s_text_stage_clear);
        this.txtSpecialItem.setPosition(320/2,480/2);
        this.addChild(this.txtSpecialItem,CONFIG.UI_DROW_ORDER);
        this.txtSpecialItem.setVisible(false);

        //クリア後のアニメーションを作成
        var frameSeq = [];
        for (var y = 0; y <= 10; y++) {
            for (var x = 0; x <= 2; x++) {
                var frame = cc.SpriteFrame.create(s_cleared_effect,cc.rect(640*x,480*y,640,480));
                frameSeq.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeq,0.1);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.clearedEffectAnimation = cc.Sprite.create(s_cleared_effect,cc.rect(0,0,640,480));
        this.clearedEffectAnimation.runAction(this.ra);
        this.addChild(this.clearedEffectAnimation,CONFIG.UI_DROW_ORDER);
        this.isEffect    = true;
        this.clearedEffectAnimation.setPosition(320/2,480/2);
        this.clearedEffectAnimation.setVisible(false);

        //クリア後に表示する結果画面ボタン
        this.resultButton = new ButtonItem("-結果画面へ-",200,40,this.goResultLayer,this);
        this.resultButton.setPosition(320/2,80);
        this.addChild(this.resultButton,CONFIG.UI_DROW_ORDER);
        this.resultButton.setVisible(false);

        this.flyTime = 0;
        this.isFly   = false;

        this.isSetNavi = false;

        return true;
    },

    startGame : function() {
        if(this.isMissionVisible == true){
            playSystemButton();
            this.isMissionVisible = false;
            //this.sp.setVisible(false);
            this.titleLabel.setVisible(false);
            //this.startButton.setVisible(false);
            this.rectBase.setVisible(false);
            this.titleLimit.setVisible(false);
        }
    },

    setScrollView : function() {
        //ウィンドウのサイズを取得する
        var winSize = cc.Director.getInstance().getWinSize();

        //スクロールさせる対象のmapNodeを作る
        this.mapNode = cc.Node.create();
        //this.mapNode.setContentSize(100,100);

        //スクロールViewを追加
        this.addChild(this.mapNode);
    },

    setParams : function() {
        this.mapWidth        = 1000;
        this.mapHeight       = 1000;
        this.isMissionVisible = true;
        this.isMovedResult   = false;

        //仲間の数
        this.colleagueCnt    = 0;
        this.killedEnemyCnt  = 0;
        

        this.mapScale        = 1;
        this.territoryCnt    = 0;
        this.territoryMaxCnt = 0;
        this.coins           = [];
        this.bullets         = [];
        this.enemyBullets    = [];
        this.colleagueBullets= [];
        this.enemies         = [];
        this.colleagues      = [];
        //mission
        this.missionNumber   = this.storage.missionNumber;
        this.missionLabel    = this.storage.missionTitle;
        this.missionCnt      = 0;
        this.missionMaxCnt   = this.storage.missionMaxCnt;
        this.timeCnt         = 0;
        this.missionTimeLimit= this.storage.missionTimeLimit;
        this.tapPower        = 0;
        this.criticalPower   = 0;
        this.criticalMaxPower=100;

        this.titleCnt = 0;
    },

    setUI : function(){
        //UI
        this.gameUI = new GameUI(this);
        this.addChild(this.gameUI,999);

/*
        //カットイン
        this.cutIn = new CutIn();
        this.cutIn.setPosition(0,200);
        this.addChild(this.cutIn,999);
        this.cutIn.set_text("GameStart!");
*/

        //背景
        this.rectBase = cc.LayerColor.create(cc.c4b(0,0,0,255 * 0.8),320,480);
        this.rectBase.setPosition(0,0);
        this.addChild(this.rectBase,CONFIG.UI_DROW_ORDER);

        //時間制限
        this.titleLimit = cc.LabelTTF.create("制限時間 : " + Math.floor(this.missionTimeLimit / 30) + "秒","Arial",20);   
        this.titleLimit.setPosition(320/2,480/2 + 30);
        this.addChild(this.titleLimit,CONFIG.UI_DROW_ORDER);

        //タイトル文字
        this.titleLabel = cc.LabelTTF.create(this.missionLabel,"Arial",25);   
        this.titleLabel.setPosition(320/2,480/2);
        this.addChild(this.titleLabel,CONFIG.UI_DROW_ORDER);

/*
        //スタートボタン
        this.startButton = new ButtonItem("START",200,50,this.startGame,this);
        this.startButton.setPosition(160,130);
        this.addChild(this.startButton,CONFIG.UI_DROW_ORDER);
*/

        this.navi = new Navi(this);
        this.addChild(this.navi);
    },

    update:function(dt){



        this.moveCamera();
        this.gameUI.update();
        this.markerSprite.update();
        this.stage.update();
        //this.cutIn.update();
        this.collisionAll();
        this.navi.update();

        this.titleCnt++;
        if(this.titleCnt>=30*2){
            this.titleCnt = 30;
            this.startGame();
        }

        if(this.navi.isSetNavi() == true){
            return;
        }

        if(this.isFly==true){
            this.flyTime++;
            if(this.flyTime>=30*5){
                this.flyTime = 0;
                this.isFly   = false;
            }
        }

        if(this.stage.isColored == true){
            this.isDamageShake();
        }

        //ミッション達成した後の遷移
        if(this.stage.isEscaped == true){
            this.isMovedResult = true;
            this.clearedEffectAnimation.setVisible(true);
            this.rectBaseAlpha+=0.05;
            this.back.setOpacity(255*this.rectBaseAlpha);
            if(this.rectBaseAlpha>=0.5){
                this.rectBaseAlpha=0.5;
            }
            this.txtSpecialItem.setVisible(true);
            this.resultButton.setVisible(true);
        }
        if(this.stage.isGameOver == true){
            this.rectBaseAlpha+=0.05;
            this.back.setOpacity(255*this.rectBaseAlpha);
            if(this.rectBaseAlpha>=0.5){
                this.rectBaseAlpha=0.5;
            }
        }

        //ページ遷移した場合はupdateは実行しない
        if(this.isMovedResult == true) return;
        //ミッションが表示中はupdateは実行しない
        if(this.isMissionVisible == true) return;

        //スクロールのハンドリング
        this.tapPower-=1;
        if(this.tapPower>100){
            this.tapPower=100;
        }
        if(this.tapPower<0){
            this.tapPower=0;
        }

        //プレイヤー
        this.player.update();
        this.mapNode.reorderChild(
            this.player,
            Math.floor(this.mapHeight - this.player.getPosition().y)
        );
        this.player.setDirection(this.targetSprite);

        this.timerSprite.setVisible(false);
        if(this.player.targetType == "CHIP"){
            this.targetSprite.setVisible(false);
            this.markerSprite.setVisible(true);
            this.player.moveToTargetMarker(this.player.targetChip);
            this.markerSprite.setPosition(
                this.player.targetChip.getPosition().x,
                this.player.targetChip.getPosition().y
            );
            this.updateTimer();
            this.battleAnimation.setVisible(false);
            this.occupyAnimation.setVisible(true);
            this.occupyAnimation.setPosition(this.markerSprite.getPosition().x,this.markerSprite.getPosition().y);
        }else if(this.player.targetType == "ENEMY" &&  this.player.targetEnemy != null){
            this.targetSprite.setVisible(false);
            this.markerSprite.setVisible(true);
            if(this.player.targetEnemy){
                this.markerSprite.setPosition(
                    this.player.targetEnemy.getPosition().x,
                    this.player.targetEnemy.getPosition().y
                );
            }
            this.player.moveToTargetMarker(this.markerSprite);
            this.battleAnimation.setVisible(true);
            this.occupyAnimation.setVisible(false);
            this.battleAnimation.setPosition(this.markerSprite.getPosition().x,this.markerSprite.getPosition().y);
        }else{
            this.targetSprite.setVisible(true);
            this.markerSprite.setVisible(false);
            this.player.moveToTargetMarker(this.targetSprite);

            this.battleAnimation.setVisible(false);
            this.occupyAnimation.setVisible(false);
        }

        //Playerの死亡時には生き残っている仲間がいれはスイッチする
        if(this.player.hp <= 0){
            if(this.colleagues.length == 0 && this.isMovedResult == false){
                this.isMovedResult = true;
                this.goGameOverLayer();
            }else{
                for(var i=0;i<this.colleagues.length;i++){
                    if(this.colleagues[i].hp > 0){
                        this.player.hp = this.colleagues[i].hp;
                        //移動
                        this.player.setPosition(
                            this.colleagues[i].getPosition().x,
                            this.colleagues[i].getPosition().y
                        );
                        //colleaguesの配列から削除する
                        this.mapNode.removeChild(this.colleagues[i]);
                        this.colleagues.splice(i, 1);
                    }
                }
            }
        }

        //Enemies 死亡時の処理、Zソート
        for(var i=0;i<this.enemies.length;i++){
            if(this.enemies[i].update() == false){
                this.stage.addCoin(
                    this.enemies[i].getPosition().x,
                    this.enemies[i].getPosition().y
                );
                this.enemies[i].removeBodies();
                if(this.enemies[i].enemyBodies == 0){
                    this.mapNode.removeChild(this.enemies[i]);
                    this.enemies.splice(i, 1);
                    this.storage.killedEnemyCnt++;
                    this.killedEnemyCnt++;
                }
            }else{
                this.mapNode.reorderChild(
                    this.enemies[i],
                    Math.floor(this.mapHeight - this.enemies[i].getPosition().y)
                );
            }
        }

        //Collegues　死亡時の処理、Zソート
        this.colleagueCnt = 0;
        for(var i=0;i<this.colleagues.length;i++){
            //仲間の数を数える
            if(this.colleagues[i].isChase == true){
                this.colleagueCnt+=1;
            }
            //仲間が死亡したら配列から外す
            if(this.colleagues[i].update() == false){
                this.mapNode.removeChild(this.colleagues[i]);
                this.colleagues.splice(i, 1);
                this.storage.killedColleagueCnt+=1;               
            }else{
                //生きている仲間をzソートする
                this.mapNode.reorderChild(
                    this.colleagues[i],
                    Math.floor(this.mapHeight - this.colleagues[i].getPosition().y)
                ); 
            }
        }

        //Storageに入れる
        this.storage.colleagueCnt = this.colleagueCnt;

/*
        //bullets
        for(var i=0;i<this.bullets.length;i++){
            if(this.bullets[i].update() == false){
                this.mapNode.removeChild(this.bullets[i]);
                this.bullets.splice(i,1);
            }
        }
*/
        //enemy bullets
        for(var i=0;i<this.enemyBullets.length;i++){
            if(this.enemyBullets[i].update() == false){
                this.mapNode.removeChild(this.enemyBullets[i]);
                this.enemyBullets.splice(i,1);
            }
        }

        //colleague bullets
        for(var i=0;i<this.colleagueBullets.length;i++){
            if(this.colleagueBullets[i].update() == false){
                //this.mapNode.removeChild(this.enemyBullets[i]);
                //this.enemyBullets.splice(i,1);
            }
        }

        //コイン
        for(var i=0;i<this.coins.length;i++){
            //zソートする
            this.mapNode.reorderChild(
                this.coins[i],
                Math.floor(this.mapHeight - this.coins[i].getPosition().y)
            );
        }

        //タイムリミットを超えた場合の処理＋カウントダウン
        this.timeCnt++;
        if(this.isMovedResult == false && this.timeCnt >= this.missionTimeLimit){
            this.isMovedResult = true;
            this.goGameOverLayer();      
        }
        var second = getZeroPaddingNumber(
            Math.floor((this.missionTimeLimit - this.timeCnt)/30)
            ,3
        );
        /*
        if(second <=  5){
            this.cutIn.set_text("ノコリ " + second + "秒..");
        }*/

/*
        //ミッションのジャンルによる成果計算
        if(this.storage.missionGenre == "occupy"){
            this.missionCnt = this.territoryCnt;
        }else if(this.storage.missionGenre == "enemy"){
            this.missionCnt = this.storage.killedEnemyCnt;
        }else{
            this.missionCnt = 0;
        }
*/
    },

    addEnemyBullet:function(enemy){
        var enemyBullet = new Bullet(enemy,"fire");
        enemyBullet.attack = enemy.attack;
        enemyBullet.set_position(enemy.getPosition().x,enemy.getPosition().y - 50);
        var colleague = enemy.getNearistColleague();
        if(colleague != null){
            var colleagueX     = colleague.getPosition().x;
            var colleagueY     = colleague.getPosition().y;
            var directX    = Math.floor(enemy.getPosition().x - colleagueX) * -1;
            var directY    = Math.floor(enemy.getPosition().y - colleagueY) * -1;
            var directData = getBulletDirection(directX,directY,3);
            enemyBullet.set_direction(directData[0],directData[1]);
            this.mapNode.addChild(enemyBullet,999);
            this.enemyBullets.push(enemyBullet);
        }
    },
/*
    addColleagueBullet:function(colleague){
        var colleagueBullet = new Bullet(colleague,"colleague");
        colleagueBullet.attack = 10;
        colleagueBullet.set_position(
            colleague.getPosition().x,
            colleague.getPosition().y - 50
        );
        this.mapNode.addChild(colleagueBullet,999);
        this.colleagueBullets.push(colleagueBullet);
    },
*/
    addColleagueBullet:function(enemy,colleague){
        var colleagueBullet = new Bullet(enemy,"test");
        colleagueBullet.attack = 10;
        colleagueBullet.set_position(
            colleague.getPosition().x,
            colleague.getPosition().y - 50
        );
        this.mapNode.addChild(colleagueBullet,999);
        this.colleagueBullets.push(colleagueBullet);
    },

    collisionAll:function(){
        //プレイヤー & 仲間
        collisionPlayerAndColleague(this.player,this.colleagues,this);

        //仲間 & 仲間
        collisionColleagueAndColleague(this.colleagues);

        //プレイヤー & 敵
        collisionPlayerAndEnemy(this.player,this.enemies,this);

        //プレイヤー & 敵弾丸
        collisionPlayerAndEnemyBullet(this.player,this.enemyBullets);

        //仲間 & 敵
        collisionColleagueAndEnemy(this.colleagues,this.enemies);

        //仲間 & 敵の弾丸
        collisionColleguesAndEnemyBullet(this.colleagues,this.enemyBullets);

        //プレイヤー & コイン
        collisionPlayerAndCoin(this);

        //仲間 & 仲間 
        collisionColleagueAndColleague(this.enemies);

        //敵 & 敵
        collisionEnemyAndEnemy(this.enemies);

        //プレイヤー & マップチップ
        collisionPlayerAndChip(this);
    },

    moveCamera:function(){
        //カメラ位置はプレイヤーを追いかける
        this.playerCameraX = this.player.getPosition().x + this.cameraX;
        this.playerCameraY = this.player.getPosition().y + this.cameraY;
        
        //xの中心は320/2=16 +- 20
        if(this.playerCameraX >= 320/2 + 20){
            this.cameraX -= this.player.walkSpeed;
        }
        if(this.playerCameraX <= 320/2 - 20){
            this.cameraX += this.player.walkSpeed;
        }
        //yの中心は420/2=210 +- 20
        if(this.playerCameraY >= 420/2 - 20){
            this.cameraY -= this.player.walkSpeed;
        }
        if(this.playerCameraY <= 420/2 + 20){
            this.cameraY += this.player.walkSpeed;
        }

        if(this.cameraX < -1000){
            this.cameraX = -1000;
        }
        if(this.cameraX > -160){
            this.cameraX = -160;
        }
        if(this.cameraY < -230){
            this.cameraY = -230;
        }
        if(this.cameraY > 80){
            this.cameraY = 80;
        }

        this.mapNode.setScale(this.mapScale,this.mapScale);
        this.mapNode.setPosition(
            this.cameraX,
            this.cameraY + this.shakeY
        );
    },

    isDamageShake:function(){
        this.shakeY+=5;
        if(this.shakeY>=10){
            this.shakeY = 0;
        }
    },

    addColleagues:function(num,type){
        for (var i=0 ; i <  num ; i++){
            this.colleague = new Colleague(this,type);
            this.mapNode.addChild(this.colleague,100);
            var depX = getRandNumberFromRange(this.player.getPosition().x - 50,this.player.getPosition().x + 50);
            var depY = getRandNumberFromRange(this.player.getPosition().y - 50,this.player.getPosition().y + 50);
            this.colleague.setPosition(depX,depY);
            this.colleague.isChase = true;
            this.colleagues.push(this.colleague);
        }
    },

    addEnemyByPos : function(code,routes){
        this.enemy = new Enemy(this,code,routes);
        this.mapNode.addChild(this.enemy);
        this.enemies.push(this.enemy);
    },

    updateTimer:function(){
        //タイマーをset
        this.timerSprite.setVisible(true);
        this.timerSprite.setPosition(
            this.player.targetChip.getPosition().x,
            this.player.targetChip.getPosition().y + 40
        );
        var rate = this.player.targetChip.hp / this.player.targetChip.maxHp;
        this.timerSprite.setTexture(this.timerImage);
        if(0/8 <= rate && rate <= 1/8){
            this.timerSprite.setTextureRect(cc.rect(50*0,0,50,50));
        }
        if(1/8 < rate && rate <= 2/8){
            this.timerSprite.setTextureRect(cc.rect(50*1,0,50,50));
        }
        if(2/8 < rate && rate <= 3/8){
            this.timerSprite.setTextureRect(cc.rect(50*2,0,50,50));
        }
        if(3/8 < rate && rate <= 4/8){
            this.timerSprite.setTextureRect(cc.rect(50*3,0,50,50));
        }
        if(4/8 < rate && rate <= 5/8){
            this.timerSprite.setTextureRect(cc.rect(50*4,0,50,50));
        }
        if(5/8 < rate && rate <= 6/8){
            this.timerSprite.setTextureRect(cc.rect(50*5,0,50,50));
        }
        if(6/8 < rate && rate <= 7/8){
            this.timerSprite.setTextureRect(cc.rect(50*6,0,50,50));
        }
        if(7/8 < rate && rate <= 8/8){
            this.timerSprite.setTextureRect(cc.rect(50*7,0,50,50));
        }
    },

    //デバイス入力----->
    onTouchesBegan:function (touches, event) {
        if(this.isToucheable() == false) return;
        this.touched = touches[0].getLocation();
        if(this.touched.y <= 80 && this.player.targetType == "ENEMY"
            || this.touched.y <= 80 && this.player.targetType == "CHIP"){
            this.tapPower+=10;
        }else{
            this.player.targetType = "NONE";
            var tPosX = (this.touched.x - this.cameraX) / this.mapScale;
            var tPosY = (this.touched.y - this.cameraY) / this.mapScale;   
            this.targetSprite.setPosition(tPosX,tPosY);

            this.player.targetType = "NONE";
            this.player.targetEnemy = null;
            for(var i=0;i<this.enemies.length;i++){
                var distance = cc.pDistance(this.targetSprite.getPosition(),this.enemies[i].getPosition());
                if(distance <= 50){
                    this.player.targetType  = "ENEMY";
                    this.player.targetEnemy = this.enemies[i];
                    return;
                }
             }
             for(var i=0;i<this.stage.chips.length;i++){
                var distance = cc.pDistance(this.targetSprite.getPosition(),this.stage.chips[i].getPosition());
                if(distance <= 50){
                    if(this.stage.chips[i].isOccupieType()==true){
                        this.player.targetType = "CHIP";
                        this.player.targetChip = this.stage.chips[i];
                    }
                }
            }
        }
    },

    onTouchesMoved:function (touches, event) {

    },

    onTouchesEnded:function (touches, event) {

    },

    onTouchesCancelled:function (touches, event) {

    },

    //シーンの切り替え----->
    goResultLayer:function (pSender) {
        //ステージを追加
        this.storage.stageNumber++;
        if(this.storage.maxStageNumber <= this.storage.stageNumber){
            this.storage.maxStageNumber = this.storage.stageNumber;
        }
        this.storage.calcTotal();
        this.saveData();
        
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(ResultLayer.create(this.storage));
        //時計回り
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.5,scene));
    },



    goGameOverLayer:function (pSender) {
        //this.back.setOpacity(255*0.7);
        this.retryButton.setVisible(true);
        this.changeButton.setVisible(true);
        this.txtGameOver.setVisible(true);
        this.stage.isGameOver = true;
    },

    goGameOverLayerBak:function (pSender) {
        this.storage.calcTotal();

        this.saveData();

        var scene = cc.Scene.create();
        scene.addChild(GameOverLayer.create(this.storage));
        cc.Director.getInstance().replaceScene(cc.TransitionProgressRadialCW.create(1.2, scene));
    },

    saveData :function(){
        /*
        //3:android 4:iphone 5:ipad 100:mobile_web 101:pc_web
        var platform = cc.Application.getInstance().getTargetPlatform(); 
        if(platform == 100 || platform == 101){
            var toObjString = this.storage.getJson();
            var toObj = JSON.parse(toObjString);
            window.localStorage.setItem("gameStorage",JSON.stringify(toObj));
        }*/
    },

    onCharaSelect:function () {
        this.storage = getStageDataFromJson(this.storage,this.storage.stageNumber);
        cc.LoaderScene.preload(g_resources, function () {
            var scene = cc.Scene.create();
            scene.addChild(CharaSelectLayer.create(this.storage));
            cc.Director.getInstance().replaceScene(cc.TransitionSlideInL.create(1.2, scene));
        }, this);
    },
    
    onRetryGame:function () {
        this.storage = getStageDataFromJson(this.storage,this.storage.stageNumber);
        cc.LoaderScene.preload(g_resources, function () {
            var scene = cc.Scene.create();
            scene.addChild(GameLayer.create(this.storage));
            cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
        }, this);
    },

    isToucheable:function (){
        return true;
    }
});

GameLayer.create = function (storage) {
    var sg = new GameLayer(storage);
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

