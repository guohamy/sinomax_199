/*
 *
 * update:2016/9/7
 * 修正当前tab指定的a 如果没有找到同级元素返回父级获取index
 * 2016/10/24 添加view 参数,可以选择显示第几个 (后续添加个可以根据url参数读取默认tab的)
 * 2017/01/05 添加自动播放
 * */

/*

 $('.tab-mode2').mstab({
 "event":"click mouseenter",
 "hd":".tab-hd",
 "hdElement": "li",
 "view": 1,
 "cont":".tab-cont .contDate"
 });

 */

//updata
$.fn.mstab = function (op) {
	var de = {
		"action_class": "cur",			//切换加的class [可空]
		"event": "click mouseenter",	//事件类型 [可空]
		"hd": ".tab-hd",				//绑定头部  [非空]
		"hdElement": "li",              //头部绑定类型 [li,a,指定class] [可空]
		"view": 1,
		"autoPlay":false, //自动播放
		"playTime":1000, //播放间隔
		"cont": ".tab-cont .contDate",  //容器
		"callback": null				//回调
	};

	function tab(_this) {
		var _options = $.extend(de, op);
		var _hd = _this.find(_options.hd);
		var contBody = _this.find(_options.cont);
		var $link_a = _this.find('.more-link');

		_this.find(_options.hd).on(_options.event, _options.hdElement, function () {
			var $this = $(this);
			var index, _href;

			if(_options.event.match('mouseenter')){
				clearAutoPlay();
			}


			if (this.nodeName.toLowerCase() === 'li') {
				index = $this.index();

			} else if (this.nodeName.toLowerCase() === "a") {

				index = $this.siblings().length ? $this.index() : $this.parent().index();
				href = $this.attr('data-href');
				if (_href) {
					$link_a.attr('href', _href)
				}
			}

			if (typeof contBody.eq(index)[0] === 'undefined') {
				return;
			}

			_options.viewIndex = index;

			_hd.find('.' + _options.action_class).removeClass(_options.action_class);
			$this.addClass(_options.action_class);
			//contBody.hide();
			contBody.css({"display": "none", "visibility": "hidden"});
			contBody.eq(index).css({"display": "block", "visibility": "visible"});
			if (_options.callback && typeof _options.callback === 'function') {
				_options.callback(index, contBody);
			}

		});//bind


		if(_options.event.match('mouseenter')){
			_this.find(_options.hd).on('mouseleave', _options.hdElement, function () {
				autoPlay();
			})
		}



		//记录tab长度
		_options.length = _hd.find(_options.hdElement).length;
		//init 设置[根据参数viewTab]tab 和对应的tab内容
		function setView() {

			var viewIndex = _options.view && parseInt(_options.view, 10);
			console.log('viewIndex:', viewIndex);
			var tab;
			var tabCont;
			if (viewIndex > 0) {
				--viewIndex;
				_options.viewIndex = viewIndex; //记录当前viewIndex 索引
				tabCont = contBody.eq(viewIndex);
			}
			try {
				_hd.find('.' + _options.action_class).removeClass(_options.action_class); //清除 不小心写错写死在html上的状态
			} catch (e) {
				console.log && console.log(e)
			}

			if (_options.hdElement === 'li' || _options.hdElement === 'a') {  //element [li,a]
				tab = _hd.find(_options.hdElement);
			} else {                                                           //class
				tab = _hd.find('.' + _options.hdElement);
			}

			if (typeof tab.eq(viewIndex)[0] !== 'undefined') {
				tab.eq(viewIndex).addClass(_options.action_class);
			}

			if (typeof tabCont[0] !== 'undefined') {
				contBody.css({"display": "none", "visibility": "hidden"});
				tabCont.css({"display": "block", "visibility": "visible"})
			} else {
				console.log && console.log('未找到对应切换内容');
				//return;
			}

			autoPlay()

		};

		setView();

		function autoPlay(){
			if(!!_options.autoPlay){
				_options.timerHd = setInterval(function(){
					switchView();
				},+_options.playTime);
			}
		}

		function clearAutoPlay(){
			if(_options.timerHd){
				clearInterval(_options.timerHd);
				_options.timerHd = null;
			}
		}

		function switchView(){
			var tab;
			var tabCont;

			if (_options.viewIndex < _options.length - 1) {
				_options.viewIndex++;

			}else{
				_options.viewIndex = 0;
			}
			//console.log('_options.viewIndex:', _options.viewIndex);
			//_options.viewIndex = viewIndex; //记录当前viewIndex 索引
			tabCont = contBody.eq(_options.viewIndex);

			try {
				_hd.find('.' + _options.action_class).removeClass(_options.action_class); //清除 不小心写错写死在html上的状态
			} catch (e) {
				console.log && console.log(e)
			}

			if (_options.hdElement === 'li' || _options.hdElement === 'a') {  //element [li,a]
				tab = _hd.find(_options.hdElement);
			} else {                                                           //class
				tab = _hd.find('.' + _options.hdElement);
			}

			if (typeof tab.eq(_options.viewIndex)[0] !== 'undefined') {
				tab.eq(_options.viewIndex).addClass(_options.action_class);
			}

			if (typeof tabCont[0] !== 'undefined') {
				contBody.css({"display": "none", "visibility": "hidden"});
				tabCont.css({"display": "block", "visibility": "visible"})
			} else {
				console.log && console.log('未找到对应切换内容');
				//return;
			}
		}

	}

	this.each(function () {
		var _this = $(this);
		tab(_this);
	});
};