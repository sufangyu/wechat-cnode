// index.js
import request from '../../../api/request.js';

const APP = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLogin: false,       // 是否已登录
		isGetUserInfo: false, // 是否已获取信息
		userInfo: null,       // 用户信息
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
	// 检查是否登录
	checkIsLogin() {
		if (this.data.isGetUserInfo) {
			// 已获取到用户信息
			return;
		} else if (!APP.globalData.isLogin) {
			// 未登录
			this.setData({
				isLogin: APP.globalData.isLogin,
				userInfo: APP.globalData.userInfo,
			});
			return;
		}

		const requestAccessToken = {
			accesstoken: APP.globalData.auth.token || '',
		};
		this.getUserInfoSimple(requestAccessToken);
	},
	// 获取简要的用户信息
	getUserInfoSimple(requestAccessToken) {
		request.getUserInfoSimple(requestAccessToken, (res) => {
			if (res.success) {
				const userInfo = {
					avatarUrl: res.avatar_url,
					id: res.id,
					loginName: res.loginname,
				};

				APP.globalData.userInfo = userInfo;
				this.setData({
					userInfo: userInfo,
					isLogin: true,
				});
			}
        });
	}
})