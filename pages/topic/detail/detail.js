// detail.js
import util from '../../../utils/util.js';
import moment from '../../../utils/moment.js';
import request from '../../../api/request.js';

moment.locale('zh-cn');

var WxParse = require('../../../wxParse/wxParse.js');

const APP = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		statusLoading: {
			show: true,
			image: '../../../assets/status/loading.svg',
			text: '正在加载中',
		},
		statusFail: {
			show: false,
			image: '../../../assets/status/fail.svg',
			text: '加载失败，点击重试~',
		},
		statusEmpty: {
			show: false,
			style: 'module',
			image: '../../../assets/status/empty.svg',
			text: '暂时没有评论~',
		},
		topicId: '',
		topicDetail: {},
		inputActive: false,
		inputFocus: false,
		inputPlaceholder: '写评论',
		isCollected: null,
		reply: {
			id: '',
			name: '',
			content: '',
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const topicId = options.id;

		this.setData({
			topicId: topicId,
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.checkIsLogin();
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	// 检查是否登录
    checkIsLogin() {
		const requestAccessToken = {
			accesstoken: APP.globalData.auth ? APP.globalData.auth.token : '',
		};
		this.getTopicDetail(this.data.topicId, requestAccessToken);
	},
	// 获取 tab 名称
	getTabName(tab) {
		let tabName = '';
		switch (tab) {
			case 'good':
				tabName = '精华';
				break;
			case 'share':
				tabName = '分享';
				break;
			case 'ask':
				tabName = '问答';
				break;
			case 'job':
				tabName = '招聘';
				break;
			case 'dev':
				tabName = '测试';
				break;
			default:
		}
		return tabName;
    },
	// 获取详情
	getTopicDetail(topicId, requestAccessToken) {
		console.log('获取详情 =>> ', topicId);

		// 初始化加载状态
		this.data.statusLoading.show = true;
		this.data.statusFail.show = false;
		this.data.statusEmpty.show = false;

		this.setData({
			statusLoading: this.data.statusLoading,
			statusFail: this.data.statusFail,
			statusEmpty: this.data.statusEmpty,
		});

		request.getTopicDetail(topicId, requestAccessToken, (res) => {
			console.log(res);
			if (res.success) {
				this.data.statusLoading.show = false;
				this.data.statusFail.show = false;
				const topicDetail = res.data;

				topicDetail.create_at = moment(topicDetail.create_at).format('YYYY-MM-DD HH:MM:SS');
				topicDetail.content = WxParse.wxParse('article', 'html', topicDetail.content, this, 5);
				topicDetail.tabName = this.getTabName(topicDetail.tab);

				// 格式化数据
				topicDetail.replies.forEach((item) => {
					item.create_at = moment(item.create_at).format('YYYY-MM-DD HH:MM:SS');
					item.content = this.delHtmlTag(item.content);
					item.upsLength = item.ups.length;
				});

				this.data.topicDetail = topicDetail;

				this.data.isCollected = topicDetail.is_collect;
			} else {
				// 加载出错
				const error_msg = !!res.error_msg ? res.error_msg : '加载失败';
				this.data.statusLoading.show = false;
				this.data.statusFail.show = true;
				this.data.statusFail.text = error_msg;
				this.data.statusEmpty.show = false;
			}
			
			// 更新页面数据
			this.setData({
				statusLoading: this.data.statusLoading,
				statusFail: this.data.statusFail,
				statusEmpty: this.data.statusEmpty,
				topicDetail: this.data.topicDetail,
				isCollected: this.data.isCollected,
			});
		}, (err) => { 
			console.log(err); 
			// 加载出错
			const error_msg = !!res.error_msg ? res.error_msg : '加载失败，请重试';
			this.data.statusLoading.show = false;
			this.data.statusFail.show = true;
			this.data.statusFail.text = error_msg;
			this.data.statusEmpty.show = false;

			this.setData({
				statusLoading: this.data.statusLoading,
				statusFail: this.data.statusFail,
				statusEmpty: this.data.statusEmpty,
			});
		});
	},
	// 加载失败, 重新获取收藏
	failHandle() {
		console.log('加载失败, 重新获取');
		const requestAccessToken = {
			accesstoken: APP.globalData.auth.token || '',
		};
		this.getTopicDetail(this.data.topicId, requestAccessToken);
	},
	// 点赞
	praiseHandle(event) {
		// 未登录
		if (!APP.globalData.isLogin) {
			// 未登录, 重定向到登录页面
			console.log('未登录, 重定向到登录页面');
			const redirectUrl = this.route + '?id=' + this.options.id;
			util.redirectToLogin(redirectUrl);
			return;
		}

		const replyId = event.target.dataset.id;
		console.log(replyId);
		const requestAccessToken = {
			accesstoken: APP.globalData.auth ? APP.globalData.auth.token : '',
		};
		const currentPraise = this.data.topicDetail.replies.filter((item) => {
			return item.id === replyId;
		});
		console.log(currentPraise);

		request.praise(replyId, requestAccessToken, (res) => {
			console.log(res);
			if (res.success) {
				const successMsg = res.action === 'up' ? '成功点赞' : '成功取消点赞';
				const step = res.action === 'up' ? 1 : -1;
				
				currentPraise[0].upsLength += step;
				currentPraise[0].is_uped = res.action === 'up';

				console.log(currentPraise);

				wx.showToast({
					title: successMsg,
					image: '/assets/success.png',
				});

				this.setData({
					topicDetail: this.data.topicDetail,
				});
			} else {
				const failMsg = res.error_msg || '点赞失败, 请重试';
				wx.showToast({
					title: failMsg,
					image: '/assets/fail.png',
				});
			}
		}, (err) => {
			console.log(err);
			const errMsg = err.error_msg || '点赞失败, 请重试';
			wx.showToast({
				title: errMsg,
				image: '/assets/fail.png',
			});
		});
		
	},
	// 收藏
	collectActionHandle() {
		// 未登录
		if (!APP.globalData.isLogin) {
			// 未登录, 重定向到登录页面
			console.log('未登录, 重定向到登录页面');
			const redirectUrl = this.route + '?id=' + this.options.id;
			util.redirectToLogin(redirectUrl);
			return;
		}

		const replyId = this.options.id;
		const requestAccessToken = {
			accesstoken: APP.globalData.auth ? APP.globalData.auth.token : '',
		};

		if (this.data.isCollected) {
			this.delCollectHandle(replyId, requestAccessToken);
		} else {
			this.collectHandle(replyId, requestAccessToken);
		}
	},
	// 收藏主题
    collectHandle(id, requestAccessToken) {
		const data = requestAccessToken;
		data.topic_id = id;

		request.collect(data, (res) => {
			if (res.success) {
				wx.showToast({
					title: '收藏成功',
					image: '/assets/success.png',
				});
				this.setCollectState('collected');
			} else {
				const failMsg = res.error_msg || '收藏失败, 请重试';
				wx.showToast({
					title: failMsg,
					image: '/assets/fail.png',
				});
			}
		}, (err) => {
			const errMsg = err.error_msg || '收藏失败, 请重试';
			wx.showToast({
				title: errMsg,
				image: '/assets/fail.png',
			});
		});
    },
	// 取消收藏主题
    delCollectHandle(id, requestAccessToken) {
		const data = requestAccessToken;
		data.topic_id = id;

		request.delCollect(data, (res) => {
			if (res.success) {
				wx.showToast({
					title: '已取消收藏',
					image: '/assets/success.png',
				});
				this.setCollectState('unCollect');
			} else {
				const failMsg = res.error_msg || '取消收藏失败, 请重试';
				wx.showToast({
					title: failMsg,
					image: '/assets/fail.png',
				});
			}
		}, (err) => {
			const errMsg = err.error_msg || '取消收藏失败, 请重试';
			wx.showToast({
				title: errMsg,
				image: '/assets/fail.png',
			});
		});
    },
	// 设置收藏状态
    setCollectState(action) {
		if (action === 'collected') {
			// 已收藏
			this.data.isCollected = true;
		} else if (action === 'unCollect') {
			// 未收藏
			this.data.isCollected = false;
		}

		this.setData({
			isCollected: this.data.isCollected,
		});
    },
	// 评论
	replyHandle(event) {
		console.log(event);
		const replyId = event.target.dataset.id;
		const replyName = event.target.dataset.name || '';

		console.log(replyId, replyName);
		this.data.reply.id = replyId;
		this.data.reply.name = replyName;

		this.setData({
			inputFocus: true,
			inputPlaceholder: '@'+replyName,
			reply: this.data.reply,
		});
	},
	// 提交评论
	submitReply() {
		console.log(this.data.reply);

		// 未登录
		if (!APP.globalData.isLogin) {
			// 未登录, 重定向到登录页面
			console.log('未登录, 重定向到登录页面');
			const redirectUrl = this.route + '?id=' + this.options.id;
			util.redirectToLogin(redirectUrl);
			return;
		}

		// 内容为空
		if (this.data.reply.conten === '') {
			return;
		}

		const requestAccessToken = {
			accesstoken: APP.globalData.auth ? APP.globalData.auth.token : '',
		};
		const topictId = this.options.id;
		const data = requestAccessToken;

		data.reply_id = this.data.reply.id;
		data.content = this.data.reply.content;

		console.log(data);

		request.replies(topictId, data, (res) => {
			if (res.success) {
				wx.showToast({
					title: '评论成功',
					image: '/assets/success.png',
				});
			} else {
				const failMsg = res.error_msg || '评论失败, 请重试';
				wx.showToast({
					title: failMsg,
					image: '/assets/fail.png',
				});
			}
		}, (err) => {
			const errMsg = err.error_msg || '评论失败, 请重试';
			wx.showToast({
				title: errMsg,
				image: '/assets/fail.png',
			});
		});
		
		
	},
	// 输入事件, 获取评论内容
	inputHandle(event) {
		this.data.reply.content = event.detail.value;
		this.setData({
			reply: this.data.reply, 
		});
	},
	// 获得焦点
	focusHandle() {
		this.setData({
			inputActive: true,
		});
	},
	// 失去焦点
	blurHandle() {
		this.setData({
			inputActive: false,
		});
	},
	// 去掉所有的 html 标记
	delHtmlTag(str) {
		return str.replace(/<[^>]+>/g, '');
	},
})