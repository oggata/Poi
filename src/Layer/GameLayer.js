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

        this.stageInformation = new stageInformation(this);

        this.setParams();
        this.setScrollView();
        this.stage = new Stage(this);
        

        //set player
        this.player = new Player(this);
        this.player.setPosition(800,30);
        this.mapNode.addChild(this.player);

        //destinationSprite
        this.destinationSprite = cc.Sprite.create(s_target);
        this.destinationSprite.setPosition(800,30);
        this.mapNode.addChild(this.destinationSprite);

        //targetedSprite
        this.targetedSprite = cc.Sprite.create(s_marker);//s_marker
        this.mapNode.addChild(this.targetedSprite);
        this.targetedSprite.setVisible(false);
      
/*
        //timerSprite
        this.timerSprite = cc.Sprite.create(s_timer,cc.rect(50*0,0,50,50));
        this.timerSprite.setPosition(800,220);
        this.mapNode.addChild(this.timerSprite,9999999);
        this.timerImage = cc.TextureCache.getInstance().addImage(s_timer);
        this.timerSprite.setTexture(this.timerImage);
*/

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

        this.launchColleague = new launchColleague(this);

        for(var i=0;i<this.storage.stageEnemies.length;i++){
            var enemyData = this.storage.stageEnemies[i];
            this.addEnemyByPos(enemyData["enemyId"],enemyData["route"]);
        }

        //ゲームオーバー or クリア後の背景
        this.back = cc.LayerColor.create(cc.c4b(0,0,0,255),320,480);
        this.back.setPosition(0,0);
        this.addChild(this.back,CONFIG.UI_DROW_ORDER);
        this.rectBaseAlpha = 0;
        this.back.setOpacity(0);

        //(ゲームオーバー時)retryボタン
        this.retryButton = new ButtonSprite("リトライ",200,50,this.goToGameLayer,this);
        this.retryButton.setPosition(160,120);
        this.addChild(this.retryButton,CONFIG.UI_DROW_ORDER);
        this.retryButton.setVisible(false);

        //(ゲームオーバー時)nextボタン
        this.changeButton = new ButtonSprite("キャラ選択",200,50,this.goToGameLayer,this);
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

        //(ターゲット破壊)の文字
        this.txtDestroy = cc.Sprite.create(s_text_destroy);
        this.txtDestroy.setAnchorPoint(0,0);
        //this.txtDestroy.setPosition(320/2,480/2);
        this.addChild(this.txtDestroy,CONFIG.UI_DROW_ORDER);
        this.txtDestroy.setVisible(false);

        this.destroyAnimation3 = cc.LayerColor.create(cc.c4b(25,25,112,255),320,480);
        this.destroyAnimation3.setAnchorPoint(0,0);
        this.mapNode.addChild(this.destroyAnimation3,9999999999999998);

        //崩壊
        var frameSeqEffect2= [];
        for (var y = 0; y < 9; y++) {
            for (var x = 0; x < 1; x++) {
                var frame = cc.SpriteFrame.create(effect_tsunami,cc.rect(320*x,120*y,320,120));
                frameSeqEffect2.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeqEffect2,0.2);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.destroyAnimation2 = cc.Sprite.create(effect_sand,cc.rect(0,0,320,120));
        this.destroyAnimation2.runAction(this.ra);
        //this.destroyAnimation2.setScale(3,3);
        this.destroyAnimation2.setAnchorPoint(0,0);
        //this.destroyAnimation2.setPosition(400,0);
        this.mapNode.addChild(this.destroyAnimation2,9999999999999999);

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
        this.resultButton = new ButtonSprite("-結果画面へ-",200,40,this.goResultLayer,this);
        this.resultButton.setPosition(320/2,80);
        this.addChild(this.resultButton,CONFIG.UI_DROW_ORDER);
        this.resultButton.setVisible(false);

        //破壊エフェクト
        var frameSeqEffect= [];
        for (var y = 0; y < 9; y++) {
            for (var x = 0; x < 1; x++) {
                var frame = cc.SpriteFrame.create(effect_destroy,cc.rect(320*x,120*y,320,120));
                frameSeqEffect.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeqEffect,0.2);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.destroyAnimation = cc.Sprite.create(effect_destroy,cc.rect(0,0,320,120));
        this.destroyAnimation.runAction(this.ra);
        this.destroyAnimation.setScale(1,1.4);
        this.mapNode.addChild(this.destroyAnimation,999999999);

        this.safeMarker001Sprite = cc.Sprite.create(s_marker1);
        this.mapNode.addChild(this.safeMarker001Sprite);

        this.safeMarker002Sprite = cc.Sprite.create(s_marker1);
        this.mapNode.addChild(this.safeMarker002Sprite);

        this.safeMarker003Sprite = cc.Sprite.create(s_marker1);
        this.mapNode.addChild(this.safeMarker003Sprite);

        this.safeMarker004Sprite = cc.Sprite.create(s_marker1);
        this.mapNode.addChild(this.safeMarker004Sprite);

/*
        //左上
        this.safeMarker001Sprite.setPosition(this.cameraX * -1 + 60, this.cameraY * -1 + 390);
        //右上
        this.safeMarker002Sprite.setPosition(this.cameraX * -1 + 260,this.cameraY * -1 + 390);
        //左下
        this.safeMarker003Sprite.setPosition(this.cameraX * -1 + 60, this.cameraY * -1 + 90);
        //右下
        this.safeMarker004Sprite.setPosition(this.cameraX * -1 + 260,this.cameraY * -1 + 90);

*/

        this.scheduleUpdate();
        this.setTouchEnabled(true);
        return true;
    },

    startGame : function() {
        if(this.isMissionVisible == true){
            playSystemButton();
            this.isMissionVisible = false;
            this.titleLabel.setVisible(false);
            this.rectBase.setVisible(false);
            this.titleLimit.setVisible(false);
        }
    },

    isCameraRange:function(posX,posY){
        if(this.cameraX * -1 + 10 < posX && posX < this.cameraX * -1 + 310
            && this.cameraY * -1 + 10 < posY && posY < this.cameraY * -1 + 470
        ){
            return true;
        }
        return false;
    },

    setScrollView : function() {
        //ウィンドウのサイズを取得する
        var winSize = cc.Director.getInstance().getWinSize();

        //スクロールさせる対象のmapNodeを作る
        this.mapNode = cc.Node.create();

        //スクロールViewを追加
        this.addChild(this.mapNode);
    },

    setParams : function() {
        this.storage.coinAmount = 15;
        this.mapWidth         = 1000;
        this.mapHeight        = 1000;
        this.isMissionVisible = true;
        this.isMovedResult    = false;

        //仲間の数
        this.killedEnemyCnt   = 0;
        this.mapScale         = 1;
        this.territoryCnt     = 0;
        this.coins            = [];
        this.bullets          = [];
        this.enemyBullets     = [];
        this.colleagueBullets = [];
        this.enemies          = [];
        this.colleagues       = [];
        //mission
        this.missionNumber    = this.storage.missionNumber;
        this.missionLabel     = this.storage.missionTitle;
        this.missionCnt       = 0;
        this.missionMaxCnt    = this.storage.missionMaxCnt;
        this.timeCnt          = 0;
        this.missionTimeLimit = this.storage.missionTimeLimit;
        this.criticalPower    = 0;
        this.criticalMaxPower =100;
        this.visibleMissionTitleCnt = 0;
        this.shakeCameraPosY  = 0;
        this.flyTime          = 0;
        this.isFly            = false;
        this.isSetNavi        = false;
        this.cutInTime        = 0;

        this.beforeSlideButtonX = -320*1;
        this.slideButtonX     = -320*1;
        this.firstTouchX      = 0;
        this.launchColleagueType = 1;
        this.destroyY = -200;

        this.damangeTexts = [];
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

        this.navi = new Navi(this);
        this.addChild(this.navi);
    },

    setCutIn:function(target){
        this.cutInTime   = 1;
        this.cutInTarget = target;
        this.destroyAnimation.setPosition(target.getPosition().x,target.getPosition().y);
    },

    update:function(dt){

        //左上
        this.safeMarker001Sprite.setPosition(this.cameraX * -1 + 10, this.cameraY * -1 + 470);
        //右上
        this.safeMarker002Sprite.setPosition(this.cameraX * -1 + 310,this.cameraY * -1 + 470);
        //左下
        this.safeMarker003Sprite.setPosition(this.cameraX * -1 + 10, this.cameraY * -1 + 10);
        //右下
        this.safeMarker004Sprite.setPosition(this.cameraX * -1 + 310,this.cameraY * -1 + 10);


        //ダメージを受けたら表示する漫画テキスト
        for(var i=0;i<this.damangeTexts.length;i++){
            if(this.damangeTexts[i].update() == false){
                //ここでRemoveしないと、spriteがどんどん増えていく
                this.removeChild(this.damangeTexts[i]);
                this.damangeTexts.splice(i, 1);
            }
        }

        this.destroyAnimation3.setPosition(this.cameraX * -1,this.destroyY - 480);
        this.destroyAnimation2.setPosition(this.cameraX * -1,this.destroyY);
        if(this.stage.isMissionClear()){
            this.destroyY+=1.4;
        }

        //常にステージ上に5個はコインをばらまく
        if(this.coins.length < 10){
            this.stage.addCoin(
                getRandNumberFromRange(230,1200),
                getRandNumberFromRange(1,500)
            );     
        }

        //左 0 
        if(0 < this.slideButtonX){
            this.launchColleagueType = 2;
            this.slideButtonX-=10;
        }
        if(-160 < this.slideButtonX && this.slideButtonX < 0){
            this.launchColleagueType = 2;
            this.slideButtonX+=10;
        }
        //中央 320
        if(-320 < this.slideButtonX && this.slideButtonX < -160){
            this.launchColleagueType = 1;
            this.slideButtonX-=10;
        }
        if(-480 < this.slideButtonX && this.slideButtonX < -320){
            this.launchColleagueType = 1;
            this.slideButtonX+=10;
        }
        //右 640
        if(-640 < this.slideButtonX && this.slideButtonX < -480){
            this.launchColleagueType = 3;
            this.slideButtonX-=10;
        }
        if(this.slideButtonX < -640){
            this.launchColleagueType = 3;
            this.slideButtonX+=10;
        }
        this.beforeSlideButtonX = this.slideButtonX;
        this.gameUI.slideButton.setPosition(this.slideButtonX,0);

        if(this.cutInTime >= 1){
            this.cutInTime++;
            if(this.cutInTime>=30*2){
                this.cutInTime=0;
            }
            this.moveCamera2(this.cutInTarget);
            this.txtDestroy.setVisible(true);
            this.destroyAnimation.setVisible(true);
            return;
        }else{
            this.txtDestroy.setVisible(false);
            this.destroyAnimation.setVisible(false);
        }
        this.moveCamera();
        this.gameUI.update();
        this.stage.update();
        this.collisionAll();
        this.navi.update();
        this.visibleMissionTitleCnt++;

        if(this.visibleMissionTitleCnt>=30*2){
            this.visibleMissionTitleCnt = 30;
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

        //ミッションクリア
        if(this.stage.isMissionClear()){
            this.isDamageShake();
        }

        //ゲームクリア
        if(this.stage.isGameClear()){
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

        //ゲームオーバー
        if(this.stage.isGameOver()){
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

        //プレイヤー
        this.player.update();
        this.mapNode.reorderChild(
            this.player,
            Math.floor(this.mapHeight - this.player.getPosition().y)
        );
        this.player.setDirection(this.destinationSprite);

        if(this.player.targetChip != null){
            this.destinationSprite.setVisible(false);
            this.targetedSprite.setVisible(true);
            this.targetedSprite.setPosition(
                this.player.targetChip.getPosition().x,
                this.player.targetChip.getPosition().y
            );
        }else if(this.player.targetEnemy != null){
            this.destinationSprite.setVisible(false);
            this.targetedSprite.setVisible(true);
            if(this.player.targetEnemy){
                this.targetedSprite.setPosition(
                    this.player.targetEnemy.getPosition().x,
                    this.player.targetEnemy.getPosition().y
                );
            }
        }else{
            this.destinationSprite.setVisible(true);
            this.targetedSprite.setVisible(false);
            this.player.moveToTargetMarker(this.destinationSprite);
        }

        //Playerの死亡時には生き残っている仲間がいれはスイッチする
        if(this.player.hp <= 0){
            if(this.stage.isMissionAchieved == true && this.isMovedResult == false){
                this.isMovedResult = true;
                this.goGameOverLayer();
            }else if(this.colleagues.length == 0 && this.isMovedResult == false){
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
        for(var i=0;i<this.colleagues.length;i++){
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

        //レンダリング時のパフォーマンスを制御する
        adjustRenderPerformance(this);
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
            this.coins[i].update();
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
        this.launchColleague.update();
    },

    getColleagueCnt:function(){
        return this.colleagues.length;
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

    addColleagueBullet:function(enemy,colleague){
        var colleagueBullet = new Bullet(enemy,"test",this);
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
        collisionSpriteAndSprite(this.colleagues);

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
        collisionSpriteAndSprite(this.enemies);

        //敵 & 敵
        collisionEnemyAndEnemy(this.enemies);

        //プレイヤー & マップチップ
        collisionPlayerAndChip(this);

        //仲間 & マップチップ
        collisionColleagueAndChip(this);

        collisionCollegueBulletsAndEnemy(this.colleagueBullets,this.enemies);
    },

    moveCamera2:function(target){
        //カメラ位置はプレイヤーを追いかける
        this.playerCameraX = target.getPosition().x + this.cameraX;
        this.playerCameraY = target.getPosition().y + this.cameraY;
        
        //xの中心は320/2=16 +- 20
        if(this.playerCameraX >= 320/2 + 20){
            this.cameraX -= 20;
        }
        if(this.playerCameraX <= 320/2 - 20){
            this.cameraX += 20;
        }
        //yの中心は420/2=210 +- 20
        if(this.playerCameraY >= 420/2 - 20){
            this.cameraY -= 20;
        }
        if(this.playerCameraY <= 420/2 + 20){
            this.cameraY += 20;
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
            this.cameraY + this.shakeCameraPosY
        );
    },

    addDamageText:function(mapX,mapY){
        this.damageText = new DamageText();
        this.mapNode.addChild(this.damageText,99999999999);
        this.damageText.setPosition(mapX,mapY);
        this.damangeTexts.push(this.damageText);
    },

    addDamageText2:function(mapX,mapY){
        this.damageText = new DamageText(2);
        this.mapNode.addChild(this.damageText,99999999999);
        this.damageText.setPosition(mapX + getRandNumberFromRange(-100,100),mapY + getRandNumberFromRange(-20,100));
        this.damangeTexts.push(this.damageText);
    },

    addDamageText3:function(mapX,mapY){
        this.damageText = new DamageText(3);
        this.mapNode.addChild(this.damageText,99999999999);
        this.damageText.setPosition(mapX,mapY);
        this.damangeTexts.push(this.damageText);
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
            this.cameraY + this.shakeCameraPosY
        );
    },

    isDamageShake:function(){
        this.shakeCameraPosY+=5;
        if(this.shakeCameraPosY>=10){
            this.shakeCameraPosY = 0;
        }
    },

    addColleagues:function(num,type,chip){
        for (var i=0 ; i <  num ; i++){            
            if(chip == null){
                var depX = getRandNumberFromRange(this.player.getPosition().x - 5,this.player.getPosition().x + 5);
                var depY = getRandNumberFromRange(this.player.getPosition().y - 5,this.player.getPosition().y + 5);
            }else{
                var depX = getRandNumberFromRange(chip.getPosition().x - 5,chip.getPosition().x + 5);
                var depY = getRandNumberFromRange(chip.getPosition().y - 5,chip.getPosition().y + 5);
            }
            this.colleague = new Colleague(this,type);
            this.colleague.setPos(depX,depY);
            this.mapNode.addChild(this.colleague);
            this.colleagues.push(this.colleague);
            this.colleague.jumpY = 100;
            this.addDamageText2(depX,depY);
        }
    },
/*
    addColleaguesByInterval:function(num,type,chip){
        var addColleagueCnt += num;
        for (var i=0 ; i <  addColleagueCnt ; i++){            
            if(chip == null){
                var depX = getRandNumberFromRange(this.player.getPosition().x - 5,this.player.getPosition().x + 5);
                var depY = getRandNumberFromRange(this.player.getPosition().y - 5,this.player.getPosition().y + 5);
            }else{
                var depX = getRandNumberFromRange(chip.getPosition().x - 5,chip.getPosition().x + 5);
                var depY = getRandNumberFromRange(chip.getPosition().y - 5,chip.getPosition().y + 5);
            }
            this.colleague = new Colleague(this,type,depX,depY);
            this.mapNode.addChild(this.colleague);
            this.colleagues.push(this.colleague);
            this.colleague.jumpY = 100;
        }
    },
*/
    addEnemyByPos : function(code,routes){
        this.enemy = new Enemy(this,code,routes);
        this.mapNode.addChild(this.enemy);
        this.enemies.push(this.enemy);
    },
/*
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
*/
    //デバイス入力----->
    onTouchesBegan:function (touches, event) {
        if(this.isToucheable() == false) return;
        this.touched = touches[0].getLocation();

        //どのタイプが一番多いか確認する
        var type1Cnt = this.stageInformation.getColleaguesCnt(1);
        var type2Cnt = this.stageInformation.getColleaguesCnt(2);
        var type3Cnt = this.stageInformation.getColleaguesCnt(3);
        if((type1Cnt > 0) && (type2Cnt == 0) && (type3Cnt == 0)){
            this.slideButtonX = -320;
            this.launchColleagueType = 1;
        }
        if((type1Cnt == 0) && (type2Cnt > 0) && (type3Cnt == 0)){
            this.slideButtonX = 0;
            this.launchColleagueType = 2;
        }
        if((type1Cnt == 0) && (type2Cnt == 0) && (type3Cnt > 0)){
            this.slideButtonX = -640;
            this.launchColleagueType = 3;
        }


        if((this.touched.y <= 80) && (this.player.targetEnemy != null || this.player.targetChip != null)){
            
this.gameUI.isSetUIEffect();
            if(this.player.targetChip != null){
                if(this.player.targetChip.type == "poi_red"){
                    if(this.storage.coinAmount>=1){
                        this.storage.coinAmount-=1;
                        this.addColleagues(1,1,this.player.targetChip);
                    }
                }
                if(this.player.targetChip.type == "poi_blue"){
                    if(this.storage.coinAmount>=1){
                        this.storage.coinAmount-=1;
                        this.addColleagues(1,2,this.player.targetChip);
                    }
                }
                if(this.player.targetChip.type == "poi_yellow"){
                    if(this.storage.coinAmount>=1){
                        this.storage.coinAmount-=1;
                        this.addColleagues(1,3,this.player.targetChip);
                    }
                }
                if(this.player.targetChip.type == "tree"){
                    setTargetBuilding(this);
                }
            }
            if(this.player.targetEnemy != null){
                setTargetEnemy(this);
            }
        }else{
            var tPosX = (this.touched.x - this.cameraX) / this.mapScale;
            var tPosY = (this.touched.y - this.cameraY) / this.mapScale;   
            this.destinationSprite.setPosition(tPosX,tPosY);
            this.player.targetEnemy = null;
            this.player.targetChip  = null;
            for(var i=0;i<this.enemies.length;i++){
                var distance = cc.pDistance(this.destinationSprite.getPosition(),this.enemies[i].getPosition());
                if(distance <= 50){
                    this.player.targetEnemy = this.enemies[i];
                    return;
                }
             }
             for(var i=0;i<this.stage.chips.length;i++){
                var distance = cc.pDistance(this.destinationSprite.getPosition(),this.stage.chips[i].getPosition());
                if(distance <= 50){
                    if(this.stage.chips[i].isOccupieType()==true){
                        this.player.targetChip = this.stage.chips[i];
                    }
                }
            }
        }

        this.firstTouchX = this.touched.x;
    },

    onTouchesMoved:function (touches, event) {
        if(this.isToucheable() == false) return;
        this.touched = touches[0].getLocation();
        if((this.touched.y <= 80) && (this.player.targetEnemy != null || this.player.targetChip != null)){
            var sabun = this.touched.x - this.firstTouchX;
            this.slideButtonX = this.beforeSlideButtonX + sabun
        }
    },

    onTouchesEnded:function (touches, event) {
        if(this.isToucheable() == false) return;
        this.beforeSlideButtonX = this.slideButtonX;
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
        this.stage.setGameOverStatus();
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
    
    goToGameLayer:function () {
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

