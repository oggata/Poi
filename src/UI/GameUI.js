//
//  GameUI.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var GameUI = cc.Node.extend({
    ctor:function (game) {
        this._super();
        this.game       = game;
        this.storage    = this.game.storage;
        this.visibleCnt = 0;

        //header
        this.uiHeader = cc.LayerColor.create(cc.c4b(0,255,255,255 * 0),320,200);
        this.uiHeader.setPosition(0,430);
        this.uiHeader.setAnchorPoint(0,0);
        this.addChild(this.uiHeader);

        //footer
        this.uiFooter = cc.LayerColor.create(cc.c4b(0,255,255,255 * 0),320,80);
        this.uiFooter.setPosition(0,0);
        this.uiFooter.setAnchorPoint(0,0);
        this.addChild(this.uiFooter);

        //s_header
        this.imgHeader = cc.Sprite.create(s_header);
        this.imgHeader.setPosition(0,-30);
        this.imgHeader.setAnchorPoint(0,0);
        this.uiHeader.addChild(this.imgHeader);

        this.colleagueCntBase = cc.Sprite.create(s_colleague_cnt);
        this.colleagueCntBase.setPosition(0,0);
        this.colleagueCntBase.setAnchorPoint(0,0);
        this.uiFooter.addChild(this.colleagueCntBase);

        this.redCntLabel = cc.LabelTTF.create("00","Arial",20);
        this.redCntLabel.setPosition(320/4 * 1,0);
        this.redCntLabel.setAnchorPoint(0.5,0);
        this.colleagueCntBase.addChild(this.redCntLabel);

        this.blueCntLabel = cc.LabelTTF.create("00","Arial",20);
        this.blueCntLabel.setPosition(320/4 * 2,0);
        this.blueCntLabel.setAnchorPoint(0.5,0);
        this.colleagueCntBase.addChild(this.blueCntLabel);

        this.yellowCntLabel = cc.LabelTTF.create("00","Arial",20);
        this.yellowCntLabel.setPosition(320/4 * 3,0);
        this.yellowCntLabel.setAnchorPoint(0.5,0);
        this.colleagueCntBase.addChild(this.yellowCntLabel);

        this.getCharactorButton = cc.Sprite.create(s_input_device2);
        this.getCharactorButton.setPosition(0,0);
        this.getCharactorButton.setAnchorPoint(0,0);
        this.uiFooter.addChild(this.getCharactorButton);

        this.slideButton = cc.Sprite.create(s_slideButton);
        this.slideButton.setPosition(0,0);
        this.slideButton.setAnchorPoint(0,0);
        this.uiFooter.addChild(this.slideButton);

        //ミッション文字
        this.missionLabel = cc.LabelTTF.create("","Arial",14);        
        this.missionLabel.setPosition(90,420);
        this.missionLabel.setAnchorPoint(0,0);
        this.addChild(this.missionLabel);

        //game.storage.coinAmount
        //CoinAmount
        this.coinAmountLabel = cc.LabelTTF.create("","Arial",25);
        this.coinAmountLabel.setPosition(30,-25);
        this.coinAmountLabel.setAnchorPoint(0,0);
        this.uiHeader.addChild(this.coinAmountLabel);

        //Territory
        /*
        this.territoryNumLable = cc.LabelTTF.create("","Arial",25);
        this.territoryNumLable.setPosition(20,-25);
        this.territoryNumLable.setAnchorPoint(0,0);
        this.territoryNumLable.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.uiHeader.addChild(this.territoryNumLable);
        */

        //タイムリミット
        this.timeLabel = cc.LabelTTF.create("","Arial",20);
        this.timeLabel.setPosition(320/2,15);
        this.timeLabel.setAnchorPoint(0.5,0);
        this.uiHeader.addChild(this.timeLabel);

        //ホームボタン
        var homeButton = cc.MenuItemImage.create(
            s_home_button,
            s_home_button_on,
            onBackCallback,
            this
        );
        homeButton.setAnchorPoint(0,0);
        homeButton.setPosition(260,-15);

        //set header
        this.headerMenu = cc.Menu.create(
            homeButton
        );
        this.uiHeader.addChild(this.headerMenu,33);
        this.headerMenu.setPosition(0,0);

        //ホームボタン
        this.criticalButton = cc.MenuItemImage.create(
            s_critical_message2,
            s_critical_message2,
            this.onCritical,
            this
        );
        //set header
        this.menu = cc.Menu.create(
            this.criticalButton
        );
        this.game.mapNode.addChild(this.menu,999999999);
        this.menu.setPosition(0,0);

        this.criticalBar = cc.LayerColor.create(cc.c4b(255,255,255,255),320,10);
        this.criticalBar.setPosition(0,0);
        this.criticalBar.setAnchorPoint(0,0);
        this.criticalBar.setOpacity(255*1.0);
        this.addChild(this.criticalBar);
    },

    //UIのテキストをupdateする
    update:function() {
        this.redCntLabel.setString(this.game.stageInformation.getFollowColleagueCnt(2));
        this.blueCntLabel.setString(this.game.stageInformation.getFollowColleagueCnt(1));
        this.yellowCntLabel.setString(this.game.stageInformation.getFollowColleagueCnt(3));

        var criticalRate = this.game.criticalPower / this.game.criticalMaxPower;
        this.criticalBar.setScale(criticalRate,1);
        this.coinAmountLabel.setString("×" + getZeroPaddingNumber(this.game.storage.coinAmount),3);

        if(this.game.player.isTargetEnemy()){
            //敵を破壊
            this.slideButton.setVisible(true);
            this.getCharactorButton.setVisible(false);
            this.colleagueCntBase.setPosition(0,75);
        }else if(this.game.player.isTargetEnemyBuilding()){
            //敵の建物を破壊
            this.slideButton.setVisible(true);
            this.getCharactorButton.setVisible(false);
            this.colleagueCntBase.setPosition(0,75);
        }else if(this.game.player.isTargetMyBuilding()){
            //ポイを増やす
            this.slideButton.setVisible(false);
            this.getCharactorButton.setVisible(true);
            this.colleagueCntBase.setPosition(0,75);
        }else{
            this.slideButton.setVisible(false);
            this.getCharactorButton.setVisible(false);
            this.colleagueCntBase.setPosition(0,0);
        }

        this.visibleCnt++;
        if(this.visibleCnt>=30*1){
            this.visibleCnt=0;
            //ミッションの表示
            this.missionLabel.setString(
                "" + this.game.missionLabel + "[" + this.game.missionCnt + "/" + this.game.missionMaxCnt+"]"
            );
            //ミッション時間の表示
            var time = getZeroPaddingNumber(Math.floor((this.game.missionTimeLimit - this.game.timeCnt)/30),3);
            this.timeLabel.setString(
                "" + time + "秒"
            );
            /*
            this.territoryNumLable.setString(
                "×"+ getZeroPaddingNumber(Math.floor(this.game.getColleagueCnt() + 1),2) + ""
            );
*/
        }
    },

    onCritical:function(){
        this.game.criticalPower = 0;
        this.game.isFly = true;
    }

});
