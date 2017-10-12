/*
 * @Author: Milodu
 * @Date:   2017-10-12 11:08:52
 * @Last Modified by:   Milodu
 * @Last Modified time: 2017-10-12 15:37:24
 */
require('jweixin');

function wxConfig(appid, nonceStr, timestamp, signature, jsApiList) {
	wx.config({
		debug: false,
		appId: appid,
		timestamp: Number(timestamp),
		nonceStr: String(nonceStr),
		signature: signature,
		jsApiList: jsApiList
	});
}
exports.wxInit = function(jsSign) {
	wxConfig(jsSign.appId, jsSign.nonceStr, jsSign.timestamp, jsSign.signature, jsSign.jsApiList);
}