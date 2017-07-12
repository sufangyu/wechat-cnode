// create.js
import util from '../../../utils/util.js';
import request from '../../../api/request.js';

const APP = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		topic: {
			tabs: [
				{
					id: 0,
        			name: '问答',
					tab: 'ask'
				},
				{
					id: 1,
        			name: '分享',
					tab: 'share'
				},
				{
					id: 2,
        			name: '招聘',
					tab: 'job'
				},
				{
					id: 3,
        			name: '测试',
					tab: 'dev'
				},				
			],
			selectTabIndex: -1,
			selectTab: '',
			title: '',
			content: '',
		},
		isSubmitting: false,
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
		// this.data.topic.selectTabIndex = this.getSelectTabIndex(this.data.topic.selectTab);
		// this.setData({
		// 	topic: this.data.topic,
		// });

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

		console.log('已登录, 可以编辑~~');
	},
	// 提交发布主题
	submitTopic() {
		// 检查是否为空
		let isEmpty = false;
		let emptyTips = '';
		if (this.data.topic.selectTab === '') {
			console.log(11111111);
			emptyTips = '分类不能为空';
			isEmpty = true;
		} else if (this.data.topic.title === '') {
			console.log(2222222222);
			emptyTips = '标题不能为空';
			isEmpty = true;
		} else if (this.data.topic.content === '') {
			console.log(33333333333);
			emptyTips = '内容不能为空';
			isEmpty = true;
		}

		if (isEmpty) {
			wx.showToast({
				title: emptyTips,
				image: '../../../assets/fail.svg',
				duration: 2000,
			});
			return;
		} else if (this.data.isSubmitting) {
			return;
		}
		
		// 提交
		this.setData({
			isSubmitting: true,
		});
		wx.showLoading({
			title: '正在提交中',
			mask: true,
		});

		const requestAccessToken = {
			accesstoken: APP.globalData.auth ? APP.globalData.auth.token : '',
		};
		const data = requestAccessToken;
		data.title = this.data.topic.title;
		data.tab = this.data.topic.selectTab;
		data.content = this.data.topic.content;

		request.createTopics(data, (res) => {
			wx.hideLoading();
			this.setData({
				isSubmitting: false,
			});
			console.log(res);

			if (res.success) {
				wx.showToast({
					title: '新建主题成功',
					image: '../../../assets/success.svg',
					duration: 2000,
					success: () => {
						setTimeout(() => {
							console.log('重定向到详情页面');
							const topicId = res.topic_id;
							const detailUrl = '/pages/topic/detail/detail?id=' + topicId;
							util.redirect(detailUrl);
						}, 2000);
						
					}
				});
			} else {
				const failMsg = res.error_msg || '新建主题失败, 请重试';
				wx.showToast({
					title: failMsg,
					image: '../../../assets/fail.svg',
				});
			}
		}, (err) => {
			wx.hideLoading();
			this.setData({
				isSubmitting: false,
			});

			const errMsg = err.error_msg || '新建主题失败, 请重试';
			wx.showToast({
				title: errMsg,
				image: '../../assets/fail.svg',
			});
		});

	},
	// 获取选择分类的下标
	getSelectTabIndex(tabName) {
		console.log(tabName);
		let selectTabIndex = -1;
		const index2 = this.data.topic.tabs.forEach((item, index) => {
			if (item.tab === tabName) {
				selectTabIndex = index;
			}
		});

		return selectTabIndex;	
	},
	// 获取分类
	bindSelectCategory(event) {
		const index = event.detail.value;

		this.data.topic.selectTabIndex = index;
		this.data.topic.selectTab = this.data.topic.tabs[index].tab;

		this.setData({
			topic: this.data.topic,
		});
	},
	// 获取标题
	inputTitleHandle(event) {
		this.data.topic.title = event.detail.value;

		this.setData({
			topic: this.data.topic,
		});
	},
	// 内容标题
	inputContentHandle(event) {
		this.data.topic.content = event.detail.value;

		this.setData({
			topic: this.data.topic,
		});
	},
})