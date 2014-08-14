//
//  QuestLayer.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var QuestLayer = cc.Layer.extend({
    init:function (storage) {
        //bgm
        playSystemBGM();
        changeLoadingImage();
        this.storage = storage;

        var back = cc.Sprite.create(loading_png);
        back.setAnchorPoint(0,0);
        this.addChild(back);

        //クエストをセットする
        this.setQuestColumns();

        //score
        this.infoTextPosX = 320;
        this.infoTextPosY = 70;

        rtn = "全5ステージの体験版(ver1.01)です。SCORE---->";
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

    update:function(dt){
        //ゲームの情報を右から左に流す
        this.infoText.setPosition(this.infoTextPosX,this.infoTextPosY);
        this.infoTextPosX -= 1;
        if(this.infoTextPosX <= -900){
            this.infoTextPosX = 320;
        }
    },

    goToGameLayer:function (stageNum) {
        playSystemButton();

        cc.LoaderScene.preload(g_resources, function () {
            var scene = cc.Scene.create();

            //ステージ情報（難易度）を取得する
            this.storage = getStageDataFromJson(this.storage,stageNum);

            //選択したキャラクターから、プレイヤーパラメータを取得する
            storage = getCharactorDataFromJson(this.storage,1);
            scene.addChild(GameLayer.create(this.storage));

            cc.Director.getInstance().replaceScene(cc.TransitionProgressHorizontal.create(1.2, scene));
        }, this);
    },

    setQuestColumns:function(){
        //タイトルの一覧を取得
        getStageTitlesFromJson(this.storage);

        this.stage001Button = new ButtonSprite(this.storage.stageTitles[1],250,40,this.goSt01,this);
        this.stage001Button.setPosition(160,380);
        this.addChild(this.stage001Button);

        this.stage002Button = new ButtonSprite(this.storage.stageTitles[2],250,40,this.goSt02,this);
        this.stage002Button.setPosition(160,380 - 50 * 1);
        this.addChild(this.stage002Button);

        this.stage003Button = new ButtonSprite(this.storage.stageTitles[3],250,40,this.goSt03,this);
        this.stage003Button.setPosition(160,380 - 50 * 2);
        this.addChild(this.stage003Button);

        this.stage004Button = new ButtonSprite(this.storage.stageTitles[4],250,40,this.goSt04,this);
        this.stage004Button.setPosition(160,380 - 50 * 3);
        this.addChild(this.stage004Button);

        this.stage005Button = new ButtonSprite(this.storage.stageTitles[5],250,40,this.goSt05,this);
        this.stage005Button.setPosition(160,380 - 50 * 4);
        this.addChild(this.stage005Button);

        this.stage006Button = new ButtonSprite(this.storage.stageTitles[6],250,40,this.goSt06,this);
        this.stage006Button.setPosition(160,380 - 50 * 5);
        this.addChild(this.stage006Button);
    },

    goSt01:function(dt){
        this.goToGameLayer(1);
    },
    goSt02:function(dt){
        this.goToGameLayer(2);
    },
    goSt03:function(dt){
        this.goToGameLayer(3);
    },
    goSt04:function(dt){
        this.goToGameLayer(4);
    },
    goSt05:function(dt){
        this.goToGameLayer(5);
    },
    goSt06:function(dt){
        this.goToGameLayer(6);
    },
});

QuestLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = QuestLayer.create();
    scene.addChild(layer);
    return scene;
};

QuestLayer.create = function (storage) {
    var sg = new QuestLayer();
    if (sg && sg.init(storage)) {
        return sg;
    }
    return null;
};
