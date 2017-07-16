// message.js
import util from '../../utils/util.js';
import moment from '../../utils/moment.js';
import request from '../../api/request.js';

moment.locale('zh-cn');

const APP = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		statusLoading: {
			show: true,
			image: '../../assets/status/loading.svg',
			text: '正在加载中',
		},
		statusFail: {
			show: false,
			image: '../../assets/status/fail.svg',
			text: '加载失败，点击重试~',
		},
		statusEmptyForReaded: {
			show: false,
			image: '../../assets/status/empty.svg',
			text: '暂时没有已读信息~',
		},
		statusEmptyForUnRead: {
			show: false,
			image: '../../assets/status/empty.svg',
			text: '暂时没有未读信息~',
		},
		ativeIndex: '1',
		isLoaded: false,
      	unRead: [],  // 未读信息
		readed: [],  // 已读信息
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
	// 检查是否已经登录
	checkIsLogin() {
		console.log('检查是否已经登录');
		if (!APP.globalData.isLogin) {
			// 未登录, 重定向到登录页面
			console.log('未登录, 重定向到登录页面');
			const redirectUrl = this.route;
			util.redirectToLogin(redirectUrl);
			return;
		}

		this.getMessages();
	},
	// 获取未读信息 and 已读信息
	getMessages() {
		// 初始化加载状态
		this.data.statusLoading.show = true;
		this.data.statusFail.show = false;
		this.data.statusEmptyForUnRead.show = false;
		this.data.statusEmptyForReaded.show = false;

		this.setData({
			statusLoading: this.data.statusLoading,
			statusFail: this.data.statusFail,
			statusEmptyForUnRead: this.data.statusEmptyForUnRead,
			statusEmptyForReaded: this.data.statusEmptyForReaded,
		});


		const requestAccessToken = {
			accesstoken: APP.globalData.auth ? APP.globalData.auth.token : '',
		};
		const data = requestAccessToken;
		data.mdrender = false;

		request.getMessages(data, (res) => {
			console.log(res);
			// 初始化加载成功
			this.moduleLoadState = 2;

			if (res.success) {
				res.data.has_read_messages.forEach((item) => {
					item.create_at = moment(item.create_at).fromNow();
					item.detailUrl = '/pages/topic/detail/detail?id=' + item.topic.id;
				});

				res.data.hasnot_read_messages.forEach((item) => {
					item.create_at = moment(item.create_at).fromNow();
					item.detailUrl = '/pages/topic/detail/detail?id=' + item.topic.id;
				});

				this.data.statusLoading.show = false;
				this.data.statusFail.show = false;
				this.data.statusEmptyForUnRead.show = false;
				this.data.statusEmptyForReaded.show = false;
				this.data.isLoaded = true;
				this.data.readed = res.data.has_read_messages;
				this.data.unRead = res.data.hasnot_read_messages;

				this.setData({
					readed: this.data.readed,
					unRead: this.data.unRead,
					statusLoading: this.data.statusLoading,
					statusFail: this.data.statusFail,
					statusEmptyForUnRead: this.data.statusEmptyForUnRead,
					statusEmptyForReaded: this.data.statusEmptyForReaded,
					isLoaded: this.data.isLoaded,
				});
			} else {
				// 加载出错
				const failMsg = !!res.error_msg ? res.error_msg : '加载失败';
				this.data.statusLoading.show = false;
				this.data.statusFail.text = failMsg;
				this.data.statusFail.show = true;
				this.data.statusEmptyForUnRead.show = false;
				this.data.statusEmptyForReaded.show = false;

				this.setData({
					statusLoading: this.data.statusLoading,
					statusFail: this.data.statusFail,
					statusEmptyForUnRead: this.data.statusEmptyForUnRead,
					statusEmptyForReaded: this.data.statusEmptyForReaded,
				});
			}
		}, (err) => {
			console.log(err);
			// 加载出错
			const errorMsg = !!res.error_msg ? res.error_msg : '加载失败，请重试';
			this.data.statusLoading.show = false;
			this.data.statusFail.text = errorMsg;
			this.data.statusFail.show = true;
			this.data.statusEmptyForUnRead.show = false;
			this.data.statusEmptyForReaded.show = false;

			this.setData({
				statusLoading: this.data.statusLoading,
				statusFail: this.data.statusFail,
				statusEmptyForUnRead: this.data.statusEmptyForUnRead,
				statusEmptyForReaded: this.data.statusEmptyForReaded,
			});
		});
	},
	// 加载失败, 重新获取收藏
	failHandle() {
		console.log('加载失败, 重新获取');
		this.getMessages();
	},
	// tab 切换
	tabHandle(event) {
		this.data.ativeIndex = event.currentTarget.dataset.index;

		this.setData({
			ativeIndex: this.data.ativeIndex,
		});
	},
})