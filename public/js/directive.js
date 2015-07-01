
function Canvas(ctx, w, h) {
	this.ctx = ctx;
	this.clientW = w;
	this.clientH = h;
}

Canvas.prototype = {
	constructor: Canvas,
	bgdsArr: [[105, 206, 250], [126, 253, 216], [195, 126, 253], [253, 198, 126], [254, 150, 182]],
	bords: [],
	bgds: [105, 206, 250],
	origBgds: [105, 206, 250],
	bgdCount: 0,
	animateCount: 0,
	bgdNum: 0,
	bo: true,
	randomBo: true,

	init: function() {
		var count = 0;
		var This = this;
		if( !requestAnimationFrame ) this.bo = false;
		this.initFn();

		var run = function() {
			count++;
			if( count <= 23 ) {
				This.addBords();
				setTimeout(run, 150);
			}
		};
		run();
	},

	initFn: function() {
		this.drawCanvas();
		var This = this;
		if( !this.bo ) return setTimeout(function() {
			　This.initFn.call(This);
		}, 16.7　);
		requestAnimationFrame(function() {
			　This.initFn.call(This);
		});
	},

	drawCanvas: function() {
		this.ctx.clearRect(0, 0, this.clientW, this.clientH);
		var i;
		var len = this.bords.length;
		this.drawBgd();

		for( i=0; i<len; i++ ) {
			var r = this.bords[i].r;
			var x = this.bords[i].x;
			var y = this.bords[i].y;
			var type = this.bords[i].type;

			this.ctx.save();

			this.ctx.beginPath();
			this.ctx.arc(x, y, r, 0, Math.PI*2);
			this.ctx.closePath();

			//var grd = ctx.createLinearGradient(x-r, y-r, x+r, y+r);
			var grd = this.ctx.createRadialGradient(x, y, 0, x, y, r*1.8);
			grd.addColorStop(0, this.bords[i].c1);
			grd.addColorStop(1, this.bords[i].c2);
			this.ctx.fillStyle = grd;
			this.ctx.fill();

			this.ctx.restore();
		}
		this.updateBords();
	},

	changeBgd: function() {
		var animateFram = 60;
		var target, dif;
		var bo = true;
		this.animateCount++;
		if( this.randomBo ) {
			this.bgdNum++;
			this.bgdNum %= this.bgdsArr.length;
		}
		for( var i=0; i<3; i++ ) {
			target = this.bgdsArr[this.bgdNum][i];
			dif = ( target - this.origBgds[i] ) / animateFram;
			this.bgds[i] = Math.round( this.bgds[i] + dif );
		}
		if( this.animateCount === animateFram ) {
			this.bgdCount = 0;
			this.randomBo = true;
			this.animateCount = 0;
			for( i=0; i<3; i++ ) this.origBgds[i] = this.bgdsArr[this.bgdNum][i];
		}
	},

	drawBgd: function() {
		this.bgdCount++;
		changeBgdTime = 1200;
		if( this.bgdCount >= changeBgdTime ) {
			if( this.bgdCount !== changeBgdTime ) this.randomBo = false;
			this.changeBgd();
		}
		var halfW = this.clientW / 2;
		this.ctx.save();
		var grd = this.ctx.createRadialGradient(halfW, this.clientH, 0, halfW, this.clientH, this.clientW*0.7);
		grd.addColorStop(0, 'rgb('+this.bgds[0]+','+this.bgds[1]+','+this.bgds[2]+')');
		grd.addColorStop(1, 'black');
		this.ctx.fillStyle = grd;
		this.ctx.fillRect(0, 0, this.clientW, this.clientH);
		this.ctx.restore();
	},

	addBords: function() {
		var r, g, b, a;
		var json = {};

		json.r = Math.random()*30 + 50;
		json.x = -json.r;
		json.y = this.clientH + json.r;
		json.vx = Math.random()*30 + 10;
		json.vy = -(Math.random()*30 + 10);
		r = Math.floor( randomNum(165, 255) );
		g = Math.floor( randomNum(165, 255) );
		b = Math.floor( randomNum(165, 255) );
		a = randomNum(0.5, 0.7);
		json.c1 = 'rgba('+r+','+g+','+b+','+a+')';
		r = Math.floor( randomNum(50, 150) );
		g = Math.floor( randomNum(50, 150) );
		b = Math.floor( randomNum(50, 150) );
		a = randomNum(0.5, 0.7);
		json.c2 = 'rgba('+r+','+g+','+b+','+a+')';
		json.decay = parseInt( randomNum(100, 120) );
		json.sx = parseInt(randomNum(0.97, 0.98) * 100) / 100;
		json.sy = parseInt(randomNum(0.97, 0.98) * 100) / 100;

		this.bords.push(json);
	},

	updateBords: function() {
		var len = this.bords.length;
		var i;
		for( i=0; i<len; i++ ) {
			this.bords[i].decay--;
			this.bords[i].x += this.bords[i].vx;
			this.bords[i].y += this.bords[i].vy;

			if( this.bords[i].decay > 0 ) {
				this.bords[i].vx *= this.bords[i].sx;
				this.bords[i].vy *= this.bords[i].sy;
			}

			if( this.bords[i].x < this.bords[i].r ){
				this.bords[i].x = this.bords[i].r;
				this.bords[i].vx = -this.bords[i].vx;
			} else if(this.bords[i].x > this.clientW - this.bords[i].r) {
				this.bords[i].x = this.clientW - this.bords[i].r;
				this.bords[i].vx = -this.bords[i].vx;
			}

			if( this.bords[i].y < this.bords[i].r ) {
				this.bords[i].y = this.bords[i].r;
				this.bords[i].vy = -this.bords[i].vy;
			} else if( this.bords[i].y > this.clientH - this.bords[i].r ) {
				this.bords[i].y = this.clientH - this.bords[i].r;
				this.bords[i].vy = -this.bords[i].vy;
			}
		}
	}
};

