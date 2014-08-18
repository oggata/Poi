//
//  resource.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var base_dir = "./";

//json
var charactor_json       = base_dir + "json/charactor.json";
var stages_json          = base_dir + "json/stages.json";
var enemy_json           = base_dir + "json/enemy.json";

//ui
var loading_png          = base_dir + "ui/loading.png";
var s_chara_select       = base_dir + "ui/charactor_select.png";
var s_target             = base_dir + "ui/butterfly.png";
var s_header             = base_dir + "ui/header.png";
var s_result_clear       = base_dir + "ui/result_clear.png";
var s_input_device       = base_dir + "ui/input_device.png"; 
var s_input_device2      = base_dir + "ui/input_device2.png"; 
var s_timer              = base_dir + "ui/timer.png"; 
var s_input_device       = base_dir + "ui/input_device.png"; 
var s_marker             = base_dir + "ui/marker.png";

var s_slideButton        = "ui/slideButton.png";
var s_colleague_cnt      = "ui/colleague_cnt.png";

//map
var s_chip_001           = base_dir + "map/q_map_ajito.png";
var s_chip_003           = base_dir + "map/q_map_poi.png";
var s_chip_004           = base_dir + "map/q_map_tree.png";
var s_chip_005           = base_dir + "map/q_map_twitter.png";

var s_crown              = base_dir + "map/crown01.png";
var s_crown2             = base_dir + "map/crown02.png";
var s_crown3             = base_dir + "map/crown03.png";

//button
var s_button001_scale9   = base_dir + "button/button001_scale9.png";
var s_home_button        = base_dir + "button/homeButton.png";
var s_home_button_on     = base_dir + "button/homeButtonOn.png";
var s_facebook_button    = base_dir + "button/facebook.png";
var s_facebook_button_on = base_dir + "button/facebookOn.png";
var s_twitter_button     = base_dir + "button/twitter.png";
var s_twitter_button_on  = base_dir + "button/twitterOn.png";

//effect
var effect_fire          = base_dir + "effect/pipo-btleffect002.png";
var effect_destroy       = base_dir + "effect/pipo-btleffect012.png";
var effect_water         = base_dir + "effect/pipo-btleffect006.png";
var effect_wind          = base_dir + "effect/pipo-btleffect039.png";
var effect_sander        = base_dir + "effect/pipo-btleffect040.png";
var effect_eye           = base_dir + "effect/pipo-btleffect072.png";
var effect_circle        = base_dir + "effect/pipo-btleffect109f.png";
var effect_energy        = base_dir + "effect/pipo-btleffect008.png";
var effect_hart          = base_dir + "effect/pipo-btleffect116g.png";
var effect_sand          = base_dir + "effect/pipo-btleffect028.png";
var effect_tsunami       = base_dir + "effect/pipo-btleffect031.png";

//sprite
var s_hinageshi          = base_dir + "sprite/hinageshi.png";
var s_initSprite         = base_dir + "sprite/initSprite.png";
var s_enargy             = base_dir + "sprite/enargy.png";
var s_coin               = base_dir + "sprite/coin.png";

var s_shadow             = base_dir + "sprite/shadow.png";
var s_chara001           = base_dir + "sprite/chara001.png";
var s_chara002           = base_dir + "sprite/chara002.png";
var s_chara003           = base_dir + "sprite/chara003.png";
var s_chara004           = base_dir + "sprite/chara004.png";
var s_chara005           = base_dir + "sprite/chara005.png";
var s_chara007           = base_dir + "sprite/chara007.png";
var s_chara008           = base_dir + "sprite/chara008.png";
var s_chara009           = base_dir + "sprite/chara009.png";

