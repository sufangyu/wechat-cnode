
/**
 * GET, POST 请求
 */
const http = {
    get: function(url, data, success, fail, complete) {
        this.request(url, data, 'GET', success, fail, complete);
    },
    post: function(url, data, success, fail, complete) {
        this.request(url, data, 'POST', success, fail, complete);
    },
    request: function(url, data, method, success, fail, complete) {
        wx.request({
            url: url.trim(),
            data: data,
            method: method,
            header: {
               'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
                success && success(res.data);
            },
            fail: (err) => {
                fail && fail(err);
            },
            complete: (res) => {
                complete && complete(res);
            }
        }); 
    },
};

export default http;