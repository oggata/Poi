//
//  GameOverLayer.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var StoryLayer = cc.Layer.extend({

    createTable:function(){
        // Table
        var tableView = cc.TableView.create(this, cc.size(320,250));
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        tableView.setPosition(0, 0);
        tableView.setDelegate(this);
        tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.addChild(tableView);
        tableView.reloadData();
    },

    init:function(storage) {
        var bRet = false;

        this.storage = storage;
        this.responses = [];
        if (this._super()) {
            //back
            this.back = cc.LayerColor.create(cc.c4b(255,0,0,255),320,480);
            this.back.setAnchorPoint(0,0);
            this.back.setPosition(0,0);
            this.addChild(this.back);

            //back
            var sp = cc.Sprite.create(loading_png);
            sp.setAnchorPoint(0,0);
            this.addChild(sp);

            //back
            var woman = cc.Sprite.create(s_woman);
            woman.setPosition(80,340);
            woman.setScale(0.7,0.7);
            this.addChild(woman);

            //受け取りボタン
            this.getItemButton = new ButtonSprite("-次へ-",200,40,this.onQuestPage,this);
            this.getItemButton.setPosition(320/2,270);
            this.addChild(this.getItemButton,CONFIG.UI_DROW_ORDER);
            this.addChild(this.getItemButton);

            for(var i=0;i<10;i++){
                if(i==0){
                    this.responses.push("女「タイムマシンが手に入った." + "\n" + "さっそく、ミッションに取りかかってもらう」");
                }else if(i==1){
                    this.responses.push("女「今回の任務は信長のいた時代だ。」");
                }else if(i==2){
                    this.responses.push("女「目的は信長の怨念の入った建物２つの破壊」");
                }else if(i==3){
                    this.responses.push("女「ザコキャラが湧いてくるので、"+ "\n" + "適宜、破壊すると良いだろう");
                }else if(i==4){
                    this.responses.push("女「」");
                }else if(i==5){
                    this.responses.push("女「」");
                }else if(i==6){
                    this.responses.push("女「」");
                }else if(i==7){
                    this.responses.push("女「」");
                }else if(i==8){
                    this.responses.push("女「破壊が終了したら、速やかに"+ "\n" + "エスケープゾーンに逃げ込め。」");
                }else{
                    this.responses.push("");
                }
            }
            this.createTable();
            bRet = true;
        }
        return bRet;
    },

    onBackCallback:function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(SysMenu.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },

    tableCellTouched:function (table, cell) {
        cc.log("cell touched at index: " + cell.getIdx());
    },

    tableCellSizeForIndex:function (table, idx) {
        return cc.size(320,85);
    },

    tableCellAtIndex:function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        var label;
        if (!cell) {
            cell = new CustomTableViewCell();

            //リストの背景
            /*
            this.imgList = cc.LayerColor.create(cc.c4b(0,255,0,255),320,80);
            this.imgList.setAnchorPoint(0,0);
            this.imgList.setPosition(0,0);
            cell.addChild(this.imgList);
            */
            this.fukidashi = cc.Sprite.create(s_fukidashi);
            this.fukidashi.setAnchorPoint(0,0);
            this.fukidashi.setPosition(0,0);
            cell.addChild(this.fukidashi);

            //名称
            nameLabel = cc.LabelTTF.create(strValue, "Helvetica",13);
            nameLabel.setPosition(20,20);
            nameLabel.setAnchorPoint(0,0);
            nameLabel.setTag("nameLabel");
            cell.addChild(nameLabel);
        } else {
            nameLabel = cell.getChildByTag("nameLabel");
            var txt = this.responses[strValue];
            nameLabel.setString(txt);
            nameLabel.setFontFillColor(cc.c4b(0,0,0,255));
            //nameLabel.enableStroke(cc.c4b(0,0,0,5),2,false);
            nameLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);  
        }

        return cell;
    },

    numberOfCellsInTableView:function (table) {
        return this.responses.length;
    },

    onQuestPage:function (stageNum) {
        playSystemButton();
        cc.LoaderScene.preload(g_chara_select_resources, function () {
            var scene = cc.Scene.create();
            scene.addChild(CharaSelectLayer.create(this.storage));
            //scene.addChild(ResultLayer.create(this.storage));
            //scene.addChild(StoryLayer.create());      
            cc.Director.getInstance().replaceScene(cc.TransitionProgressHorizontal.create(1.2, scene));
        }, this);
    },
});

var CustomTableViewCell = cc.TableViewCell.extend({
    draw:function (ctx) {
        this._super(ctx);
    }
});

StoryLayer.create = function (storage) {
    var sg = new StoryLayer();
    if (sg && sg.init(storage)) {
        return sg;
    }
    return null;
};
