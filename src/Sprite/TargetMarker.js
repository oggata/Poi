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
        
        this.enemyMotionTrack = new Array();
        for (var i=0 ; i < 20 ; i++){
            this.cube = new Cube(i,30,80,"ENEMY");
            this.enemyMotionTrack.push(this.cube);
            this.addChild(this.cube,999);
        }

        this.enemyFarMotionTrack = new Array();
        for (var i=0 ; i < 20 ; i++){
            this.cube = new Cube(i,120,120,"ENEMY");
            this.enemyFarMotionTrack.push(this.cube);
            this.addChild(this.cube,999);
        }

        this.mapMotionTrack = new Array();
        for (var i=0 ; i < 20 ; i++){
            this.cube = new Cube(i,50,50,"CHIP");
            this.mapMotionTrack.push(this.cube);
            this.addChild(this.cube,999);
        }

        this.weaponMotionTrack = new Array();
        for (var i=0 ; i < 20 ; i++){
            this.cube = new Cube(i,0,150,"WEAPON");
            this.weaponMotionTrack.push(this.cube);
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

        for(var i=0;i<this.enemyFarMotionTrack.length;i++){
            this.enemyFarMotionTrack[i].update();
        }

        for(var i=0;i<this.weaponMotionTrack.length;i++){
            this.weaponMotionTrack[i].update();
        }
    },
});
