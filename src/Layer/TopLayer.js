//
//  TutolialLayer.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var TopLayer = cc.Layer.extend({

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
            var story = cc.Sprite.create(s_top);
            story.setAnchorPoint(0,0);
            story.setPosition(0,0);
            this.addChild(story);

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

            this.scheduleUpdate();
            this.setTouchEnabled(true);

            bRet = true;
        }
        return bRet;
    },

    editBoxReturn:function (sender) {
 
    },

    update:function(dt){

    },

});

TopLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = TopLayer.create();
    scene.addChild(layer);
    return scene;
};

TopLayer.create = function () {
    var sg = new TopLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
