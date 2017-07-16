// login.js
import util from '../../utils/util.js';
import request from '../../api/request.js';

const APP = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
		disabled: false,
		loading: false,
		token: '',
		redirect: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		this.setData({    
			redirect: options.redirect || '',
		});
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
	// 扫码登录
	loginByScanCode() {
		wx.scanCode({
			success: (res) => {
				console.log(res);
				this.setData({
					token: res.result,
				});

				this.submitLogin();
			},
			fail: (err) => {
				console.log(err);
			},
		})
	},
	// 提交登录
	submitLogin() {
		console.log('提交登录');
		console.log(this.data);

		if (this.data.token === '') {
			wx.showToast({
				title: '输入AccessToken',
				image: '/assets/fail.png',
				complete: (result) => {
					console.log(result);
				},
			});
			return;
		}

		this.setLogining();

		const data = {
			accesstoken: this.data.token,
		};

		request.login(data, (res) => {
			this.removeLogining();
			if (res.success) {
				// 设置登录信息
				const auto = {
					token: this.data.token,
					loginName: res.loginname,
				};
				APP.setAuth(auto);

				wx.showToast({
					title: '登录成功',
					image: '/assets/success.png',
					duration: 2000,
					success: () => {
						setTimeout(() => {
							this.setData({
								token: '',
							});
							const redirectUrl = this.data.redirect || '/pages/index/index';
							util.redirect(decodeURIComponent(redirectUrl));
						}, 2000);
						
					}
				});
			} else {
				const failMsg = res.error_msg || '登录失败';
				wx.showToast({
					title: failMsg,
					image: '/assets/fail.png',
				});
			}
		}, (err) => {
			this.removeLogining();
			wx.showToast({
				title: '登录失败',
				image: '/assets/fail.png',
			});
		});
	},
	// 获取输入框的值
	inputHandle(event) {
		this.setData({
			token: event.detail.value
		});
	},
	// 设置登录中状态
	setLogining() {
		this.setData({
			disabled: true,
			loading: true,
		});
	},
	// 删除登录中状态
	removeLogining() {
		this.setData({
			disabled: false,
			loading: false,
		});
	},
})