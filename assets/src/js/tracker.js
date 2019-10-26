'use strict';

function stringifyObject(obj) {
    return Object.keys(obj).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
        }).join('&');
}

function getCookie(name) {
	var cookies = document.cookie ? document.cookie.split('; ') : [];

	for (var i = 0; i < cookies.length; i++) {
		var parts = cookies[i].split('=');
		if (decodeURIComponent(parts[0]) !== name) {
			continue;
		}

		var cookie = parts.slice(1).join('=');
		return decodeURIComponent(cookie);
	}

	return '';
}

function setCookie(name, data, args) {
	name = encodeURIComponent(name);
	data = encodeURIComponent(String(data));

	var str = name + '=' + data;

	if(args.path) {
		str += ';path=' + args.path;
	}
	if (args.expires) {
		str += ';expires='+args.expires.toUTCString();
	}

	document.cookie = str;
}

function trackPageview(vars) {
    vars = vars || {};

    // Respect "Do Not Track" requests
    if ('doNotTrack' in navigator && navigator.doNotTrack === "1") {
        return;
    }

    // ignore prerendered pages
    if ('visibilityState' in document && document.visibilityState === 'prerender') {
        return;
    }

    // if <body> did not load yet, try again at dom ready event
    if (document.body === null) {
        document.addEventListener("DOMContentLoaded", () => trackPageview(vars));
        return;
    }

	const postId = aaa.post_id;
	const pagesViewed = getCookie('_aaa_pages_viewed').split(',');
   	const isNewVisitor = pagesViewed.length === 0;
   	const isUniquePageview = pagesViewed.indexOf(postId) === -1;
    const d = {
        p:  postId,
        nv: isNewVisitor ? 1 : 0,
		up: isUniquePageview ? 1 : 0,
    };

    let img = document.createElement('img');
    img.setAttribute('alt', '');
    img.setAttribute('aria-hidden', 'true');
    img.src = aaa.tracker_url + '?action=aaa_collect&' + stringifyObject(d);

    img.addEventListener('load', function() {
        document.body.removeChild(img)
    });

    // in case img.onload never fires, remove img after 1s & reset src attribute to cancel request
    window.setTimeout(() => {
        if (!img.parentNode) {
            return;
        }

        img.src = '';
        document.body.removeChild(img)

		if (isUniquePageview) {
			pagesViewed.push(postId)
		}

        let expires = new Date();
		expires.setHours(expires.getHours() + 6);
		setCookie('_aaa_pages_viewed', pagesViewed.join(','), { expires, path: '/' })
    }, 1000);

    // add to DOM to fire request
    document.body.appendChild(img);
}

trackPageview();