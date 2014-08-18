//
//  Collision.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

//プレイヤとマップチップの衝突判定
var collisionPlayerAndChip = function(game){
};

//仲間とマップチップの衝突判定
var collisionColleagueAndChip = function(game){
    for(var i=0;i<game.stage.chips.length;i++){
        for(var j=0;j<game.colleagues.length;j++){
            var distance = cc.pDistance(game.stage.chips[i].getPosition(),game.colleagues[j].getPosition());
            if(distance < 100 && game.colleagues[j].targetBuilding != null){
                game.stage.chips[i].damage(0.25/30);
            }
        }
    }
};

//敵とマップチップの衝突判定
var collisionEnemyAndChip = function(game){

};

//プレイヤーと仲間の衝突判定
var collisionPlayerAndColleague = function(player,colleagues,game){
    
    for(var i=0;i<colleagues.length;i++){
        var colleague = colleagues[i];
        var distance = cc.pDistance(player.getPosition(),colleague.getPosition());
        
        //近づき過ぎたら止まる
        colleague.isStop = false;
        if(distance < CONFIG.PLAYER_AND_COLLEAGUE_KNOCK_BACK_RANGE && colleagues[i].isTargetFollowPlayer() == true){
            colleague.isStop = true;
        }
    }
};

//プレイヤーと弾丸の衝突判定
var collisionPlayerAndEnemyBullet = function(player,bullets){
    
    for(var i=0;i<bullets.length;i++){
        var bullet = bullets[i];
        var distance = cc.pDistance(player.getPosition(),bullet.getPosition());
        
        if(distance < 50 && bullet.isEffect == true){
            player.damage(bullet.attack);
            bullet.isEffect = false;
        }
    }
};

//仲間と弾丸の衝突判定
var collisionColleguesAndEnemyBullet = function(colleagues,bullets){
    for(var j=0;j<colleagues.length;j++){
        for(var i=0;i<bullets.length;i++){
            var bullet = bullets[i];
            var distance = cc.pDistance(colleagues[j].getPosition(),bullet.getPosition());

            if(distance < 50 && bullet.isEffect == true){
                colleagues[j].damage(bullet.attack);
                bullet.isEffect = false;
            }
        }
    }
};

//同じsprite同士の判定(仲間同士、敵同士etc..)
var collisionSpriteAndSprite = function(sprites){
    for(var j=0;j<sprites.length;j++){
        if(sprites[j].isTargetEnemy){
            if(sprites[j].isTargetEnemy()) continue;
        }
        var spritesOne = sprites[j];
        for(var k=0;k<sprites.length;k++){
            var spritesTwo = sprites[k];
            if(j != k){
                var distance = cc.pDistance(spritesOne.getPosition(),spritesTwo.getPosition());
                //ノックバック
                if(distance < CONFIG.COLLEAGUE_AND_COLLEAGUE_KNOCK_BAKC_RANGE){
                    var diffX = spritesTwo.getPosition().x - spritesOne.getPosition().x;
                    var diffY = spritesTwo.getPosition().y - spritesOne.getPosition().y;
                    if(CONFIG.SET_POSITION_TYPE==1){
                        if(diffX > 0){
                            spritesTwo.setPosition(
                                spritesTwo.getPosition().x + spritesTwo.walkSpeed/2,
                                spritesTwo.getPosition().y
                            );
                        }
                        if(diffX < 0){
                            spritesTwo.setPosition(
                                spritesTwo.getPosition().x - spritesTwo.walkSpeed/2,
                                spritesTwo.getPosition().y
                            );
                        }
                        if(diffY > 0){
                            spritesTwo.setPosition(
                                spritesTwo.getPosition().x,
                                spritesTwo.getPosition().y + spritesTwo.walkSpeed/2
                            );
                        }
                        if(diffY < 0){
                            spritesTwo.setPosition(
                                spritesTwo.getPosition().x,
                                spritesTwo.getPosition().y - spritesTwo.walkSpeed/2
                            );
                        }
                    }else{
                        if(diffX > 0) spritesTwo.mapX+=spritesTwo.walkSpeed/2;
                        if(diffX < 0) spritesTwo.mapX-=spritesTwo.walkSpeed/2;
                        if(diffY > 0) spritesTwo.mapY+=spritesTwo.walkSpeed/2;
                        if(diffY < 0) spritesTwo.mapY-=spritesTwo.walkSpeed/2;
                    }
                }
            }
        }
    }
};

