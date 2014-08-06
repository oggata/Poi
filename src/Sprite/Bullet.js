//
//  Bullet.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Bullet = cc.Node.extend({
    ctor:function (enemy,id) {
        this._super();
        this.enemy = enemy;
        this.effect_time = 0;
        this.hitTime     = 0;
        this.attack      = enemy.attack;
        this.dx          = 0;
        this.dy          = 0;
        this.id = id;
        CONFIG.BULLET_EFFECT_TIME = 30*1;

        var frameSeq = [];
/*
        for (var y = 0; y <= 0; y++) {
            for (var x = 0; x <= 11; x++) {
                var frame = cc.SpriteFrame.create(s_promin_pipo002,cc.rect(240*x,240*y,240,240));
                frameSeq.push(frame);
            }
        } 
*/
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 5; x++) {
                var frame = cc.SpriteFrame.create(effect_circle,cc.rect(120*x,120*y,120,120));
                frameSeq.push(frame);
            }
        }

        this.wa = cc.Animation.create(frameSeq,0.1);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(effect_fire,cc.rect(0,0,60,60));
        this.sprite.setOpacity(255*0.8);
        this.sprite.runAction(this.ra);
        this.addChild(this.sprite);
        this.isEffect = true;
        this.sprite.setScale(0.5,0.5);
    },

    init:function () {
    },

    moveTo:function(enemy) {
        this.jumpY=0;
        this.jumpYDirect = "up";

        if(this.isStop) return;
        var dX = enemy.getPosition().x - this.getPosition().x;
        var dY = enemy.getPosition().y - this.getPosition().y;
        var rad = Math.atan2(dX,dY);
        var speedX = 3 * Math.sin(rad);
        var speedY = 3 * Math.cos(rad);
        this.setPosition(
            this.getPosition().x + speedX,
            this.getPosition().y + speedY
        );
    },

    update:function() {
        if(this.enemy != null){
            this.moveTo(this.enemy);
        }

        if(this.isEffect == false){
            this.hitTime++;
            if(this.hitTime <= 10){
                var pp = this.getPosition();
                this.setPosition(pp.x + this.dx,pp.y + this.dy);
                return true;
            }
        }else{
            this.effect_time++;
            if(this.effect_time <= CONFIG.BULLET_EFFECT_TIME){
                var pp = this.getPosition();
                this.setPosition(pp.x + this.dx,pp.y + this.dy);
                return true;
            }
            this.removeChild(this.sprite);
        }
        return false;
    },

    set_position:function(x,y){
        this.setPosition(x,y);
    },

    set_direction:function(dx,dy){
        this.dx = dx;
        this.dy = dy;
    },
});