var direc = angular.module('myDirective', []);

direc.directive('delay', ['ysAnimate',  function(ysA){
	return {
		link: function($scope, iElm, iAttrs) {
			var clientW = CLIENT_W;
			var clientH = CLIENT_H - 42;
			var can = document.getElementById('canvas');
			can.width = clientW;
			can.height = clientH;
			var ctx = can.getContext('2d');

			var canvas = new Canvas(ctx, clientW, clientH);
			canvas.drawBgd();

			var opt = {
				target: { opacity: 1 },
				time: 400,
				fn: function() {
					canvas.init.call(canvas);
				}
			};
			ysA.move(iElm, opt);
		}
	};
}]);


direc.directive('index', ['$timeout', '$state', '$rootScope', 'ysAnimate', function($timeout, $state, $root, animate){
	return {
		link: function($scope, iElm, iAttrs) {
			iElm.css('height', (CLIENT_H - 50) + 'px');
			var section = iElm.find('section');
			var len = section.length;
			
			var arr = [[-600, -500], [600, -400], [600, 500], [-700, 400]];
			for( var i=0; i<len; i++ ) {
				angular.element(section[i]).css({
					'-webkit-transform': 'translate('+arr[i][0]+'px, '+arr[i][1]+'px)',
					'-moz-transform': 'translate('+arr[i][0]+'px, '+arr[i][1]+'px)',
					'-ms-transform': 'translate('+arr[i][0]+'px, '+arr[i][1]+'px)',
					'-o-transform': 'translate('+arr[i][0]+'px, '+arr[i][1]+'px)',
					'transform': 'translate('+arr[i][0]+'px, '+arr[i][1]+'px)',
					'opacity': 0
				});
			}

			$timeout(function() {
				document.documentElement.scrollTop = document.body.scrollTop = 0;
				for( i=0; i<len; i++ ) {
					animate.transform( angular.element(section[i]), {target: { translate: [0, 0]}, time: 800, fx: 'easeOutStrong'});
					animate.move(angular.element(section[i]), {target: {opacity: 1}, time: 800});
				}
				$root.time = 10;
			}, $root.time);

			$scope.$watch('pagename', function(newValue, oldValue, scope) {
				if( newValue != $root.oldPage ) {
					var fn = function() {
						$root.oldPage = newValue;
						$state.go(newValue);
					};
					for( i=0; i<len; i++ ) {
						animate.transform( angular.element(section[i]), {target: { translate: arr[i]}, time: 1500, fx: 'easeOutStrong'});
						if( i == len -1 ) {
							animate.move(angular.element(section[i]), {target: {opacity: 0}, time: 800,
							fn: fn});
						} else {
							animate.move(angular.element(section[i]), {target: {opacity: 0}, time: 800});
						}
					}
				}
			});
		}
	};
}]);


