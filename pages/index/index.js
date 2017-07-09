//index.js
import request from '../../api/request.js';
import moment from '../../utils/moment.js';

Page({
    data: {
		userInfo: {},
		tabs: [
			{
				value: 'all',
				name: '全部'
			},
			{
				value: 'good',
				name: '精华'
			},
			{
				value: 'share',
				name: '分享'
			},
			{
				value: 'ask',
				name: '问答'
			},
			{
				value: 'job',
				name: '工作'
			},
			{
				value: 'dev',
				name: '测试'
			}
		],
		currentTab: '',
		nextPage: 1,
		topics: {
			all: {
				lists: [],
				nextPage: 1,
				isLoading: false,
				isNoData: false,
				isInit: false,
			},
			good: {
				lists: [],
				nextPage: 1,
				isLoading: false,
				isNoData: false,
				isInit: false,
			},			
			share: {
				lists: [],
				nextPage: 1,
				isLoading: false,
				isNoData: false,
				isInit: false,
			},
			job: {
				lists: [],
				nextPage: 1,
				isLoading: false,
				isNoData: false,
				isInit: false,
			},
			ask: {
				lists: [],
				nextPage: 1,
				isLoading: false,
				isNoData: false,
				isInit: false,
			},
			dev: {
				lists: [],
				nextPage: 1,
				isLoading: false,
				isNoData: false,
				isInit: false,
			},
		},
	},
    onLoad() {
		// 初始化设置当前 tab
		this.setActiveTab(this.data.tabs[0].value);
		
		// 获取主题数据
		this.getTopics();
		
    },
    // 获取主题数据
    getTopics() {
		const currentTabObj = this.data.topics[this.data.currentTab];
		
		console.log(currentTabObj.isInit && currentTabObj.isLoading);

		// 当前 tab 列表正在请求数据中
		if (currentTabObj.isLoading || currentTabObj.isNoData) {
			return;
		}
		currentTabObj.isLoading = true;
		// this.setData({
		// 	topics: this.data.topics,
		// });

		console.log('currentTabObj =>>', currentTabObj);
		
		if (!currentTabObj.isInit) {
			// 未初始化, 显示弹出层的 '加载中'
			wx.showLoading({
				title: '加载中',
			});
		}

		const data = {
			tab: this.data.currentTab,
			page: this.data.nextPage,
		};

		request.getTopics(data, (res) => {
			console.log(res);

			wx.hideLoading();
			currentTabObj.isLoading = false;
			currentTabObj.isInit = true;

			if (this.data.nextPage > 5) {
				// 模拟加载到第5页没有数据了
				currentTabObj.isNoData = true;
			}

			if (res.success) {
				if (res.data.length) {
					// 格式化数据
					res.data.forEach((item) => {
						item.content = item.content.substring(0, 80).replace(/\r\n/gi, '');
						item.create_at = moment(item.create_at).format('YYYY-MM-DD HH:MM:SS');
						item.detailUrl = '/pages/topic/detail/detail'
					});

					console.log(currentTabObj);

					currentTabObj.lists = currentTabObj.lists.concat(res.data);
					currentTabObj.nextPage = this.data.nextPage + 1;

					this.setData({
						topics: this.data.topics,
					});
				} else {
					// 没有更多数据了
					currentTabObj.isNoData = true;
					this.setData({
						topics: this.data.topics,
					});
				}
			}
		}, (err) => {
			wx.hideLoading();
			currentTabObj.isLoading = false;
			this.setData({
				topics: topics,
			});
			console.log(err);
		});
    },
	loadMore() {
		this.setNextPage(this.data.currentTab);
		this.getTopics();
	},
    /**
	 * 切换 tab
	 * @param {*} event 
	 */
    changeTab(event) {
        const currentTab = event.currentTarget.dataset.value;
		// 设置当前 tab 和 当前 tab 的下一页页码
        this.setActiveTab(currentTab);
		this.setNextPage(currentTab);

		if (!this.data.topics[currentTab].isInit) {
			// 未初始化 
			this.getTopics();
		}
    },
	/**
	 * 设置当前 tab
	 * @param {*} tab 
	 */
    setActiveTab(tab) {
        this.setData({
            currentTab: tab,
        });

        console.log('当前 tab =>> ', this.data.currentTab);
    },
	/**
	 * 设置当前 tab 页码
	 * @param {*} tab 
	 */
    setNextPage(tab) {
        this.setData({
            nextPage: this.data.topics[tab].nextPage,
        });
    }
})
