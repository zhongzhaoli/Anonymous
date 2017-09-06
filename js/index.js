var u_id = ""; //用户id

var pp_u_o = "";
var pp_u_t = "";
var pp_u_th = "";


var ip = "http://10.50.102.135:9980"

var pp_s_room = "";

window.onload = function () {
	//服务器是否开启
	// $.ajax({
	// 	type: 'get',
	// 	url: ip2,
	// 	cache: false,
	// 	dataType: "jsonp",  //跨域采用jsonp方式  
	// 	processData: false,
	// 	timeout: 10000, //超时时间，毫秒
	// 	complete: function (e) {
	// 		if (e.status == 404) {
	// 			alert('服务器正在维护');
	// 			return;
	// 		}
	// 		else if (e.status == 200) {
	// 		}
	// 		else {
	// 			alert('出错');
	// 			return;
	// 		}
	// 	}
	// })


	var socket = io(ip);//socket连接
	u_id = getID();
	socket.emit('up', u_id);

	//登录成功
	socket.on('up_l_u', function (e) {
		console.log(e);
	});

	socket.on('pp_su', function (e) {
		//收到的e 是 |XXXXXX|XXXXX 的格式
		var cc = e.split('|')[1];
		var dd = e.split('|')[2];
		if (cc === u_id || dd === u_id) {
			var socket = io(ip);//socket连接
			alert('匹配成功');
			pp_s_room = e;
			socket.emit('suff', e);


			$('#pp_all')[0].style.display = "none";
			$('#chat_big_box')[0].style.display = "block";
			$('#zxa')[0].style.display = "block";
			$('#sent-box')[0].style.display = "block";

			var can = $('<div class="start_chat_fir">加密成功,可以开始聊天了!</div>').appendTo($('#chat_big_box'));
			$('#body_t')[0].style.minHeight = "calc(100% - 50px)";

			socket.on(pp_s_room, function (e) {
				if (e == "out") {
					alert('对方已退出');
					window.location.reload();
				}
				else {
					if (e.b == u_id) { //e.a
						var div = $('<div class="chat_text-box"></div>').appendTo($('#chat_big_box'));

						$('<div class="chat_text_r">' + e.a + '</div>').appendTo(div);
					}
					else {
						var div = $('<div class="chat_text-box"></div>').appendTo($('#chat_big_box'));

						$('<div class="chat_text_l">' + e.a + '</div>').appendTo(div);
					}

					document.getElementById('body_t').scrollTop = document.getElementById('body_t').scrollHeight;
				}
			})
		}
	})

}
function start() {
	$('#pp_btn')[0].style.display = "none";
	$('#pp_z')[0].style.display = "block"
	var socket = io(ip);//socket连接
	socket.emit('start', u_id);
}

function getID() {
	return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
}
function chat_() {
	var a = $('#chat_text')[0].value;
	var socket = io(ip);//socket连接
	socket.emit(pp_s_room, { a: a, b: pp_s_room, c: u_id });
	$('#chat_text')[0].value = "";
}
function out() {
	window.location.reload();
}