direc.directive('indexHoverIcon', ['ysAnimate', function(animate){
	return {
		link: function($scope, iElm, iAttrs) {
			var icon = iElm.find('div').eq(2);
			var text = iElm.find('p');

			iElm.on('mouseenter', function() {
				animate.transform(icon, {target: {translate: [0, -30]}, time: 200});
				animate.move(text, {target: {opacity: 1}, time: 300});
			});

			iElm.on('mouseleave', function() {
				animate.transform(icon, {target: {translate: [0, 0]}, time: 200});
				animate.move(text, {target: {opacity: 0}, time: 300});
			});
		}
	};
}]);


direc.directive('page', ['$timeout', '$state', '$rootScope', 'ysAnimate', function($timeout, $state, $root, animate){
	return {
		link: function($scope, iElm, iAttrs) {
			var distance = 400;
			var tag = iElm.next('div');
			
			iElm.css({
				'-webkit-transform': 'translate('+(-distance)+'px, 0px)',
				'-moz-transform': 'translate('+(-distance)+'px, 0px)',
				'-ms-transform': 'translate('+(-distance)+'px, 0px)',
				'-o-transform': 'translate('+(-distance)+'px, 0px)',
				'transform': 'translate('+(-distance)+'px, 0px)',
				'opacity': 0
			});

			$scope.$watch('pagename', function(newValue, oldValue, scope) {
				if( newValue != $root.oldPage ) {
					var fn = function() {
						$root.oldPage = newValue;
						$state.go(newValue);
					};
					animate.transform( iElm, {target: { translate: [distance, 0]}, time: 700, fx: 'easeOutStrong', fn: fn});
					animate.move(iElm, {target: {opacity: 0}, time: 500});
					if( tag.length ) {
						animate.transform( tag, {target: { translate: [0, -300]}, time: 700, fx: 'easeOutStrong'});
						animate.move(tag, {target: {opacity: 0}, time: 700});
					}
				}
			});

			$scope.$watch('startBo', function(newValue, oldValue, scope) {
				if( newValue ) {
					$timeout(function() {
						animate.transform( iElm, {target: { translate: [0, 0]}, time: 800, fx: 'backOut'});
						animate.move(iElm, {target: {opacity: 1}, time: 800});
						$root.time = 10;
						if( tag.length ) {
							var opacityVal = 1;
							var l = iElm[0].offsetLeft - 5 - tag[0].offsetWidth;
							if( l < 0 ) opacityVal = 0;
							tag.css({
								'left': l + 'px', opacity: 0,
								'-webkit-transform': 'translate(0px, -300px)',
								'-moz-transform': 'translate(0px, -300px)',
								'-ms-transform': 'translate(0px, -300px)',
								'-o-transform': 'translate(0px, -300px)',
								'transform': 'translate(0px, -300px)'
							});
							document.documentElement.scrollTop = document.body.scrollTop = 0;
							animate.transform( tag, {target: { translate: [0, 0]}, time: 800, fx: 'backOut'});
							animate.move(tag, {target: {opacity: opacityVal}, time: 800});
						}
					}, $root.time);
				}
			});
		}
	};
}]);


direc.directive('nav', ['$rootScope', function($root){
	return {
		link: function($scope, iElm, iAttrs) {
			var li = iElm.find('li');
			var run = function(str) {
				for( var i=0; i<li.length; i++ ) {
					angular.element(li[i]).removeClass('active');
				}

				if( str == '/' || str == 'index' || str === '' ) {
					angular.element(li[0]).addClass('active');
				} else if( /note/g.test(str) ) {
					angular.element(li[1]).addClass('active');
				} else if( str == 'demo' ) {
					angular.element(li[2]).addClass('active');
				} else if( str == 'message' ) {
					angular.element(li[3]).addClass('active');
				} else if( str == 'about' ) {
					angular.element(li[4]).addClass('active');
				}
			};
			run( $root.pagename );

			$root.$on('$locationChangeStart', function(event, newUrl) {
				var newArr = newUrl.split('/');
				var newSate = newArr[newArr.length-1] || 'index';
				run( newSate );
			});
		}
	};
}]);


