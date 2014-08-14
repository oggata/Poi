//
//  SysMenu.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

cc.dumpConfig();

var SysMenu = cc.Layer.extend({
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
        var sp = cc.Sprite.create(s_top);
        sp.setAnchorPoint(0,0);
        this.addChild(sp,0,1);

        //タイトルの一覧を取得
        this.goToQuestButton = new ButtonSprite("クエストに出発する",250,60,this.goToQuestLayer,this);
        this.goToQuestButton.setPosition(160,110);
        this.addChild(this.goToQuestButton);

        //score
        this.infoTextPosX = 320;
        this.infoTextPosY = 60;

        rtn = "全6ステージの体験版(ver1.01)です。SCORE---->";
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

    goToQuestLayer:function (stageNum) {
        playSystemButton();
        cc.LoaderScene.preload(g_chara_select_resources, function () {
            var scene = cc.Scene.create();
            scene.addChild(QuestLayer.create(this.storage));
            //scene.addChild(ResultLayer.create(this.storage));
            //scene.addChild(StoryLayer.create(this.storage));
            cc.Director.getInstance().replaceScene(cc.TransitionProgressHorizontal.create(1.2, scene));
        }, this);
    },
});

SysMenu.create = function () {
    var sg = new SysMenu();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

SysMenu.scene = function () {
    var scene = cc.Scene.create();
    var layer = SysMenu.create();
    scene.addChild(layer);
    return scene;
};

//for XCode Compile
var MyScene = cc.Scene.extend({
    ctor:function() {
        this._super();
        //cc.associateWithNative( this, cc.Scene );
    },
    onEnter:function () {
        this._super();
        var layer = new SysMenu();
        this.addChild(layer);
        layer.init();
    }
});

