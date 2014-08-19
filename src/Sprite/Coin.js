//
//  Coin.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Coin = cc.Node.extend({
    ctor:function (typeId,powerCnt,game) {
        this._super();
        this.game = game;
        this.typeId = typeId;
        this.powerCnt = powerCnt;
        var scale = 0.3;
        if(powerCnt>1){
            scale = 0.6
        }

        //足下の影
        this.shadow = cc.Sprite.create(s_shadow);
        this.shadow.setPosition(0,-25);
        this.shadow.setScale(1.5,1.5);
        this.shadow.setOpacity(255*0.4);
        this.addChild(this.shadow);

        var frameSeq = [];
        /*
        for (var i = 0; i <= 2; i++) {
            var frame = cc.SpriteFrame.create(s_coin,cc.rect(32*i,0,32,32));
            frameSeq.push(frame);
        }*/
        /*
        for (var i = 0; i < 8; i++) {
            var frame = cc.SpriteFrame.create(effect_energy,cc.rect(120*i,0,120,120));
            frameSeq.push(frame);
        }*/
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 5; x++) {
                var frame = cc.SpriteFrame.create(effect_hart,cc.rect(120*x,120*y,120,120));
                frameSeq.push(frame);
            }
        }
        //effect_hart
        this.wa = cc.Animation.create(frameSeq,0.1);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        //this.coinSprite = cc.Sprite.create(s_coin,cc.rect(0,0,32,32));
        //this.coinSprite = cc.Sprite.create(effect_energy,cc.rect(0,0,120,120));
        this.coinSprite = cc.Sprite.create(effect_hart,cc.rect(0,0,120,120));
        this.coinSprite.runAction(this.ra);
        this.addChild(this.coinSprite);

        this.coinSprite.setScale(scale,scale);
        //デバッグ
        if(CONFIG.DEBUG_FLAG==1){
            this.sigh = cc.LayerColor.create(cc.c4b(255,0,0,255),3,3);
            this.sigh.setPosition(0,0);
            this.addChild(this.sigh);
        }
    },

    update:function(){
        if(this.game.isCameraRange(this.getPosition().x,this.getPosition().y)){
            this.setVisible(true);
        }else{
            this.setVisible(false);
        }
    },

    set_position:function(x,y){
        this.setPosition(x,y);
    },

    remove:function() {
        this.removeChild(this.coinSprite);
        this.removeChild(this.shadow);
    },
});
