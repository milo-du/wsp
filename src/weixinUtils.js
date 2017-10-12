/*
 * @Author: Milodu
 * @Date:   2017-10-12 11:08:52
 * @Last Modified by:   Milodu
 * @Last Modified time: 2017-10-12 11:14:13
 */
require('jweixin');

function wxConfig(appid, nonceStr, timestamp, signature, jsApiList) {
	wx.config({
		debug: true,
		appId: appid,
		timestamp: timestamp,
		nonceStr: nonceStr,
		signature: signature,
		jsApiList: jsApiList
	});
}
exports.wxInit = function(jsSign) {
	wxConfig(jsSign.appId, jsSign.nonceStr, jsSign.timestamp, jsSign.signature, jsSign.jsApiList);
}