var collisionCollegueBulletsAndEnemy = function(colleagueBullets,enemies){
    for(var j=0;j<colleagueBullets.length;j++){
        for(var k=0;k<enemies.length;k++){
            var distance = cc.pDistance(colleagueBullets[j].getPosition(),enemies[k].getPosition());
            if(distance <= 10){
                 enemies[k].damage(1);
            }
        }
    }
};

//仲間と敵の衝突判定
var collisionColleagueAndEnemy = function(colleagues,enemies){
    for(var j=0;j<colleagues.length;j++){
        for(var k=0;k<enemies.length;k++){
            var distance = cc.pDistance(colleagues[j].getPosition(),enemies[k].getPosition());

            if(distance < 50){
                if(enemies[k].type == "normal"){
                    //敵->仲間 (ダメージ)
                    enemies[k].battleIntervalToPlayer++;
                    if(enemies[k].battleIntervalToPlayer >= 30){
                        enemies[k].battleIntervalToPlayer = 0;
                        colleagues[j].damage(enemies[k].attack);
                    }
                }
                //仲間->敵(ダメージ)
                colleagues[j].battleIntervalToEnemy++;
                if(colleagues[j].battleIntervalToEnemy >= 30 && colleagues[j].targetEnemy != null){
                    colleagues[j].battleIntervalToEnemy = 0;
                    enemies[k].damage(5);
                }
            }

            //ノックバック
            if(distance < 40){
                if(colleagues[j].isTargetEnemy()) continue;
                var diffX = colleagues[j].getPosition().x - enemies[k].getPosition().x;
                var diffY = colleagues[j].getPosition().y - enemies[k].getPosition().y;
                if(diffX > 0){
                    colleagues[j].setPosition(
                        colleagues[j].getPosition().x + 10,
                        colleagues[j].getPosition().y
                    );
                }
                if(diffX < 0){
                    colleagues[j].setPosition(
                        colleagues[j].getPosition().x - 10,
                        colleagues[j].getPosition().y
                    );
                }
                if(diffY > 0){
                    colleagues[j].setPosition(
                        colleagues[j].getPosition().x,
                        colleagues[j].getPosition().y + 10
                    );
                }
                if(diffY < 0){
                    colleagues[j].setPosition(
                        colleagues[j].getPosition().x,
                        colleagues[j].getPosition().y - 10
                    );
                }
            }

        }
    }
};