var s_enemy_devil        = base_dir + "sprite/devil_001.png";
var s_enemy_devil_boss   = base_dir + "sprite/devil_002.png";
var s_enemy_snake_body   = base_dir + "sprite/snake_body.png";
var s_enemy_snake_head   = base_dir + "sprite/snake_head.png";
var s_enemy_chameleon    = base_dir + "sprite/chameleon_blue_s.png";
var s_field              = base_dir + "ui/field.jpg";
var s_chara_make_ui      = base_dir + "ui/chara_make_ui.png";
var s_fukidashi          = base_dir + "ui/fukidashi.png";
var s_item_001           = base_dir + "sprite/clockrabbit01-vx.png";
var s_special_item       = base_dir + "sprite/special_item.png";
var s_text_stage_clear   = base_dir + "text/stage_clear.png";
var s_text_game_over     = base_dir + "text/game_over.png";
var s_text_destroy       = base_dir + "text/destroy.png";


var s_cleared_effect     = base_dir + "sprite/kamifubuki64.png";
var s_scape_zone         = base_dir + "ui/escape_zone.png";
var s_convert_success    = base_dir + "ui/convert_success.png";
var s_top                = base_dir + "ui/top.png";
var s_woman              = base_dir + "ui/st-woman2-suit01.png";
var s_navi_girl          = base_dir + "ui/navi_girl.png";

//bgm
var s_bgm_001            = base_dir + "res/sound/bgm/bgm_maoudamashii_cyber09.mp3";
var s_bgm_002            = base_dir + "res/sound/bgm/bgm_maoudamashii_piano07.mp3";
var s_se_dog             = base_dir + "res/sound/se/se_maoudamashii_magical01.mp3";
var s_se_occupied        = base_dir + "res/sound/se/se_maoudamashii_onepoint17.mp3";
var s_se_enemyOccupied   = base_dir + "res/sound/se/se_maoudamashii_onepoint29.mp3";
var s_se_coin            = base_dir + "res/sound/se/se_maoudamashii_system47.mp3";
var s_se_attack          = base_dir + "res/sound/se/se_maoudamashii_battle01.mp3";
var s_se_system          = base_dir + "res/sound/se/se_maoudamashii_system23.mp3";

//story
var s_story_001          = base_dir + "story/001.png";
var s_critical_message2  = base_dir + "ui/critical_message2.png";

var g_top_resources   = [
    s_top,
    s_button001_scale9
];

var g_system_resources   = [
    s_top,
    enemy_json,
    stages_json,
    charactor_json,
    loading_png,
    s_se_system,
    s_button001_scale9
];

var g_chara_select_resources   = [
    s_top,
    enemy_json,
    stages_json,
    charactor_json,
    loading_png,
    s_chara_select,
    s_se_system,
    s_chara001,
    s_button001_scale9,
    s_convert_success
];

var g_resources       = [
    s_facebook_button,
    s_facebook_button_on,
    s_twitter_button,
    s_twitter_button_on,
    enemy_json,
    stages_json,
    charactor_json,
    s_result_clear,
    s_enemy_devil,
    s_enemy_devil_boss,
    s_enemy_snake_body,
    s_enemy_snake_head,
    s_enemy_chameleon,
    s_target,
    loading_png,
    effect_water,
    effect_fire,
    effect_wind,
    effect_sander,
    effect_eye,
    effect_circle,
    effect_energy,
    effect_hart,
    effect_sand,
    effect_tsunami,
    s_enargy,
    s_header,
    s_shadow,
    s_chara001,
    s_chara002,
    s_chara003,
    s_chara005,
    s_chara007,
    s_chara008,
    s_chara009,
    s_initSprite,
    s_button001_scale9,
    s_chip_001,
    s_chip_003,
    s_chip_004,
    s_chip_005,
    s_scape_zone,
    s_input_device,
    s_timer,
    s_field,
    s_marker,
    s_slideButton,
    s_colleague_cnt,
    s_item_001,
    s_cleared_effect,
    s_text_stage_clear,
    s_text_game_over,
    s_hinageshi,
    s_fukidashi,
    s_woman,
    s_navi_girl,
    s_crown,
    s_crown2,
    s_crown3,
    s_critical_message2
];