direc.directive('loading', [ '$interval', 'ysAnimate', function($interval, animate){
	return {
		link: function($scope, iElm, iAttrs) {
			var elm = iElm.find('div');
			iElm.css({'opacity': 0, 'top': (CLIENT_H-240) / 2 + 'px'});
			var timer;
			$scope.$watch('loadingBo', function(newValue, oldValue, scope) {
				if( newValue != oldValue ) {
					if( newValue ) return Loading.show();
					Loading.hide();
				}
			});

			var Loading = {
				show: function() {
					iElm.css('display', 'block');
					animate.move(iElm, { target: {opacity: 1}, time: 300 });
					this.run();
				},
				hide: function() {
					animate.move(iElm, { target: {opacity: 0}, time: 300, fn: function() {
						iElm.css('display', 'none');
						$interval.cancel(timer);
					}});
				},
				run: function() {
					var time = 1600;
					var fn = function() {
						elm.css({'-webkit-transform':'rotate(0deg)','-moz-transform':'rotate(0deg)','-ms-transform':'rotate(0deg)','-o-transform':'rotate(0deg)','transform':'rotate(0deg)'
						});
						animate.transform(elm, {target: {rotate: 360}, time: time, fx: 'easeBothStrong'});
					};
					fn();
					timer = $interval(fn, time);
				}
			};
		}
	};
}]);


direc.directive('noteTags', ['$window', function($window){
	return {
		link: function($scope, iElm, iAttrs) {
			angular.element($window).bind('scroll', function() {
				var t = this.document.body.scrollTop || this.document.documentElement.scrollTop;
				if( t > 20 ) {
					iElm.addClass('tag-fix');
				} else {
					iElm.removeClass('tag-fix');
				}
			});
		}
	};
}]);


direc.directive('setHeight', function(){
	return {
		link: function($scope, iElm, iAttrs) {
			iElm.css('minHeight', CLIENT_H + 'px');
		}
	};
});


direc.directive('pubuliu', ['$timeout', '$window', 'ysAnimate', 'ysHttp', function($timeout, $window, animate, ajax){
	return {
		link: function($scope, iElm, iAttrs) {
			var sections = iElm.find('section');
			var w = sections.eq(0)[0].offsetWidth;
			var scale = w / 400;
			var bo = true, height;
			var run = function() {
				var data = $scope.data.demos;
				var len = data.length;
				var time = 10;
				var distance = 600;
				angular.forEach(data, function(el, i) {
					time += 100;
					var height = el.height * scale;
					var box = angular.element('<div class="box">');
					var str =  '<a href="'+el.path+'" target="_blank"><div class="time">'+el.time+'</div><img src="'+el.path+'/photo.jpg" style="height:'+height+'px"><div class="text"><h3>'+el.title+'</h3><p>'+el.desc+'</p></div></a>';
					box.html( str );
					box.css('opacity', 0);
					sections.eq( getMinSection(sections) ).append( box );
					$timeout(function() {
						animate.move(box, {
							target: { opacity: 1},
							time: 400
						});
					}, time);
				});
				height = iElm[0].offsetHeight;
				if( bo ) {
					bo = false;
					req();
				}
			};

			var req = function() {
				angular.element($window).bind('scroll', function() {
					var t = this.document.body.scrollTop || this.document.documentElement.scrollTop;
					if( t > height - CLIENT_H ) {
						if( $scope.data.httpBo && $scope.data.nowLen < $scope.data.length ) {
							$scope.data.httpBo = false;
							$scope.fnHttp( $scope.data.nowLen );
						}
					}
				});
			};

			$scope.$watch('data.demos', function(newVal, oldVal) {
				if( newVal != oldVal ) run();
			});
		}
	};
}]);

function getMinSection( sections ) {
	var len = sections.length;
	arr = [];
	for( var i=0; i<len; i++ ) {
		var json = {};
		json.index = i;
		json.height = sections.eq(i)[0].offsetHeight;
		arr.push( json );
	}

	arr.sort(function(a, b) {
		return a.height - b.height;
	});
	return arr[0].index;
}


direc.directive('signIn', ['ysAnimate', function(animate){
	return {
		templateUrl: 'views/signIn.html',
		link: function($scope, iElm, iAttrs) {
			var h = iElm[0].offsetHeight;
			var late = CLIENT_H/2 + h;
			iElm.css({
				'top': CLIENT_H/2-h/2 + 'px',
				'-webkit-transform': 'translate(0px, '+(-late)+'px)',
				'-moz-transform': 'translate(0px, '+(-late)+'px)',
				'-ms-transform': 'translate(0px, '+(-late)+'px)',
				'-o-transform': 'translate(0px, '+(-late)+'px)',
				'transform': 'translate(0px, '+(-late)+'px)',
			});
		}
	};
}]);
