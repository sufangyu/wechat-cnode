// collect.js
import util from '../../../utils/util.js';
import moment from '../../../utils/moment.js';
import request from '../../../api/request.js';

const APP = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		topics: [],
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

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.checkIsLogin();
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

		console.log('已登录, 获取用户信息');
		const loginname = APP.globalData.auth.loginName || '';
		this.getUserCollect(loginname);
	},
	// 获取收藏
	getUserCollect(loginname) {
		request.getCollections(loginname, (res) => {
			console.log(res);
			if (res.success) {
				if (res.data.length) {
					const collect = res.data;
					// 格式化数据
					res.data.forEach((item) => {
						item.content = item.content.substring(0, 80).replace(/\r\n/gi, '');
						item.create_at = moment(item.create_at).format('YYYY-MM-DD HH:MM:SS');
					});

					this.setData({
						topics: collect,
					});
				} else {
					// 没有更多数据了
				}

				
			} else {
			}
		}, (err) => {
			console.log(err);
		});
	}
})