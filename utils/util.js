function formatTime(date) {
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	var day = date.getDate()

	var hour = date.getHours()
	var minute = date.getMinutes()
	var second = date.getSeconds()


	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

/**
 * 是否是 tabBar 页面
 * @param {*} url 
 */
function isTabBarPage(url) {
	const tabBarPages = [
		'/pages/index/index',
		'/pages/message/message',
		'/pages/user/index/index',
	];

	return tabBarPages.indexOf(url) !== -1;	
} 


/**
 * 重定向
 * @param {*} url 
 */
function redirect(url) {
	if (isTabBarPage(url)) {
		wx.switchTab({
			url: url,
			success: (res) => {
				console.log(res);
			},
			fail: (err) => {
				console.log(err);
			}
		});
	} else {
		wx.redirectTo({
			url: url,
			success: (res) => {
				console.log(res);
			},
			fail: (err) => {
				console.log(err);
			}
		});
	}
}


/**
 * 重定向到登录页面
 * @param {*} url 
 */
function redirectToLogin(url) {
	const redirectUrl = '/pages/account/login?redirect=/' + encodeURIComponent(url);
	redirect(redirectUrl);
}



module.exports = {
	formatTime,
	isTabBarPage,
	redirect,
	redirectToLogin,
}
