//
//  Cube.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Cube = cc.Node.extend({
    ctor:function (num,rangeMin,rangeMax,type) {
        this._super();
        this.type = type;
        this.num = num;
        this.rangeMin = rangeMin;
        this.rangeMax = rangeMax;
        this.frowaringDirection = 1;
        this.eyeSightRange = rangeMin;
        if(CONFIG.DEBUG_FLAG == 1){
            this.alpha = 255 * 1;
        }else{
            this.alpha = 255 * 0;
        }
        //AttackRollingCube
        if(this.type == "CHIP"){
            this.rollingCube = cc.LayerColor.create(cc.c4b(255,0,0,this.alpha),5,5);
        }else if(this.type == "ENEMY"){
            this.rollingCube = cc.LayerColor.create(cc.c4b(0,255,0,this.alpha),5,5);
        }else if(this.type == "WEAPON"){
            this.rollingCube = cc.LayerColor.create(cc.c4b(0,0,255,this.alpha),5,5);
        }else if(this.type == "CHIP2"){
            this.rollingCube = cc.LayerColor.create(cc.c4b(255,255,0,this.alpha),5,5);
        }else{
            this.rollingCube = cc.LayerColor.create(cc.c4b(0,255,255,this.alpha),5,5);
        }
        this.addChild(this.rollingCube,999);
        this.cubeAngle   = num * 36;
    },

    init:function () {
    },

    update:function() {
        if(this.type == "CHIP"){
            this.eyeSightRange = this.rangeMin;
            this.cubeAngle+=2;
        }

        if(this.type == "ENEMY"){
            if(this.rangeMin != this.rangeMax){
                this.eyeSightRange += 1 * this.frowaringDirection;
                if(this.eyeSightRange > this.rangeMax){
                    this.frowaringDirection = -5;
                }
                if(this.eyeSightRange < this.rangeMin){
                    this.frowaringDirection = 5;
                }
            }
        }

        if(this.type == "WEAPON"){
            if(0 <= this.num && this.num <= 5){
                this.rollingCube.setPosition(this.num*40-100,100);
            }else if(5 < this.num && this.num <= 10){
                this.rollingCube.setPosition((this.num-5)*40-100,-100);
            }else if(10 < this.num && this.num <= 15){
                this.rollingCube.setPosition(100,(this.num-10)*40-100);
            }else if(15 < this.num && this.num <= 20){
                this.rollingCube.setPosition(-100,(this.num-15)*40-100);
            }
        }else{
            if(this.cubeAngle>=360){
                this.cubeAngle = 0;
            }
            var cubeRad = this.cubeAngle * Math.PI / 180;
            var cubeX = this.eyeSightRange * Math.cos(cubeRad) + 0;
            var cubeY = this.eyeSightRange * Math.sin(cubeRad) + 0;
            this.rollingCube.setPosition(cubeX,cubeY);
        }
    }
});
