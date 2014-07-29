//
//  Coin.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Coin = cc.Node.extend({
    ctor:function (x,y) {
        this._super();
        var frameSeq = [];
        for (var i = 0; i <= 2; i++) {
            var frame = cc.SpriteFrame.create(s_coin,cc.rect(32*i,0,32,32));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq,0.1);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.coinSprite = cc.Sprite.create(s_coin,cc.rect(0,0,32,32));
        this.coinSprite.runAction(this.ra);
        this.addChild(this.coinSprite);

        //デバッグ
        if(CONFIG.DEBUG_FLAG==1){
            this.sigh = cc.LayerColor.create(cc.c4b(255,0,0,255),3,3);
            this.sigh.setPosition(0,0);
            this.addChild(this.sigh);
        }
    },

    set_position:function(x,y){
        this.setPosition(x,y);
    },

    remove:function() {
        this.removeChild(this.coinSprite);
    },
});
