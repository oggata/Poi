//
//  TutolialLayer.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var QuestLayer = cc.Layer.extend({
    init:function () {
        //bgm
        playSystemBGM();
        changeLoadingImage();
        var userGameStatus = 1; // 1:新規 2:保存データあり 3:クリア後

        //3:android 4:iphone 5:ipad 100:mobile_web 101:pc_web
        var platform = cc.Application.getInstance().getTargetPlatform();
        this.storage = new Storage();  
        if(platform == 100 || platform == 101){
            //データのロード
            //var jsonFile = {author:"isaac","description":"fresheggs","rating":100,"saveData":false};
            //window.localStorage.setItem("gameStorage",JSON.stringify(jsonFile));
            if (!window.localStorage) {
                alert("このブラウザではゲーム状態の保存ができません。(ERR:localStorage)");
                return;
            }
            try{
                var storageData = JSON.parse(window.localStorage.getItem("gameStorage"));
                if(storageData["saveData"] == true){
                    cc.log("保存されたデータがあります");
                    this.storage.setJson(storageData);
                    userGameStatus = 2;
                }else{
                    cc.log("保存されたデータはありません");
                }
            }catch(e){
                cc.log("保存されたデータはありません");
            }
        }

        //back
        var sp = cc.Sprite.create(loading_png);
        sp.setAnchorPoint(0,0);
        this.addChild(sp, 0, 1);

        //タイトルの一覧を取得
        getStageTitlesFromJson(this.storage);

        this.stage001Button = new ButtonItem(this.storage.stageTitles[1],250,40,this.goSt01,this);
        this.stage001Button.setPosition(160,380);
        this.addChild(this.stage001Button);

        this.stage002Button = new ButtonItem(this.storage.stageTitles[2],250,40,this.goSt02,this);
        this.stage002Button.setPosition(160,380 - 50 * 1);
        this.addChild(this.stage002Button);

        this.stage003Button = new ButtonItem(this.storage.stageTitles[3],250,40,this.goSt03,this);
        this.stage003Button.setPosition(160,380 - 50 * 2);
        this.addChild(this.stage003Button);

        //new stage003Button
        this.stage004Button = new ButtonItem(this.storage.stageTitles[4],250,40,this.goSt04,this);
        this.stage004Button.setPosition(160,380 - 50 * 3);
        this.addChild(this.stage004Button);

        //story & tutorial
        this.stage005Button = new ButtonItem(this.storage.stageTitles[5],250,40,this.goSt05,this);
        this.stage005Button.setPosition(160,380 - 50 * 4);
        this.addChild(this.stage005Button);

        this.stage006Button = new ButtonItem(this.storage.stageTitles[6],250,40,this.goSt06,this);
        this.stage006Button.setPosition(160,380 - 50 * 5);
        this.addChild(this.stage006Button);

/*
        //load game
        var loadGameTitle = "LOAD GAME (cleared)";
        if(this.storage.maxStageNumber < CONFIG.MAX_STAGE_NUMBER){
            loadGameTitle = "LOAD GAME (stage:" + Math.floor(this.storage.maxStageNumber) + ")";
        }
        this.loadGameButton = new ButtonItem(loadGameTitle,200,40,this.onLoadGame,this);
        this.loadGameButton.setPosition(160,130);
        this.addChild(this.loadGameButton);
        if(userGameStatus == 1){
            //保存データがない人はロードボタンを表示させない
            this.loadGameButton.set_visible(false);
        }
*/
        // debug
        this.label = cc.LabelTTF.create("DEBUG", "Arial", 18);
        this.debugModeButton = cc.MenuItemLabel.create(this.label,this.onDebugMode,this);
        this.debugModeButton.setPosition(320/2,400);
        if(CONFIG.DEBUG_FLAG == 1){
            this.debugModeButton.setVisible(true);
        }else{
            this.debugModeButton.setVisible(false);
        }
        var menu = cc.Menu.create(
            this.debugModeButton
        );
        menu.setPosition(0,0);
        this.addChild(menu);

        //score
        this.infoTextPosX = 320;
        this.infoTextPosY = 450;

        rtn = "全6ステージの体験版(ver1.01)です。データはブラウザに保存されます。SCORE---->";
        rtn += '到達したステージ:' + this.storage.maxStageNumber + ' ';
        rtn += '合計スコア × ' + this.storage.totalGameScore + ' ';
        rtn += '占領した土地 × ' + this.storage.totalOccupiedCnt + ' ';
        rtn += '敵を倒した数 × ' + this.storage.totalKilledEnemyCnt + ' ';
        rtn += '味方を生産した数 × ' + this.storage.totalProductCnt + ' ';
        rtn += 'エナジー数 × ' + this.storage.totalCoinAmount + '';

        this.infoText = cc.LabelTTF.create(rtn,"Arial",15);
        this.infoText.setAnchorPoint(0,0);
        this.infoText.setPosition(this.infoTextPosX,this.infoTextPosY);
        this.addChild(this.infoText);

        this.scheduleUpdate();
        this.setTouchEnabled(true);

        return true;
    },

    goSt01:function(dt){
        this.onStageGame(1);
    },
    goSt02:function(dt){
        this.onStageGame(2);
    },
    goSt03:function(dt){
        this.onStageGame(3);
    },
    goSt04:function(dt){
        this.onStageGame(4);
    },
    goSt05:function(dt){
        this.onStageGame(5);
    },
    goSt06:function(dt){
        this.onStageGame(6);
    },

    update:function(dt){
        //ゲームの情報を右から左に流す
        this.infoText.setPosition(this.infoTextPosX,this.infoTextPosY);
        this.infoTextPosX -= 1;
        if(this.infoTextPosX <= -900){
            this.infoTextPosX = 320;
        }
    },

    onNewGame:function (pSender) {
        playSystemButton();

        cc.LoaderScene.preload(g_chara_select_resources, function () {
            var scene = cc.Scene.create();

            //ステージ情報（難易度）を取得する
            this.storage = getStageDataFromJson(this.storage,1);

            scene.addChild(CharaSelectLayer.create(this.storage));
            cc.Director.getInstance().replaceScene(cc.TransitionSlideInR.create(1.2, scene));
        }, this);
    },

    onStageGame:function (stageNum) {
        playSystemButton();

        cc.LoaderScene.preload(g_chara_select_resources, function () {
            var scene = cc.Scene.create();

            //ステージ情報（難易度）を取得する
            this.storage = getStageDataFromJson(this.storage,stageNum);

            scene.addChild(CharaSelectLayer.create(this.storage));
            cc.Director.getInstance().replaceScene(cc.TransitionSlideInR.create(1.2, scene));
        }, this);
    },

    onLoadGame:function (pSender) {
        playSystemButton();

        if(this.storage.maxStageNumber >= CONFIG.MAX_STAGE_NUMBER){
            //全クリア
            var scene = cc.Scene.create();
            scene.addChild(StaffRollLayer.create(this.storage));
            cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
        }else{
            cc.LoaderScene.preload(g_chara_select_resources, function () {
                var scene = cc.Scene.create();

                //ステージ情報（難易度）を取得する
                this.storage = getStageDataFromJson(this.storage,this.storage.maxStageNumber);

                scene.addChild(CharaSelectLayer.create(this.storage));
                cc.Director.getInstance().replaceScene(cc.TransitionSlideInR.create(1.2, scene));
            }, this);
        }
    },

    onTutorial:function (pSender) {
        playSystemButton();

        cc.LoaderScene.preload(g_chara_select_resources, function () {
            var scene = cc.Scene.create();
            scene.addChild(TutolialLayer.create());
            cc.Director.getInstance().replaceScene(cc.TransitionSlideInR.create(1.2, scene));
        }, this);
    },

    onDebugMode:function (pSender) {

        this.storage.resetJson();
        //var jsonFile = {"saveData":false};
        //localStorage.setItem("gameStorage",JSON.stringify(jsonFile));
        localStorage.removeItem("gameStorage");

        playSystemButton();

        cc.LoaderScene.preload(g_resources, function () {

            //ゲーム情報を記録するstorageをnewする
            var storage = new Storage();

            //プレイヤーパラメータを取得する
            storage = getCharactorDataFromJson(storage,0);

            //ステージ情報を取得する
            storage = getStageDataFromJson(storage,CONFIG.DEBUG_STAGE_NUM);

            //storage.coinAmount = 50;

            var scene = cc.Scene.create();
            scene.addChild(GameLayer.create(storage));
            //scene.addChild(StaffRollLayer.create(storage));

            cc.Director.getInstance().replaceScene(cc.TransitionSlideInR.create(1.2, scene));
        }, this);
    },
});

QuestLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = QuestLayer.create();
    scene.addChild(layer);
    return scene;
};

QuestLayer.create = function () {
    var sg = new QuestLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
