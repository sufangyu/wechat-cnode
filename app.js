//app.js
App({
	globalData: {
		userInfo: null,
		auth: null,
		isLogin: false,
	},
	onLaunch () {
		//调用API
		this.getAuth();
	},
	// 获取 Auth
	getAuth() {
		try {
			this.globalData.auth = wx.getStorageSync('auth') || null;
			console.log('当前 auth => ', this.globalData.auth);
		} catch (err) {
			console.log(err);
		}
	},
	// 设置 Auth - 登录
	setAuth(auth) {
		try {
			wx.setStorageSync('auth', auth);
			this.globalData.auth = auth;
			this.globalData.isLogin = true;
			console.log('当前 auth => ', this.globalData.auth);
		} catch (err) {
			console.log(err);
		}
	},
	// 删除 Auth - 退出登录
	removeAuth() {
		try {
			wx.removeStorageSync('auth');
			this.globalData.auth = null;
			this.globalData.userInfo = null;
			this.globalData.isLogin = false;
			console.log('当前 auth => ', this.globalData.auth);
			console.log('当前 userInfo => ', this.globalData.userInfo);
		} catch (err) {
			console.log(err);
		}
	}
})