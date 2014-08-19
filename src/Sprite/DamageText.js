//
//  DamageText.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var DamageText = cc.Node.extend({
    ctor:function (typeCode) {
        this._super();
        this.effectTime     = 0;
        this.dx             = 0;
        this.dy             = 2;
        this.isEffect       = true;

        if(typeCode==1){
            this.comicText = cc.Sprite.create(s_damage_001);
        }else if(typeCode==2){
            this.comicText = cc.Sprite.create(s_damage_002);
        }else if(typeCode==3){
            this.comicText = cc.Sprite.create(s_damage_003);
        }else{
            this.comicText = cc.Sprite.create(s_damage_001);
        }
        this.addChild(this.comicText);
        var randX = getRandNumberFromRange(-30,30);
        var randY = getRandNumberFromRange(-30,30);
        this.setPosition(randX,randY);
        
    },

    update:function() {        
        this.effectTime++;
        if(this.effectTime<=30){
            var pp = this.getPosition();
            this.setPosition(pp.x + this.dx,pp.y + this.dy);
            return true;
        }
        this.removeChild(this.comicText);
        return false;
    },

    set_text:function(text){
        this.damageNumLabel.setString(text);
    },
});
