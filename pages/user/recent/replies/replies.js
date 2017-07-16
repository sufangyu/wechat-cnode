// replies.js
import util from '../../../../utils/util.js';
import moment from '../../../../utils/moment.js';
import request from '../../../../api/request.js';

moment.locale('zh-cn');

const APP = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		statusLoading: {
			show: true,
			image: '../../../../assets/status/loading.svg',
			text: '正在加载中',
		},
		statusFail: {
			show: false,
			image: '../../../../assets/status/fail.svg',
			text: '加载失败，点击重试~',
		},
		statusEmpty: {
			show: false,
			image: '../../../../assets/status/empty.svg',
			text: '暂时没有数据~',
		},
		replies: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

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
		if (!APP.globalData.isLogin) {
			// 未登录, 重定向到登录页面
			console.log('未登录, 重定向到登录页面');
			const redirectUrl = this.route;
			util.redirectToLogin(redirectUrl);
			return;
		}

		console.log('已登录, 获取最近回复');
		const loginname = APP.globalData.auth.loginName || '';
		this.getRecentReplies(loginname);
	},
	// 获取最近回复
	getRecentReplies(loginname) {
		// 初始化加载状态
		this.data.statusLoading.show = true;
		this.data.statusFail.show = false;
		this.data.statusEmpty.show = false;

		this.setData({
			statusLoading: this.data.statusLoading,
			statusFail: this.data.statusFail,
			statusEmpty: this.data.statusEmpty,
		});

		request.getRecentReplies(loginname, (res) => {
			console.log(res);
			if (res.success) {
				this.data.statusLoading.show = false;
				this.data.statusFail.show = false;
				const replies = res.data.recent_replies;

				if (replies.length) {
					// 格式化数据
					replies.forEach((item) => {
						item.last_reply_at = moment(item.last_reply_at).fromNow();
						item.detailUrl = '/pages/topic/detail/detail'
					});

					this.data.replies = replies;
				} else {
					// 没有数据
					this.data.statusEmpty.show = true;
				}
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
				replies: this.data.replies,
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
		const loginname = APP.globalData.auth.loginName || '';
		this.getRecentReplies(loginname);
	},
});