//プレイヤーと敵の衝突判定
var collisionPlayerAndEnemy = function(player,enemies,game){

    for(var i=0;i<enemies.length;i++){
        var enemy = enemies[i];
        var distance = cc.pDistance(player.getPosition(),enemy.getPosition());

        //敵->プレイヤー(ダメージ)
        if(enemies[i].type == "normal"){
            if(distance < 50){
                enemies[i].battleIntervalToPlayer++;
                if(enemies[i].battleIntervalToPlayer >= 30){
                    enemies[i].battleIntervalToPlayer = 0;
                    player.damage(enemies[i].attack);
                }
            }
        }
/*
        //プレイヤーと敵のノックバック用の判定
        if(distance < CONFIG.PLAYER_AND_ENEMY_KNOCK_BAKC_RANGE){
            var diffX = player.getPosition().x - enemy.getPosition().x;
            var diffY = player.getPosition().y - enemy.getPosition().y;
            if(diffY>0){
                player.setPosition(
                    player.getPosition().x,
                    player.getPosition().y + player.walkSpeed
                );
                enemy.setPosition(
                    enemy.getPosition().x,
                    enemy.getPosition().y - player.walkSpeed
                );
            }
            if(diffY<0){
                player.setPosition(
                    player.getPosition().x,
                    player.getPosition().y - player.walkSpeed
                );
                enemy.setPosition(
                    enemy.getPosition().x,
                    enemy.getPosition().y + player.walkSpeed
                );
            }
            if(diffX>0){
                player.setPosition(
                    player.getPosition().x + player.walkSpeed,
                    player.getPosition().y
                );
                enemy.setPosition(
                    enemy.getPosition().x - player.walkSpeed,
                    enemy.getPosition().y
                );
            }
            if(diffX<0){
                player.setPosition(
                    player.getPosition().x - player.walkSpeed,
                    player.getPosition().y
                );
                enemy.setPosition(
                    enemy.getPosition().x - player.walkSpeed,
                    enemy.getPosition().y
                );
            }
        } 
*/
    }
};


//this.enemyBodies
//プレイヤーと敵の衝突判定
var collisionPlayerAndEnemyBody = function(player,enemyBodies){
/*
    for(var i=0;i<enemyBodies.length;i++){
        var enemyBody = enemyBodies[i];
        var distance = cc.pDistance(player.getPosition(),enemyBody.getPosition());
        //敵->プレイヤー(ダメージ)
        if(enemyBody[i].type == "normal"){
            if(distance < 50){
                enemyBody[i].battleIntervalToPlayer++;
                if(enemyBody[i].battleIntervalToPlayer >= 30){
                    enemyBody[i].battleIntervalToPlayer = 0;
                    player.damage(enemyBody[i].attack);
                }
            }
        }
    }
*/
};

//敵同士の衝突判定
var collisionEnemyAndEnemy = function(enemies){
    for(var j=0;j<enemies.length;j++){
        var colleagueOne = enemies[j];
        for(var k=0;k<enemies.length;k++){
            var colleagueTwo = enemies[k];

            if(j != k){
                var distance = cc.pDistance(colleagueOne.getPosition(),colleagueTwo.getPosition());

                //ノックバック
                if(distance < CONFIG.ENEMY_AND_ENEMY_KNOCK_BAKC_RANGE){
                    var diffX = colleagueTwo.getPosition().x - colleagueOne.getPosition().x;
                    var diffY = colleagueTwo.getPosition().y - colleagueOne.getPosition().y;
                    if(diffX > 0){
                        colleagueTwo.setPosition(
                            colleagueTwo.getPosition().x + colleagueTwo.walkSpeed,
                            colleagueTwo.getPosition().y
                        );
                    }
                    if(diffX < 0){
                        colleagueTwo.setPosition(
                            colleagueTwo.getPosition().x - colleagueTwo.walkSpeed,
                            colleagueTwo.getPosition().y
                        );
                    }
                    if(diffY > 0){
                        colleagueTwo.setPosition(
                            colleagueTwo.getPosition().x,
                            colleagueTwo.getPosition().y + colleagueTwo.walkSpeed
                        );
                    }
                    if(diffY < 0){
                        colleagueTwo.setPosition(
                            colleagueTwo.getPosition().x,
                            colleagueTwo.getPosition().y - colleagueTwo.walkSpeed
                        );
                    }
                }
            }
        }
    }
};

//Playerとコインの衝突判定
var collisionPlayerAndCoin = function(game){
    for(var i=0;i<game.coins.length;i++){
        var distance = cc.pDistance(game.player.getPosition(),game.coins[i].getPosition());
        if(distance < 30){
            playSE(s_se_coin);
            game.coins[i].remove();
            game.storage.coinAmount+=game.coins[i].powerCnt;
            game.coins.splice(i,1);
        } 
    }
};