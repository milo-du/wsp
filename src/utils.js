function hasClass(elements, cName) {
	return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
};
exports.addClass = function(elements, cName) {
	if (!hasClass(elements, cName)) {
		elements.className += " " + cName;
	};
}
exports.removeClass = function(elements, cName) {
	if (hasClass(elements, cName)) {
		elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
	};
}
exports.mobileUA = function() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function refreshRem() {
	var win = window,
		doc = win.document,
		docEl = doc.documentElement,
		width = docEl.getBoundingClientRect().width;
	if (width > 540) { // 最大宽度
		width = 540;
	}
	var rem = width / 3.75; // iPhone6比例
	docEl.style.fontSize = rem + 'px';
	window.__REM__ = rem;
}

exports.refreshRem = function() {
	var tid;
	window.addEventListener('resize', function() {
		clearTimeout(tid);
		tid = setTimeout(refreshRem, 300);
	}, false);
	refreshRem();
}