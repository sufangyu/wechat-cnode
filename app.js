//app.js
App({
	globalData: {
		userInfo: null,
		auth: null,
	},
	onLaunch () {
		//调用API
		this.getAuth();
	},
	// 获取 Auth
	getAuth() {
		try {
			this.globalData.auth = wx.getStorageSync('auth');
			console.log('当前 auth => ', this.globalData.auth);
		} catch (err) {
			console.log(err);
		}
	},
	// 设置 Auth
	setAuth(auth) {
		try {
			wx.setStorageSync('auth', auth);
			this.globalData.auth = auth;
			console.log('当前 auth => ', this.globalData.auth);
		} catch (err) {
			console.log(err);
		}
	},
})