var ex = require('express')();  //加载模块
var http = require('http').Server(ex);
var io = require('socket.io')(http);  //加载socket 模块

//用户列表
var user_l = {};
//匹配列表
var user_p = {};
//匹配成功
var user_p_s = "";
//匹配成功列表
var user_p_s_list = {};
//每个人的房间
var user_room = {};

http.listen(9980, function () { //建立服务
	console.log('10.50.102.135:9980'); //打印
})

io.on('connection', function (socket) {  //连接
	//登录
	socket.on('up', function (e) { //接收
		socket.name = e;
		console.log(e + '已登录'); //答应
		user_l[e] = e;
		console.log(user_l);
		io.emit('up_l_u', user_l);
	})
	//匹配
	socket.on('start', function (e) {
		user_p[e] = e;
		delete user_l[e];
		console.log(e + '已加入匹配');
		var count = 0;
		for (var key in user_p) {
			count++;
		}
		if (count == 2) {
			for (var key in user_p) {
				user_p_s = user_p_s + '|' + user_p[key];
			}
			for (var key in user_p) {
				user_room[user_p[key]] = user_p_s;
				delete user_p[user_p[key]];
			}
			console.log(user_room)
			io.emit('pp_su', user_p_s);
			user_p_s = "";
		}
	})
	//匹配成功后的聊天
	for (var key in user_p_s_list) {
		var a = user_p_s_list[key];
		socket.on(a, function (e) {
			console.log(a);
			io.emit(e.b, { a: e.a, b: e.c });
			// socket.on('disconnect', function(){
			// 	io.emit(e.b,'out');
			// });
		})
	}

	//加入匹配成功列表
	socket.on('suff', function (e) {
		if (!user_p_s_list.hasOwnProperty(e)) {
			user_p_s_list[e] = e;
			console.log('匹配成功列表');
			console.log(user_p_s_list);
		}
	})
	//退出
	socket.on('disconnect', function () {
		if (!socket.name) {
			return;
		}
		else {
			console.log(socket.name + '已退出');
			io.emit(user_room[socket.name], 'out');
			delete user_l[socket.name];
			delete user_p[socket.name];
			delete user_room[socket.name];
		}
	});
});