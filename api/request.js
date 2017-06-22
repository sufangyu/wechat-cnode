/**
 * 请求
 * Created by 方雨 on 2017/4/23.
 */
import http from './http';
import api from './api';

/**
 * 用户登录
 * @param data
 * @param successCallback
 * @param errorCallback
 */
function login(data, successCallback, errorCallback) {
  http.post(api.getAccessTokenApi(), data, successCallback, errorCallback);
}


/**
 * 获取用户简要信息
 * @param data
 * @param successCallback
 * @param errorCallback
 */
function getUserInfoSimple(data, successCallback, errorCallback) {
  http.post(api.getAccessTokenApi(), data, successCallback, errorCallback);
}


/**
 * 获取用户资料
 * @param loginName
 * @param successCallback
 * @param errorCallback
 */
function getUserInfo(loginName, successCallback, errorCallback) {
  http.get(api.getUserInfoApi(loginName), {}, successCallback, errorCallback);
}


/**
 * 获取最近回复
 * @param loginName
 * @param successCallback
 * @param errorCallback
 */
function getRecentReplies(loginName, successCallback, errorCallback) {
  http.get(api.getUserInfoApi(loginName), {}, successCallback, errorCallback);
}


/**
 * 获取最新发布
 * @param loginName
 * @param successCallback
 * @param errorCallback
 */
function getRecentTopics(loginName, successCallback, errorCallback) {
  http.get(api.getUserInfoApi(loginName), {}, successCallback, errorCallback);
}


/**
 * 获取用户的收藏
 * @param loginName
 * @param successCallback
 * @param errorCallback
 */
function getCollections(loginName, successCallback, errorCallback) {
  http.get(api.getCollectionsApi(loginName), {}, successCallback, errorCallback);
}


/**
 * 获取已读和未读消息
 * @param data
 * @param successCallback
 * @param errorCallback
 */
function getMessages(data, successCallback, errorCallback) {
  http.get(api.getMessagesApi(), data, successCallback, errorCallback);
}


/**
 * 获取未读消息数
 * @param data
 * @param successCallback
 * @param errorCallback
 */
function getMessageCount(data, successCallback, errorCallback) {
  http.get(api.getMessageCountApi(), data, successCallback, errorCallback);
}


/**
 * 标记单个消息为已读
 * @param id
 * @param data
 * @param successCallback
 * @param errorCallback
 */
function setMessageRead(id, data, successCallback, errorCallback) {
  http.post(api.setMessageReadApi(id), data, successCallback, errorCallback);
}


/**
 * 获取主题列表
 * @param data
 * @param successCallback
 * @param errorCallback
 */
function getTopics(data, successCallback, errorCallback) {
  const requestData = {
    tab: data.tab,
    limit: data.size || 10,
    page: data.page || 0,
    mdrender: data.mdrender || false,  // 渲染出现的所有 markdown 格式文本
  };
  http.get(api.getTopicsApi(), requestData, successCallback, errorCallback);
}

/**
 * 获取主题详情
 * @param id
 * @param data
 * @param successCallback
 * @param errorCallback
 */
function getTopicDetail(id, data, successCallback, errorCallback) {
  http.get(api.getTopicDetailApi(id), data, successCallback, errorCallback);
}


/**
 * 创建主题列表
 * @param data
 * @param successCallback
 * @param errorCallback
 */
function createTopics(data, successCallback, errorCallback) {
  http.post(api.createTopicsApi(), data, successCallback, errorCallback);
}


/**
 * 修改主题列表
 * @param data
 * @param successCallback
 * @param errorCallback
 */
function updateTopics(data, successCallback, errorCallback) {
  http.post(api.updateTopicsApi(), data, successCallback, errorCallback);
}


/**
 * 收藏主题
 * @param data
 * @param successCallback
 * @param errorCallback
 */
function collect(data, successCallback, errorCallback) {
  http.post(api.getCollectApi(), data, successCallback, errorCallback);
}


/**
 * 取消主题收藏
 * @param data
 * @param successCallback
 * @param errorCallback
 */
function delCollect(data, successCallback, errorCallback) {
  http.post(api.getDelCollectApi(), data, successCallback, errorCallback);
}


/**
 * 点赞
 * @param id
 * @param data
 * @param successCallback
 * @param errorCallback
 */
function praise(id, data, successCallback, errorCallback) {
  http.post(api.getPraiseApi(id), data, successCallback, errorCallback);
}

/**
 * 评论(回复)
 * @param id
 * @param data
 * @param successCallback
 * @param errorCallback
 */
function replies(id, data, successCallback, errorCallback) {
  http.post(api.getRepliesApi(id), data, successCallback, errorCallback);
}


export default {
  login,
  getUserInfoSimple,
  getUserInfo,
  getRecentReplies,
  getRecentTopics,
  getCollections,
  getMessages,
  getMessageCount,
  setMessageRead,
  getTopics,
  getTopicDetail,
  createTopics,
  updateTopics,
  collect,
  delCollect,
  praise,
  replies,
};
