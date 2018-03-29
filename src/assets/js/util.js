var util = {};

var types = ['Object','Function','Array','Number','String','RegExp','Boolean','Null','Undefined']

types.forEach(function(item){
	util['is'+item] = function(source){
		'[object '+item+']' = Object.prototype.toString.call(source);
	}
})
/**
 * [function 判断是否为函数]
 * @param  {[type]} source [description]
 * @return {[type]}        [description]
 */
util.isFunction = function(source) {
	return '[object Function]' === Object.prototype.toString.call(source);
};

/**
 * [function 判断是否为对象]
 * @param  {[type]} source [description]
 * @return {[type]}        [description]
 */
util.isObject = function(source) {
	return '[object Object]' === Object.prototype.toString.call(source);
};

/**
 * [isIE 判断是不是ie]
 * @return {Boolean} [如果是ie返回版本号，不是则返回false]
 */
util.isIE = function() {
	var myNav = navigator.userAgent.toLowerCase();
	return(myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
};

/**
 * [function 对象浅复制]
 * @param  {[type]} dst [description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
util.extend = function(dst, obj) {
	for(var i in obj) {
		if(obj.hasOwnProperty(i)) {
			dst[i] = obj[i];
		}
	}
};
/**
 * [function 获取一个随机的5位字符串]
 * @param  {[type]} prefix [description]
 * @return {[type]}        [description]
 */
util.getName = function(prefix) {
	return prefix + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
};

/**
 * [function 在页面中注入js脚本]
 * @param  {[type]} url     [description]
 * @param  {[type]} charset [description]
 * @return {[type]}         [description]
 */
util.createScript = function(url, charset) {
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	charset && script.setAttribute('charset', charset);
	script.setAttribute('src', url);
	script.async = true;
	return script;
};

/**
 * [function jsonp]
 * @param  {[type]} url      [description]
 * @param  {[type]} onsucess [description]
 * @param  {[type]} onerror  [description]
 * @param  {[type]} charset  [description]
 * @return {[type]}          [description]
 */
util.jsonp = function(url, onsuccess, onerror, charset) {
	var callbackName = util.getName('tt_player');
	window[callbackName] = function() {
		if(onsuccess && util.isFunction(onsuccess)) {
			onsuccess(arguments[0]);
		}
	};
	var script = util.createScript(url + '&callback=' + callbackName, charset);
	script.onload = script.onreadystatechange = function() {
		if(!script.readyState || /loaded|complete/.test(script.readyState)) {
			script.onload = script.onreadystatechange = null;
			// 移除该script的 DOM 对象
			if(script.parentNode) {
				script.parentNode.removeChild(script);
			}
			// 删除函数或变量
			window[callbackName] = null;
		}
	};
	script.onerror = function() {
		if(onerror && util.isFunction(onerror)) {
			onerror();
		}
	};
	document.getElementsByTagName('head')[0].appendChild(script);
};

/**
 * [json 实现ajax的json]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
util.json = function(options) {
	var opt = {
		url: '',
		type: 'get',
		data: {},
		success: function() {},
		error: function() {},
	};
	util.extend(opt, options);
	if(opt.url) {
		var xhr = XMLHttpRequest ?
			new XMLHttpRequest() :
			new ActiveXObject('Microsoft.XMLHTTP');
		var data = opt.data,
			url = opt.url,
			type = opt.type.toUpperCase(),
			dataArr = [];
		if
		for(var k in data) {
			dataArr.push(k + '=' + data[k]);
		}
		if(type === 'GET') {
			url = url + '?' + dataArr.join('&');
			xhr.open(type, url.replace(/\?$/g, ''), true);
			xhr.send();
		}
		if(type === 'POST') {
			xhr.open(type, url, true);
			
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send(dataArr.join('&'));
		}
		xhr.onload = function() {
			var res;
			if(xhr.status === 200 || xhr.status === 304 || xhr.status === 206) {
				if(util.isFunction(opt.success)) {
					res = xhr.responseText;
					if(typeof res === 'string') {
						res = JSON.parse(res);
					}
					opt.success.call(xhr, res);
				}
			} else {
				if(util.isFunction(opt.error)) {
					opt.error.call(xhr, res);
				}
			}
		};
	}
};
export default util;