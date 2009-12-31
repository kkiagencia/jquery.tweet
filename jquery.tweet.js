"use strict";
(function ($) {
    $.fn.tweet = function (options) {
        var $options = $.extend({}, $.fn.tweet.defaults, options);

        function relative_time(time_value) {
            var parsed_date, relative_to, values, delta;
            values = time_value.split(" ");
            time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
            parsed_date = Date.parse(time_value);
            relative_to = (arguments.length > 1) ? arguments[1] : new Date();
            delta = parseInt((relative_to.getTime() - parsed_date) / 1000, 10);
            if (delta < 60) {
                return 'less than a minute ago';
            } else if (delta < 120) {
                return 'about a minute ago';
            } else if (delta < (45 * 60)) {
                return (parseInt(delta / 60, 10)).toString() + ' minutes ago';
            } else if (delta < (90 * 60)) {
                return 'about an hour ago';
            } else if (delta < (24 * 60 * 60)) {
                return 'about ' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
            } else if (delta < (48 * 60 * 60)) {
                return '1 day ago';
            } else {
                return (parseInt(delta / 86400, 10)).toString() + ' days ago';
            }
        }

        return this.each(function () {
            var $this = $(this), $span = $("<span>");
            $span.text($options.loadingText);
            $this.append($span);

            $.getJSON("http://twitter.com/statuses/user_timeline/" + $options.user + ".json?count=1&callback=?", function (data) {
                var regexp, tweet, date, url;
                regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;                
                tweet = data[0].text.replace(regexp, "<a href=\"$1\">$1</a>");
                date = relative_time(data[0].created_at);
                url = "http://twitter.com/" + $options.user + "/statuses/" + data[0].id;
                $this.empty();
                $this.append($('<span>' + tweet + '</span>')).append(' <a href=\"' + url + '\">' + date + '</a>');
            });
        });
    };

    $.fn.tweet.defaults = {
        loadingText: "fetching latest tweet..."
    };
}(jQuery));
