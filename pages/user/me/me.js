// me.js
import util from '../../../utils/util.js';
import moment from '../../../utils/moment.js';
import request from '../../../api/request.js';

const APP = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
		userInfoDetail: null,
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
		this.getUserInfoDetail(loginname);
	},
	// 获取用户详细信息
	getUserInfoDetail(loginname) {
		request.getUserInfo(loginname, (res) => {
			console.log(res);
			if (res.success) {
				const userInfo = res.data;
				const detail = {
					avatar: userInfo.avatar_url,
					name: userInfo.loginname,
					score: userInfo.score,
					createDate: moment(userInfo.create_at).format('YYYY-MM-DD'),
					email: userInfo.githubUsername + '@github.com',
				};

				this.setData({
					userInfoDetail: detail,
				});
			} else {
				const failMsg = res.error_msg || '加载失败';
				wx.showToast({
					title: failMsg,
					image: '/assets/fail.png',
				});
			}
		}, (err) => {
			console.log(err);
			const errMsg = err.error_msg || '网络异常';
			wx.showToast({
				title: errMsg,
				image: '/assets/fail.png',
			});
		});
	},
})