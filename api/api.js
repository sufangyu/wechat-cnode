/**
 * API 接口
 */

const API_BASE = ' https://cnodejs.org/api';
const API_V1 = `${API_BASE}/v1`;

/**
 * 登录
 * @returns {string}
 */
function getAccessTokenApi() {
  return `${API_V1}/accesstoken`;
}


/**
 * 获取用户资料
 * @param loginName
 * @returns {string}
 */
function getUserInfoApi(loginName) {
  return `${API_V1}/user/${loginName}`;
}


/**
 * 获取用户的收藏
 * @param loginName
 * @returns {string}
 */
function getCollectionsApi(loginName) {
  return `${API_V1}/topic_collect/${loginName}`;
}


/**
 * 获取已读和未读消息
 * @returns {string}
 */
function getMessagesApi() {
  return `${API_V1}/messages`;
}


/**
 * 获取未读消息数
 * @returns {string}
 */
function getMessageCountApi() {
  return `${API_V1}/message/count`;
}

/**
 * 标记单个消息为已读
 * @returns {string}
 */
function setMessageReadApi(id) {
  return `${API_V1}/message/mark_one/${id}`;
}


/**
 * 获取主题列表
 * @returns {string}
 */
function getTopicsApi() {
  return `${API_V1}/topics`;
}


/**
 * 获取主题详情
 * @param id
 * @returns {string}
 */
function getTopicDetailApi(id) {
  return `${API_V1}/topic/${id}`;
}


/**
 * 新建主题
 * @param id
 * @returns {string}
 */
function createTopicsApi() {
  return `${API_V1}/topics`;
}


/**
 * 修改主题
 * @param id
 * @returns {string}
 */
function updateTopicsApi() {
  return `${API_V1}/topics/update`;
}


/**
 * 收藏主题
 * @returns {string}
 */
function getCollectApi() {
  return `${API_V1}/topic_collect/collect`;
}

/**
 * 取消主题收藏
 * @returns {string}
 */
function getDelCollectApi() {
  return `${API_V1}/topic_collect/de_collect`;
}

/**
 * 点赞 or 取消点赞
 * @param id
 * @returns {string}
 */
function getPraiseApi(id) {
  return `${API_V1}/reply/${id}/ups`;
}


/**
 * 评论(回复)
 * @param id
 * @returns {string}
 */
function getRepliesApi(id) {
  return `${API_V1}/topic/${id}/replies`;
}


export default {
  getAccessTokenApi,
  getUserInfoApi,
  getCollectionsApi,
  getMessagesApi,
  getMessageCountApi,
  setMessageReadApi,
  getTopicsApi,
  getTopicDetailApi,
  createTopicsApi,
  updateTopicsApi,
  getCollectApi,
  getDelCollectApi,
  getPraiseApi,
  getRepliesApi,
};
