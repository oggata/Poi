//
//  Cube.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var TargetMarker = cc.Node.extend({
    ctor:function () {
        this._super();
        this.marker = cc.Sprite.create(s_marker);
        this.addChild(this.marker);

        this.enemyMotionTrack = new Array();
        for (var i=0 ; i < 20 ; i++){
            this.cube = new Cube(i,30,80,"ENEMY");
            this.enemyMotionTrack.push(this.cube);
            this.addChild(this.cube,999);
        }

        this.mapMotionTrack = new Array();
        for (var i=0 ; i < 20 ; i++){
            this.cube = new Cube(i,50,50,"CHIP");
            this.mapMotionTrack.push(this.cube);
            this.addChild(this.cube,999);
        }
    },

    init:function () {
    },

    update:function() {
        //cubes
        for(var i=0;i<this.mapMotionTrack.length;i++){
            this.mapMotionTrack[i].update();
        }

        for(var i=0;i<this.enemyMotionTrack.length;i++){
            this.enemyMotionTrack[i].update();
        }
    },
});
