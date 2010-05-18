/*
 *    Copyright (c) 2010 Pete O'Grady 
 *    Freely distributable under the terms of the MIT license.
 */

"use strict";
Date.prototype.timeAgoInWords = function (relativeDate) {
	var delta;
    relativeDate = relativeDate || new Date();
	delta = parseInt((relativeDate.getTime() - this) / 1000, 10);
	if (delta < 60) {
	    return 'less than a minute ago';
	} else if (delta < 120) {
	    return 'about a minute ago';
	} else if (delta < (45 * 60)) {
	    return (parseInt(delta / 60, 10)) + ' minutes ago';
	} else if (delta < (90 * 60)) {
	    return 'about an hour ago';
	} else if (delta < (24 * 60 * 60)) {
	    return 'about ' + (parseInt(delta / 3600, 10)) + ' hours ago';
	} else if (delta < (48 * 60 * 60)) {
	    return '1 day ago';
	} else {
	    return (parseInt(delta / 86400, 10)) + ' days ago';
	}
};

(function ($) {
    $.fn.tweet = function (options) {
        var $options = $.extend({}, $.fn.tweet.defaults, options);

        return this.each(function () {
            var $this = $(this), $span = $("<span>");
            $span.text($options.loadingText);
            $this.append($span);

            $.getJSON("http://twitter.com/statuses/user_timeline/" + $options.user + ".json?count=1&callback=?", function (data) {
                if (data.length > 0) {
                    var regexp, tweet, date, url, dateSplit;
                    regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;                
                    tweet = data[0].text.replace(regexp, "<a href=\"$1\">$1</a>");
                    dateSplit = data[0].created_at.split(" ");
                    date = new Date(dateSplit[1] + " " + dateSplit[2] + ", " + dateSplit[5] + " " + dateSplit[3]).timeAgoInWords();
                    url = "http://twitter.com/" + $options.user + "/statuses/" + data[0].id;
                    $this.empty();
                    $this.append($('<span>' + tweet + '</span>')).append(' <a href=\"' + url + '\">' + date + '</a>');
                } else {
                    $this.empty();
                }
            });
        });
    };

    $.fn.tweet.defaults = {
        loadingText: "fetching latest tweet..."
    };
}(jQuery));
