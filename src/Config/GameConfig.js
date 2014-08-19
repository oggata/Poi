/*

MISSION TYPE ------->
ミッションのクリア条件

DESTROY   ..全滅
OCCUPY    ..占領
SURVIVAL  ..生き残る
BORN      ..生産
COLLECTOR ..収集
DEFENCE   ..護衛

ENEMY TYPE ------->
敵の動きパターン

NORMAL
SNAKE
JELLYFISH
COCKROACH
ANT_LION

ENEMY BULLET ----->
敵の攻撃の種類

FIRE
WATER
SANDER
POISON

CARD ------------->
所持しているアイテムカードの種類

POWER UP
STOP TIME (10sec)
ENERGY
ATTACK ENEMY
SPEED   UP
DEFENCE UP
ATTACK  UP
OCCUPY  UP
HP      RECOVER
POISON  RECOVER

赤poi
強み
・攻撃力が高い
(ジャンプ攻撃で敵を殲滅する)
弱点
・占領できない

占領時の動き
・建物の周囲を回転

青poi
強み
・離れて攻撃できる
・占領中に接近して来た敵にも攻撃できる
弱点
・体力が弱い

占領時の動き
・建物の周囲を回転

黄poi
強み
・占領スピードが高
・体力がある

弱点
・攻撃できない

占領時の動き
・建物の周囲を回転
*/

var CONFIG = CONFIG || {};

CONFIG.DEBUG_FLAG       = 0;
CONFIG.DEBUG_STAGE_NUM  = 4;
CONFIG.BGM_VOLUME       = 0;
CONFIG.SE_VOLUME        = 0;

CONFIG.MAX_STAGE_NUMBER = 5;
CONFIG.PLAYER_OCCUPY_POWER = 0.09;
CONFIG.ENEMY_OCCUPY_POWER  = 0.15;

CONFIG.COLLEGUE_MAX_CNT = 30;
CONFIG.ENEMY_MAX_CNT    = 30;

//bullet
CONFIG.BULLET_EFFECT_TIME = 45;
CONFIG.BULLET_SPEED       = 12;

//
CONFIG.UI_DROW_ORDER = 99999;

//storagegy
CONFIG.DEFAULT_STORATEGY_CODE = 1;

//map
CONFIG.MAP_WIDHT   = 1000;
CONFIG.MAP_HEIGHT  = 1000;

CONFIG.DEFAULT_SCROLL_TYPE = 1; //1:player 2:user

CONFIG.SET_POSITION_TYPE = 1;

CONFIG.PLAYER_AND_ENEMY_KNOCK_BAKC_RANGE        = 30;
CONFIG.COLLEAGUE_AND_COLLEAGUE_KNOCK_BAKC_RANGE = 24;
CONFIG.PLAYER_AND_COLLEAGUE_KNOCK_BACK_RANGE    = 60;
CONFIG.ENEMY_AND_ENEMY_KNOCK_BAKC_RANGE         = 50;

CONFIG.STAGE_BASE = [
    0,0,1,1,1,1,1,1,1,
     0,1,1,1,1,1,1,1,1,
    0,0,1,1,1,1,1,1,1,
     0,0,1,1,1,1,1,1,0,
    0,0,0,0,1,1,1,0,0,
     0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0
];
