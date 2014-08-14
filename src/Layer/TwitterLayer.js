//
//  TutolialLayer.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var TwitterLayer = cc.Layer.extend({
_box1: null,

    ctor:function () {
        this._super();
        //this.storage  = storage;
    },

    init:function () {

        var bRet = false;
        if (this._super()) {

            this.isConverted = false;
            //bgm
            //playSystemBGM();
            changeLoadingImage();

            //back
            var story = cc.Sprite.create(s_chara_make_ui);
            story.setAnchorPoint(0,0);
            story.setPosition(0,0);
            this.addChild(story);

//http://www.paper-glasses.com/api/twipi/oggata
        var bg = cc.Scale9Sprite.create(s_button001_scale9);
        this._box1 = cc.EditBox.create(cc.size(200,30),bg);
        this._box1.setAnchorPoint(0,0);
        this._box1.setText("<-----twitter----->");
        this._box1.setPosition(20,120);
        this._box1.setFontColor(cc.c3b(251,250,0));
        this._box1.setDelegate(this);
        this.addChild(this._box1);

            //new game
            this.nextButton = new ButtonSprite("CONVERT",120,60,this.setConvertResult,this);
            this.nextButton.setPosition(320/2,200);
            this.addChild(this.nextButton);

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

            //UI
            this.convertResult = cc.Sprite.create(s_convert_success);
            this.convertResult.setAnchorPoint(0,0);
            this.addChild(this.convertResult);
            this.convertResult.setVisible(false);


// answer
this.answer = cc.LabelTTF.create("bbbbbbb", "Arial", 32);
this.answer.setPosition(20,150);
this.addChild(this.answer);


            this.scheduleUpdate();
            this.setTouchEnabled(true);

            bRet = true;
        }
        return bRet;
    },

    editBoxReturn:function (sender) {
        cc.log(sender.getText());
        //this.answer.setString(eval(sender.getText()));
        var text = sender.getText();
        this.answer.setString(text);
    },

    setConvertResult:function(){
        //this.isConverted = true;

            this.convertResult = cc.Sprite.create("http://www.paper-glasses.com/api/twipi/oggata");
            this.convertResult.setAnchorPoint(0,0);
            this.addChild(this.convertResult);


    },

    update:function(dt){
        if(this.isConverted == true){
            this.convertResult.setVisible(true);
        }
    },

});

TwitterLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = TwitterLayer.create();
    scene.addChild(layer);
    return scene;
};

TwitterLayer.create = function () {
    var sg = new TwitterLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
