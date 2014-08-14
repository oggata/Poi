//
//  TargetMarker.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var TargetMarker = cc.Node.extend({
    ctor:function (type) {
        this._super();
        this.type = type;
        if(this.type == "ENEMY"){
            this.enemyMotionTrack = new Array();
            for (var i=0 ; i < 10 ; i++){
                this.cube = new Cube(i,30,80,"ENEMY");
                this.enemyMotionTrack.push(this.cube);
                this.addChild(this.cube,999);
            }
            this.enemyFarMotionTrack = new Array();
            for (var i=0 ; i < 10 ; i++){
                this.cube = new Cube(i,120,120,"ENEMY");
                this.enemyFarMotionTrack.push(this.cube);
                this.addChild(this.cube,999);
            }
        }else if(this.type == "BUILDING"){
            this.mapMotionTrack = new Array();
            for (var i=0 ; i < 10 ; i++){
                this.cube = new Cube(i,50,50,"CHIP");
                this.mapMotionTrack.push(this.cube);
                this.addChild(this.cube,999);
            }
        }
    },

    update:function() {
        if(this.type == "ENEMY"){
            for(var i=0;i<this.enemyMotionTrack.length;i++){
                this.enemyMotionTrack[i].update();
            }
            for(var i=0;i<this.enemyFarMotionTrack.length;i++){
                this.enemyFarMotionTrack[i].update();
            }
        }else if(this.type == "BUILDING"){
            for(var i=0;i<this.mapMotionTrack.length;i++){
                this.mapMotionTrack[i].update();
            }
        }
    },
});
