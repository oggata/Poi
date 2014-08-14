//
//  ResultLayer.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var ResultLayer = cc.Layer.extend({

    ctor:function (storage) {
        this._super();
        this.storage  = storage;
    },

    init:function () {
        var bRet = false;
        if (this._super()) {
            //getItem->getExp->powerUp->finish
            this.sceneType = "getItem";

            //bgm
            playSystemBGM();
            changeLoadingImage();

            //back
            var back = cc.Sprite.create(s_result_clear);
            back.setAnchorPoint(0,0);
            this.addChild(back,0,1);

            //背景
            this.rectBase = cc.LayerColor.create(cc.c4b(0,0,0,255 * 0.8),320,480);
            this.rectBase.setPosition(0,0);
            this.addChild(this.rectBase,CONFIG.UI_DROW_ORDER);
            this.rectBaseAlpha = 0;
            this.rectBase.setOpacity(255*this.rectBaseAlpha);

            //取得アイテム
            this.specialItem = cc.Sprite.create(s_item_001);
            //this.specialItem.setAnchorPoint(0,0);
            this.specialItem.setPosition(320/2,480/2);
            this.addChild(this.specialItem,CONFIG.UI_DROW_ORDER);

            this.txtSpecialItem = cc.Sprite.create(s_special_item);
            this.txtSpecialItem.setPosition(320/2,380);
            this.addChild(this.txtSpecialItem,CONFIG.UI_DROW_ORDER);

            this.itemInfoText = cc.LabelTTF.create(
                "タイムストッパー" + "\n"
                + "マップ上の時間を止める事ができる" + "\n"
                + "" + "\n"
            ,"Arial",13);
            this.itemInfoText.setAnchorPoint(0,0.5);       
            this.itemInfoText.setPosition(40,120);
            this.itemInfoText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this.addChild(this.itemInfoText,CONFIG.UI_DROW_ORDER);
            this.itemInfoText.setVisible(false);

            //受け取りボタン
            this.getItemButton = new ButtonSprite("-次へ-",200,40,this.onGotItem,this);
            this.getItemButton.setPosition(320/2,80);
            this.addChild(this.getItemButton,CONFIG.UI_DROW_ORDER);
            this.addChild(this.getItemButton);

            this.resultText = cc.LabelTTF.create(
                  "報酬-------------------" + "\n"
                + "" + "\n"
                + "" + "\n"
                + "経験値-----------------" + "\n"
                + "" + "\n"
                + "" + "\n"
            ,"Arial",20);
            this.resultText.setAnchorPoint(0,0.5);       
            this.resultText.setPosition(40,250);
            this.resultText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this.addChild(this.resultText);

            //お金
            this.amount = 0;
            this.amountText = cc.LabelTTF.create(
                this.amount,
                "Arial",
                38
            );
            this.amountText.setAnchorPoint(0.5,0);       
            this.amountText.setPosition(320/2,270);
            this.addChild(this.amountText);

            //経験値
            this.exp= 0;
            this.expText = cc.LabelTTF.create(
                getZeroPaddingNumber(this.exp,6),
                "Arial",
                38
            );
            this.expText.setAnchorPoint(0.5,0);       
            this.expText.setPosition(320/2,200);
            this.addChild(this.expText);
 
            //ホームボタン
            var homeButton = cc.MenuItemImage.create(
                s_home_button,
                s_home_button_on,
                onBackCallback,
                this
            );
            homeButton.setAnchorPoint(0,0);
            homeButton.setPosition(250,410);

            //set header
            this.menu = cc.Menu.create(
                homeButton
            );
            this.addChild(this.menu);
            this.menu.setPosition(0,0);

/*
            //ツイッターへ投稿するボタン
            var twitterButton = cc.MenuItemImage.create(
                s_twitter_button,
                s_twitter_button_on,
                this.onTweet,
                this
            );
            twitterButton.setAnchorPoint(0,0);
            twitterButton.setPosition(210,160);

            //Facebookに投稿するボタン
            var facebookButton = cc.MenuItemImage.create(
                s_facebook_button,
                s_facebook_button_on,
                this.onFacebook,
                this
            );
            facebookButton.setAnchorPoint(0,0);
            facebookButton.setPosition(250,160);
            this.menu = cc.Menu.create(
                twitterButton,
                facebookButton
            );
            this.addChild(this.menu);
            this.menu.setPosition(0,0);
*/

            this.scheduleUpdate();
            this.setTouchEnabled(true);
            bRet = true;
        }
        return bRet;
    },

    update:function(dt){

        if(this.sceneType=="getItem"){
            this.rectBaseAlpha+=0.03;
            if(this.rectBaseAlpha>0.9){
                this.rectBaseAlpha = 0.9
            }
            this.rectBase.setOpacity(255*this.rectBaseAlpha);
            this.itemInfoText.setVisible(true);
        }
        
        if(this.sceneType=="getExp"){
            this.itemInfoText.setVisible(false);
            this.rectBaseAlpha-=0.03;
            if(this.rectBaseAlpha<0){
                this.rectBaseAlpha = 0
            }
            this.rectBase.setOpacity(255*this.rectBaseAlpha);
            this.specialItem.setVisible(false);
            this.txtSpecialItem.setVisible(false);

            this.amount++;
            this.amountText.setString("$" + getZeroPaddingNumber(this.amount,5));
            if(this.amount >= 150){
                this.amount = 150;
            }

            this.exp++;
            this.expText.setString(this.exp + "exp")
            if(this.exp >= 300){
                this.exp = 300;
            }
        }

        if(this.sceneType=="powerUp"){
            this.amountText.setVisible(false);
            this.expText.setVisible(false);
            this.resultText.setString(
                  "キャラクターLvevelUP!" + "\n"
                + "[Lv1->Lv2]" + "\n"
                + "" + "\n"
            );
        }

        if(this.sceneType=="finish"){
        }

    },

    onCharaSelect:function () {
        this.storage = getStageDataFromJson(this.storage,this.storage.stageNumber);
        cc.LoaderScene.preload(g_resources, function () {
            var scene = cc.Scene.create();
            scene.addChild(CharaSelectLayer.create(this.storage));
            cc.Director.getInstance().replaceScene(cc.TransitionSlideInL.create(1.2, scene));
        }, this);
    },

    onNextGame:function () {
        this.storage = getStageDataFromJson(this.storage,this.storage.stageNumber);
        cc.LoaderScene.preload(g_resources, function () {
            var scene = cc.Scene.create();
            scene.addChild(GameLayer.create(this.storage));
            cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
        }, this);
    },

    onGotItem:function () {
        if(this.sceneType=="getItem"){////getItem->getExp->powerUp->finish
            this.sceneType="getExp";
        }else if(this.sceneType=="getExp"){
            this.sceneType="powerUp";
        }else if(this.sceneType=="powerUp"){
            this.sceneType="finish";
            onBackCallback();
        }else if(this.sceneType=="finish"){
            onBackCallback();
        }
    },

    onTweet:function(){
        goTwitter(getZeroPaddingNumber(this.storage.gameScore,6));
    },

    onFacebook:function(){
        goFacebook(getZeroPaddingNumber(this.storage.gameScore,6));
    },
});

ResultLayer.create = function (storage) {
    var sg = new ResultLayer(storage);
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
