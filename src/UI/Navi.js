//
//  Navi.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Navi = cc.Node.extend({
    ctor:function (game) {
        this._super();
        this.game = game;
        this.naviOn = false;
        this.naviStartTime = 0;

        //背景
        this.rectBase = cc.LayerColor.create(cc.c4b(0,0,0,255 * 0.5),320,480);
        this.rectBase.setPosition(0,0);
        this.addChild(this.rectBase);

        this.naviGirl = cc.Sprite.create(s_navi_girl);
        this.naviGirl.setAnchorPoint(0.5,0);
        this.naviGirl.setPosition(320/2,150);
        this.addChild(this.naviGirl);

        this.naviTxt = "";
        this.naviLabel = cc.LabelTTF.create(this.naviTxt,"Arial",14); 
        this.naviLabel.setFontFillColor(cc.c4b(0,0,0,255));  
        this.naviLabel.setPosition(30,160);
        this.naviLabel.setAnchorPoint(0,0);
        this.addChild(this.naviLabel);

        //スタートボタン
        this.okButton = new ButtonSprite("OK",120,40,this.naviOff,this);
        this.okButton.setPosition(160,120);
        this.addChild(this.okButton);

        this.naviCode = 0;

    },

    update:function(){

        if(this.naviOn == false){
            this.setVisible(false);
        }else{
            this.setVisible(true);
        }

        if(this.game.storage.missionNumber == 1 && this.naviCode < 1){
            this.naviCode = 1;
            this.naviTxt = 
            "ゲームのポイントは、まずポイを増やす事!" + "\n" + 
            "中央のタワーをターゲットすると" + "\n" + 
            "どんどんポイを増殖することができるわ。" + "\n" + 
            "まずは５０匹まで増やしてみて。";
            this.setNavi(this.naviTxt);
        }

        if(this.game.storage.missionNumber == 1 && this.game.stage.isMissionAchieved == true && this.naviCode < 2){
            this.naviCode = 2;
            this.naviTxt = 
            "おめでとう、クリア目的達成だわ!" + "\n" + 
            "ステージクリアは、もう一息、" + "\n" + 
            "ポイ達の後を追いかけて、エスケープゾーンに" + "\n" + 
            "逃げ込む事でステージクリアになるわ。";
            this.setNavi(this.naviTxt);
        }

        if(this.game.storage.missionNumber == 2 && this.naviCode < 3){
            this.naviCode = 3;
            this.naviTxt = 
            "敵にターゲットを合わせると" + "\n" + 
            "攻撃を行う事ができるわ!" + "\n" + 
            "ポイが減ってきたら増やしながら" + "\n" + 
            "ステージ上の敵３体を倒してみて!";
            this.setNavi(this.naviTxt);
        }

        if(this.game.storage.missionNumber == 2 && this.game.criticalPower == this.game.criticalMaxPower && this.naviCode < 4){
            this.naviCode = 4;
            this.naviTxt = 
            "敵にダメージを与えると" + "\n" + 
            "ボーナスゲージが溜まるわ。" + "\n" + 
            "いっぱいになると必殺技が発動できるので、" + "\n" + 
            "必殺のボタンを押してみて!";
            this.setNavi(this.naviTxt);
        }
/*
        if(this.game.storage.missionNumber == 2 && this.game.colleagueCnt < 10 && this.naviCode < 5){
            this.naviCode = 5;
            this.naviTxt = 
            "ポイの数が少なくなってきたわ!" + "\n" + 
            "0になるとゲームオーバーだから" + "\n" + 
            "急いで、ポイを増やして!!" + "\n" + 
            "";
            this.setNavi(this.naviTxt);
        }
*/
        if(this.game.storage.missionNumber == 2 && this.game.stage.isMissionAchieved == true && this.naviCode < 6){
            this.naviCode = 6;
            this.naviTxt = 
            "おめでとう、クリア目的達成だわ!" + "\n" + 
            "今回もエスケープゾーンに逃げんで!" + "\n" + 
            "どんなミッションでも最後はエスケープ!" + "\n" + 
            "覚えておいてね!";
            this.setNavi(this.naviTxt);
        }

        if(this.game.storage.missionNumber == 3 && this.naviCode < 7){
            this.naviCode = 7;
            this.naviTxt = 
            "ポイはいくつかの種類があるの。" + "\n" + 
            "前回使った赤色は近接攻撃。" + "\n" + 
            "今回は青色の遠距離攻撃用のポイも" + "\n" + 
            "用意したから、敵を３体倒してみて!";
            this.setNavi(this.naviTxt);
        }

        if(this.game.storage.missionNumber == 3 && this.game.storage.killedEnemyCnt == 1 && this.naviCode < 8){
            this.naviCode = 8;
            this.naviTxt = 
            "青は敵から離れている分、自身が" + "\n" + 
            "ダメージを受けにくいのが分かった？" + "\n" + 
            "ただ、攻撃力は近接の方が強力だから" + "\n" + 
            "状況にあわせて使ってね";
            this.setNavi(this.naviTxt);
        }

        if(this.game.storage.missionNumber == 3 && this.game.stage.isMissionAchieved == true && this.naviCode < 9){
            this.naviCode = 9;
            this.naviTxt = 
            "おめでとう！ミッション達成!" + "\n" + 
            "じゃぁエスケープゾーンに逃げて!" + "\n" + 
            "時間に余裕があったらコインも集めてね" + "\n" + 
            "ポイの強化などに使えるわ。";
            this.setNavi(this.naviTxt);
        }

        if(this.game.storage.missionNumber == 4 && this.naviCode < 10){
            this.naviCode = 10;
            this.naviTxt = 
            "今回は敵の拠点を制圧することが" + "\n" + 
            "ミッションの目的になるわ!" + "\n" + 
            "やり方は、敵の拠点をターゲットするだけ。" + "\n" + 
            "制圧が得意な黄色のポイを用意したわ。";
            this.setNavi(this.naviTxt);
        }

        if(this.game.storage.missionNumber == 4 && this.game.stage.isMissionAchieved == true　&& this.naviCode < 11){
            this.naviCode = 11;
            this.naviTxt = 
            "さぁ、エスケープゾーンに逃げて！" + "\n" + 
            "今回は敵がいなかったけど、" + "\n" + 
            "敵がいる場合は、敵を先に倒してから。" + "\n" + 
            "拠点を制圧するなど工夫が必要になるのよ。";
            this.setNavi(this.naviTxt);
        }

        if(this.game.storage.missionNumber == 5 && this.naviCode < 12){
            this.naviCode = 12;
            this.naviTxt = 
            "今回は卒業検定(1/2)よ。" + "\n" + 
            "クリア目的は拠点を２つ制圧すること。" + "\n" + 
            "今回は敵が拠点を守っているから。" + "\n" + 
            "敵を倒した後、拠点を制圧するのよ。";
            this.setNavi(this.naviTxt);
        }

    },

    setNavi:function(naviText){
        this.naviOn = true;
        this.naviLabel.setString(naviText);
    },

    naviOff:function(){
        this.naviOn = false;
    },

    isSetNavi:function(){
        return this.naviOn;
    }
});
