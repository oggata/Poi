var adjustRenderPerformance = function(game){

    var adustColleagues = [];

    //画面外のpoiは省く
    for(var i=0;i<game.colleagues.length;i++){
        var distance = cc.pDistance(game.player.getPosition(),game.colleagues[i].getPosition());
        if(distance >= 250){
            game.colleagues[i].renderingMaxCnt = 25;
        }else{
            adustColleagues.push(game.colleagues[i]);
        }
    }

    //1~10人 [1:10人 2:0人 3:0人 4:0人]
    if(0 < adustColleagues.length && adustColleagues.length <= 10){
        for(var i=0;i<adustColleagues.length;i++){
            adustColleagues[i].renderingMaxCnt = 1;
        }
    }

    //11~20人 [1:15人 2:5人 3:0人 4:0人]
    if(10 < adustColleagues.length && adustColleagues.length <= 20){
        for(var i=0;i<10;i++){
            adustColleagues[i].renderingMaxCnt = 1;
        }
        for(var i=10;i<adustColleagues.length;i++){
            adustColleagues[i].renderingMaxCnt = 1;
        }
    }

    //21~30人 [1:10人 2:10人 3:10人 4:0人]
    if(20 < adustColleagues.length && adustColleagues.length <= 30){
        for(var i=0;i<10;i++){
            adustColleagues[i].renderingMaxCnt = 1;
        }
        for(var i=10;i<20;i++){
            adustColleagues[i].renderingMaxCnt = 1;
        }
        for(var i=20;i<adustColleagues.length;i++){
            adustColleagues[i].renderingMaxCnt = 2;
        }
    }

    //31~40人 [1:10人 2:10人 3:10人 4:10人]
    if(30 < adustColleagues.length && adustColleagues.length <= 40){
        for(var i=0;i<10;i++){
            adustColleagues[i].renderingMaxCnt = 1;
        }
        for(var i=10;i<20;i++){
            adustColleagues[i].renderingMaxCnt = 1;
        }
        for(var i=20;i<30;i++){
            adustColleagues[i].renderingMaxCnt = 3;
        }
        for(var i=30;i<adustColleagues.length;i++){
            adustColleagues[i].renderingMaxCnt = 4;
        }
    }

    //41~人 [1:10人 2:10人 3:10人 4:10人]
    if(40 < adustColleagues.length){
        for(var i=0;i<10;i++){
            adustColleagues[i].renderingMaxCnt = 1;
        }
        for(var i=10;i<20;i++){
            adustColleagues[i].renderingMaxCnt = 1;
        }
        for(var i=20;i<30;i++){
            adustColleagues[i].renderingMaxCnt = 3;
        }
        for(var i=30;i<40;i++){
            adustColleagues[i].renderingMaxCnt = 4;
        }
        for(var i=40;i<adustColleagues.length;i++){
            adustColleagues[i].renderingMaxCnt = 10;
        }
    }
};