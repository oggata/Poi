var stageInformation = cc.Class.extend({

    ctor:function (game) {
        this.game             = game;

    },

    getColleaguesCnt:function(typeCode){
    	var num = 0;
        for(var i=0;i<this.game.colleagues.length;i++){
        	if(this.game.colleagues[i].type == typeCode){
        		num++;
        	}
        }
    	return num;
    },

    getFollowColleagueCnt:function(typeCode){
        var num = 0;
        for(var i=0;i<this.game.colleagues.length;i++){
            if(this.game.colleagues[i].type == typeCode && this.game.colleagues[i].isTargetFollowPlayer() == true){
                num++;
            }
        }
        return num;
    },

});