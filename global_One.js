/**
 * oo.movie.hiker - 海阔视界版 - (o˘◡˘o)
 *
 * 其它浏览器版本，可以查看 https://gitee.com/ecruos/oo
 */

var VERSION = '0.12.19';

// VIP视频解析 - 解析网址
var VIP_URLS = `
 腾讯专用 https://vip.66parse.club/?url=
 爱奇艺专用 https://www.playm3u8.cn/jiexi.php?url=
 h8x http://www.h8jx.com/jiexi.php?url=
    优酷专用 http://www.10yy.com.cn/?url=
      360解析 http://jx.cx77m1.cn/?url= 
    初心解析 http://jx.bwcxy.com/?v=
    1907 https://z1.m1907.cn/?jx=
     云播放 http://yun.mt2t.com/lines?url= 
    360dy接口 http://yun.360dy.wang/?url=
    蓝光 http://www.jx4k.com/k.php?url=
    17K云 http://17kyun.com/api.php?url=
            宝码 https://jiexi.cnbmly.cn/?url=
  VIP https://chinese-elements.com/v.html?zwx=
  https://jiexi.071811.cc/jx2.php?url=
  极速 http://jx.szwlss.cn/api/?url=
  猪蹄 https://jx.iztyy.com/svip/?url=
  宿命 http://api.sumingys.com/index.php?url=
  52a http://jx.52a.ink/?url=
  98a http://jx.98a.ink/?url=
  17k http://17kyun.com/api.php?url=
  2020 https://api.2020jx.com/?url=
   

`;

// 搜索源
var SEARCH_SOURCES = `

  奈菲 https://www.nfmovies.com/search.php?page=1&searchword=**

  云播 https://m.yunbtv.com/vodsearch/-------------.html?wd=**  https://www.yunbtv.com/vodsearch/-------------.html?wd=**

  飞极速 http://m.feijisu8.com/search/**  http://feijisu8.com/search/**

  樱花 http://m.yhdm.tv/search/**/  http://www.yhdm.tv/search/**/

  1090 https://1090ys.com/?c=search&sort=addtime&order=desc&page=1&wd=**

  残月 http://ys.23yue.cn/seacher-**.html

  独播 https://www.duboku.net/vodsearch/-------------.html?wd=**

  拾伍 https://www.shiwutv.com/vodsearch/-------------.html?wd=**

  大全 http://01th.net/search/?wd=**

  影迷 https://www.yingmiwo.com/vodsearch.html?wd=**

  APP https://app.movie/index.php/vod/search.html?wd=**

  八兔 http://www.8tutv.com/search/?category=0&q=**

  vipku http://www.2n65.cn/index.php/vod/search.html?wd=**

`;

var screenWidth = window.screen.width;
var isMobile = screenWidth <= 600;

var SEARCH_VIP_SOURCES = `

  爱奇艺 https://m.iqiyi.com/search.html?source=default&key=**  https://so.iqiyi.com/so/q_**

  腾讯 https://m.v.qq.com/search.html?act=0&keyWord=**   https://v.qq.com/x/search/?q=**

  哔哩哔哩 https://m.bilibili.com/search.html?keyword=**  https://search.bilibili.com/all?keyword=**

  优酷 https://www.soku.com/m/y/video?q=**  https://so.youku.com/search_video/q_**

  搜狐 https://m.tv.sohu.com/upload/h5/m/mso.html?key=**  https://so.tv.sohu.com/mts?wd=**

  芒果 https://m.mgtv.com/so/?k=**  https://so.mgtv.com/so/k-**

  乐视 http://m.le.com/search?wd=**  http://so.le.com/s?wd=**

`;

var commonSearchKeywordRegex = /(wd|key|keyword|keyWord|q)=([^&\?\/\.]+)|(search\/|seacher-|q_)([^&\?\/\.]+)/;

function getKeywordFromUrl(regex, url) {
  var matches = (url || location.href).match(regex || commonSearchKeywordRegex);
  return matches
    ? decodeURIComponent(regex ? matches[1] : matches[2] || matches[4])
    : '';
}

var SEARCH_ADDONS = [
  {
    match: /m.iqiyi.com\/search|so.iqiyi.com/,
    position: '.m-box, search-con-page'
  },
  {
    match: /v.qq.com\/(x\/)?search/,
    position: '.search_item, .wrapper_main > .mod_pages'
  },
  {
    match: /bilibili.com\/search|search.bilibili.com/,
    position: '.page-wrap, .index__board__src-search-board-'
  },
  {
    match: /soku.com\/m.+q=|so.youku.com\/search_video/,
    position: '#bpmodule-main, .yk_result'
  },
  {
    // TODO 移动端适配
    match: /m.tv.sohu.com.+key=|so.tv.sohu.com.+wd=/,
    position: '.ssFilter',
    positionBy: 'before'
  },
  {
    // TODO 移动端适配
    match: /m.mgtv.com\/so\/|so.mgtv.com\/so/,
    position: '#app, .search-resultlist',
    keyword: /k[-=]([^&\?\/\.]+)/
  },
  {
    // TODO 待适配
    match: /m.le.com\/search|so.le.com\/s/,
    position: '.Relate, .column_tit',
    positionBy: 'before'
  },
  {
    match: 'nfmovies.com/search',
    position: '.hy-page',
    keyword($) {
      return $('.hy-video-head .text-color')
        .eq(1)
        .text()
        .replace(/^“|”$/g, '');
    }
  },
  {
    match: 'yunbtv.com/vodsearch',
    position: '.pager',
    keyword: '.breadcrumb font'
  },
  {
    match: 'feijisu8.com/search',
    position: '#result'
  },
  {
    match: 'yhdm.tv/search',
    position: '.footer, .foot',
    positionBy: 'before'
  },
  {
    match: /1090ys.com\/.+c=search/,
    position: '.stui-page'
  },
  {
    match: 'ys.23yue.cn/seacher',
    position: '.stui-pannel_bd > .stui-vodlist__media'
  },
  {
    match: 'duboku.net/vodsearch',
    position: '.myui-panel_bd > .myui-vodlist__media'
  },
  {
    match: 'shiwutv.com/vodsearch',
    position: '.stui-page'
  },
  {
    match: '01th.net/search',
    position: '.stui-page'
  },
  {
    match: 'yingmiwo.com/vodsearch',
    position: '.page_tips'
  },
  {
    match: 'app.movie/index.php/vod/search.html',
    position: '.stui-page'
  },
  {
    match: '8tutv.com/search',
    position: '.ys'
  },
  {
    match: '2n65.cn/index.php/vod/search.html',
    position: '.page_tips'
  }
];

(function() {
    if (!!window.fy_bridge_app) {
  // load dependencies
  eval(request('https://cdn.bootcss.com/zepto/1.2.0/zepto.min.js'));

  var $ = window.Zepto || window.jQuery || window.$;

  if (/m\.douban\.com\/movie\/subject\//.test(location.href)) {
    $(function() {
      function rgbToHex(rgb) {
        var color = rgb.toString().match(/\d+/g);
        if (color.length != 3) return rgb;

        var hex = '#';

        for (var i = 0; i < 3; i++) {
          hex += ('0' + Number(color[i]).toString(16)).slice(-2);
        }
        return hex;
      }

      function syncAppColor() {
        var style = $('#subject-header-container').attr('style');

        if (!style) {
          setTimeout(function() {
            syncAppColor();
          }, 100);
        } else {
          var mainColor = style.match(/:\s*([^;]+);?/)[1];
          try {
            window.fy_bridge_app.setAppBarColor(rgbToHex(mainColor));
          } catch (error) {
            console.error('setAppBarColor:', error);
          }
        }
      }

      syncAppColor();
    });
  }
}
  var isGM = !!window.GM;

  if (isGM && location.href.includes('doubleclick.net')) return;

  // 保证插件只加载一次
  var PLUGIN_ID = '(o˘◡˘o) oo.movie';
  if (window[PLUGIN_ID]) return;
  window[PLUGIN_ID] = VERSION;

  var DEBUG = true;

  function log() {
    if (!DEBUG) return;

    var args = [];
    args.push(PLUGIN_ID + '    ');
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    console.log.apply(console, args);
  }

  log('✔ Loaded', isMobile ? 'isMobile' : 'notMobile');

  var OO_SIGN = decodeURIComponent('(o%CB%98%E2%97%A1%CB%98o)');
  var href = location.href;

  function Is(regex) {
    return regex.test(href);
  }

  if (
    !Is(/=http/) &&
    Is(/\.le\.com/) &&
    !Is(/\.le\.com\/(ptv\/vplay\/|vplay_)/)
  )
    return;

  var $ = window.Zepto || window.jQuery || window.$;

  /**
   * Utils
   */
  function addStyle(styles, prefix) {
    if (prefix) {
      styles = prefixCssSelectors(styles, prefix);
    }
    var css = document.createElement('style');
    css.type = 'text/css';
    if (css.styleSheet) css.styleSheet.cssText = styles;
    // Support for IE
    else css.appendChild(document.createTextNode(styles)); // Support for the rest
    document.getElementsByTagName('head')[0].appendChild(css);
  }

  function prefixCssSelectors(rules, className) {
    var classLen = className.length,
      char,
      nextChar,
      isAt,
      isIn;

    // makes sure the className will not concatenate the selector
    className += ' ';

    // removes comments
    rules = rules.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '');

    // makes sure nextChar will not target a space
    rules = rules.replace(/}(\s*)@/g, '}@');
    rules = rules.replace(/}(\s*)}/g, '}}');

    for (var i = 0; i < rules.length - 2; i++) {
      char = rules[i];
      nextChar = rules[i + 1];

      if (char === '@') isAt = true;
      if (!isAt && char === '{') isIn = true;
      if (isIn && char === '}') isIn = false;

      if (
        !isIn &&
        nextChar !== '@' &&
        nextChar !== '}' &&
        (char === '}' ||
          char === ',' ||
          ((char === '{' || char === ';') && isAt))
      ) {
        rules = rules.slice(0, i + 1) + className + rules.slice(i + 1);
        i += classLen;
        isAt = false;
      }
    }

    // prefix the first select if it is not `@media` and if it is not yet prefixed
    if (rules.indexOf(className) !== 0 && rules.indexOf('@') !== 0)
      rules = className + rules;

    return rules;
  }

  function parseOUrl(link, title) {
    var oLink = link.trim().split(/[\s@]+/);
    var mUrl, pcUrl;

    var urls = oLink.filter(v => /https?:\/\//.test(v));
    oLink = oLink.filter(v => !/https?:\/\//.test(v));

    urls.forEach(url => {
      if (/\/\/m\.|\/m\//.test(url)) {
        mUrl = url;
      } else {
        pcUrl = url;
      }
    });

    var url = (isMobile ? mUrl : pcUrl) || urls[0];

    if (title) {
      url = url.replace('**', title);
    }

    var name =
      oLink.length > 0
        ? oLink.join(' ')
        : url
            .match(/\/\/(.+\.)?([^\/]+)\.\w+\//)[2]
            .replace(/^(\w)/, function(v) {
              return v.toUpperCase();
            });

    return { url, name };
  }

  function insertVipSource(selector, position = 'after') {
    if ($('.oo-vip-panel').length > 0) return;

    addStyle(
      `
.oo-vip {
  padding-bottom: .5em;
}

.oo-vip-panel {
  display: flex;
  justify-content: space-between;
  padding: 10px 10px 0;
  font-size: 15px;
}

.oo-vip-title {
  padding: .5em;
  font-weight: bold;
  color: #257942;
}

.oo-vip-sign {
  padding: .5em;
  opacity: .25;
}

.oo-vip-list {
  padding: .5em;
  letter-spacing: 1px;
}

.oo-vip-list .oo-vip-item {
  align-items: center;
  border-radius: 4px;
  display: inline-flex;
  padding: .5em .75em .5em .75em;
  justify-content: center;
  white-space: nowrap;
  background-color: #eef6fc;
  color: #1d72aa;
  margin: 4px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.25;
  font-weight: 600;
  text-decoration: none;
}
`
    );

    $(selector).eq(0)[position](`
<div class="oo-vip">
  <div class="oo-vip-panel">
    <div class="oo-vip-title">VIP 解析</div>
    <div class="oo-vip-sign">${OO_SIGN}</div>
  </div>
  <div class="oo-vip-list">
${VIP_URLS.map(function(link) {
  var oUrl = parseOUrl(link);
  return (
    '<a class="oo-vip-item" target="_blank" href="' +
    (oUrl.url + location.href) +
    '">' +
    oUrl.name +
    '</a>'
  );
}).join('\n')}
  </div>
</div>
</div>
`);
  }

  function getSearchSourcesHtml(keyword) {
    return SEARCH_SOURCES.map(function(S) {
      return (
        '<a target="_blank" href="' +
        S.url.replace('**', keyword) +
        '">' +
        S.name +
        '</a>'
      );
    }).join('\n');
  }

  function insertSearchAddons(keyword, position, positionBy = 'after') {
    if ($('.oo-sources').length === 0) {
      addStyle(`
.oo-sources {
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px;
}

.oo-sources a {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 12px;
  padding: 3px 10px;
  margin-top: 8px;
  margin-right: 6px;
  white-space: nowrap;
  background-color: #effaf3;
  color: #257942;
  cursor: pointer;
  border: 1px solid #f1f3f5;
}

.oo-sources a:hover {
  border: 1px solid #099268;
  color: #2b8a3e;
}
`);
    }

    $(position).eq(0)[positionBy](`<div class="oo-sources">
${getSearchSourcesHtml(keyword)}
</div>`);
  }

  function ensureArray(arr) {
    return Array.isArray(arr) ? arr : arr.trim().split(/[\n\s]*\n+[\n\s]*/);
  }

  if (window.VIP_URLS) {
    VIP_URLS = window.VIP_URLS;
  }

  if (window.SEARCH_SOURCES) {
    SEARCH_SOURCES = window.SEARCH_SOURCES;
  }

  VIP_URLS = ensureArray(VIP_URLS).map(function(v) {
    return v.replace(/=http.+/g, '=');
  });

  SEARCH_SOURCES = ensureArray(SEARCH_VIP_SOURCES)
    .concat(ensureArray(SEARCH_SOURCES))
    .map(v => {
      var oUrl = parseOUrl(v);
      return {
        url: oUrl.url,
        name: oUrl.name
      };
    });

  if (Is(/(url|jx|zwx)=http/)) {
    // VIP 视频解析
    if (Is(/chinese-elements\.com/)) {
      log('VIP解析 chinese-elements.com');

      addStyle(`
.google-auto-placed {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}
      `);
    }
  } else if (
    Is(/m\.douban\.com\/search\/\?.*type=movie|search\.douban\.com\/movie\//)
  ) {
    log('豆瓣·电影·搜索');

    // TODO 搜索结果唯一时，自动跳转

    if (!Is(/m\.douban\.com\//)) {
      /**
       * PC端
       */
      addStyle(`
#dale_movie_subject_search_bottom,
#dale_movie_subject_search_top_right,
#dale_movie_subject_top_right,
#dale_movie_subject_bottom_super_banner,
#dale_movie_subject_middle_right {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

.oo-sources {
  padding-left: 1em;
}

.oo-sources a {
  display: inline-flex !important;
  align-items: center;
  border-radius: 4px;
  font-size: .75rem;
  height: 2em;
  justify-content: center;
  line-height: 1.5;
  padding-left: .75em;
  padding-right: .75em;
  white-space: nowrap;
  background-color: #effaf3;
  color: #257942;
  margin-top: .5em;
  margin-right: .5em;
}
`);

      $('#icp').html(OO_SIGN);
      $('.gemzcp').each(function(i, el) {
        var title = $('.title', el).text();

        $(el).append(`<p class="oo-sources">
${getSearchSourcesHtml(title)}
</p>`);
      });

      return;
    }

    addStyle(`
#TalionNav,
.search-results-modules-name {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

.search-module {
  margin-top: 0;
}

.search-results img {
  width: 80px;
}

.search-results {
  padding-bottom: 10px;
}

.search-results li a {
  display: flex;
  align-items: center;
}

.search-results img {
  height: 100%;
  padding: 0;
  border: 2px solid;
  border-image: linear-gradient(to bottom, #2b68c4 0%,#cf2d6e 100%)1;
}
`);

    $('#more-search').append('    ' + OO_SIGN);

    $('.subject-info').each(function(i, el) {
      var title = $('.subject-title', el).text();

      insertSearchAddons(title, el, 'append');
    });

    $('.search-hd input').on('keyup', function(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        location.href = '/search/?query=' + e.target.value + '&type=movie';
      }
    });

    $('.search-hd .button-search').attr('id', OO_SIGN);
    $('.search-hd .button-search').on('click', function(e) {
      e.preventDefault();
      var value = $('.search-hd input').val();
      location.href = '/search/?query=' + value + '&type=movie';
    });
  } else if (
    Is(/m\.douban\.com\/movie\/subject\/|movie\.douban\.com\/subject\//)
  ) {
    log('豆瓣·电影·详情');

    // PC端
    if (!Is(/m\.douban\.com\//)) {
      addStyle(`
#dale_movie_subject_search_bottom,
#dale_movie_subject_search_top_right,
#dale_movie_subject_top_right,
#dale_movie_subject_bottom_super_banner,
#dale_movie_subject_middle_right {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}
`);

      $('#icp').html(OO_SIGN);

      var title = $('title')
        .text()
        .replace('(豆瓣)', '')
        .trim();

      $('#info').append(
        `
<span class="pl">在线观看：</span>
<span>
${SEARCH_SOURCES.map(function(S) {
  return (
    '<span><a target="_blank" href="' +
    S.url.replace('**', title) +
    '">' +
    S.name +
    '</a>'
  );
}).join(' / </span>')}
</span></span><br>
`
      );

      return;
    }

    addStyle(`
.score-write,
a[href*='to_app']:not(.sub-honor):not(.sub-cover),
a[href*='doubanapp'],
section + .center,
.bottom_ad_download,
.sub-vendor,
.to_pc,
.TalionNav-static,
.sub-detail .mark-movie,
.sub-detail .mark-tv,
.subject-banner,
.bottom_ad_download,
.cover-count {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

.sub-info .sub-cover {
  display: block !important;
}

.TalionNav-primary {
  position: relative !important;
}

.subject-comments,
.subject-reviews {
  margin-bottom: 0 !important;
}

.TalionNav .TalionNav-primary .search-box {
  width: 230px;
  flex: 230px 0 0;
  animation: none;
}

.sub-original-title {
  padding: 0.25em 0;
}

._V_sign {
  font-size: 0.85em;
  opacity: 0.25;
  text-align: center;
  padding-bottom: 1em;
}

._V_source, .sub-score + .sub-score {
  margin-top: 1.5em;
  color: #fff;
}

._V_source .sub-score .sub-content {
  display: block;
}

._V_source .sub-score a {
  padding: .25em .5em;
  line-height: 1.5;
  margin: 0 .15em;
  border: 1px solid rgba(255,255,255,0.2);
  font-size: 1.05em;
  font-weight: bold;
  letter-spacing: 1px;
  margin-top: .5em;
  display: inline-block;
  color: #ffe8cc;
  background: rgba(239, 238, 238, 0.05);
  border-radius: 4px;
}

#TalionNav {
  display: none;
}

#TalionNav .logo {
  background: none;
  font-size: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #dee2e6;
}

.search-box:not(.on-search) {
  opacity: 0.7;
}

#channel_tags {
  margin-bottom: 10px;
}

.subject-header-wrap .sub-detail {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

#channel_tags {
  margin-top: 10px;
}

input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance:none;
}
`);

    $(function() {
      var title = $('.sub-title')
        .text()
        .trim();

      $('.movie-reviews .show-all').after(
        `<div class="_V_sign"><a href="https://gitee.com/ecruos/oo">豆瓣·净化 ${OO_SIGN}</a></div>`
      );

      $('section + .center').each(function(i, el) {
        $(el).remove();
      });

      $('.subject-header-wrap').after($('#TalionNav'));

      $('#TalionNav').css('display', 'block');

      $('#TalionNav .logo')
        .html(decodeURIComponent('(o%CB%98%E2%97%A1%CB%98o)'))
        .attr('href', 'https://movie.douban.com/tag/#/');

      $('.search-box').remove();
      $('.TalionNav-primary .logo').after(
        '<div class="search-box"><input class="search-input" type="search" placeholder="搜索"></div>'
      );

      $('.search-input')
        .on('focus', function() {
          $(this)
            .parent()
            .addClass('on-search');
        })
        .on('blur', function() {
          $(this)
            .parent()
            .removeClass('on-search');
        });

      $('.search-input').on('keyup', function(e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          location.href = '/search/?query=' + e.target.value + '&type=movie';
        }
      });

      $('.subject-header-wrap').append(
        `<div class="_V_source subject-mark">

<div class="sub-score">
  <div class="sub-trademark">
  在线观看
  </div>
  <div class="sub-content">
${getSearchSourcesHtml(title)}
  </div>
</div>

</div>`
      );

      setTimeout(function() {
        $('.subject-intro .bd p').click();

        $('.sub-cover').attr('href', '#');
        $('#subject-honor-root a').attr('href', '#');
      }, 1000);

      function syncCoverColor() {
        var style = $('#subject-header-container').attr('style');

        if (!style) {
          setTimeout(function() {
            syncCoverColor();
          }, 100);
        } else {
          var mainColor = style.match(/:\s*([^;]+);?/)[1];
          var lightColor = mainColor.replace(')', ', 0)');
          try {
            addStyle(`
.sub-cover::before {
  background: -webkit-linear-gradient(bottom, ${mainColor} 0%, ${lightColor} 15%), -webkit-linear-gradient(right, ${mainColor} 0%, ${lightColor} 15%),-webkit-linear-gradient(top, ${mainColor} 0%, ${lightColor} 15%), -webkit-linear-gradient(left, ${mainColor} 0%, ${lightColor} 15%);
  content: "";
  bottom: 0;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  width: 102px;
  height: 142px;
  border-radius: 4px;
}
`);
          } catch (error) {
            console.error('syncCoverColor:', error);
          }
        }
      }

      syncCoverColor();
    });
  } else if (Is(/m\.v\.qq\.com\/search\.html/)) {
    log('腾讯·搜索');

    addStyle(`
.tvp_app_bar {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}
`);
    $('.copyright').html(OO_SIGN);
  } else if (Is(/v\.qq\.com\/(cover|play|x\/cover|x\/page|x\/play)/)) {
    log('腾讯·详情');

    addStyle(`
.mod_source,
.video_function,
.mod_promotion,
#vip_privilege,
#vip_activity,
.U_bg_b,
.btn_open_v,
.btn_openapp,
#vip_header,
.btn_user_hd {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

#vip_title {
  padding-bottom: 0;
}

.mod_episodes_numbers.is-vip .item {
  width: auto;
  padding: 0 1em;
}

.U_html_bg .container {
  padding-bottom: 30px;
}
`);
    $(function() {
      insertVipSource('#vip_title, .U_box_bg_a, .player_headline');
    });
  } else if (Is(/m\.iqiyi\.com\/search\.html/)) {
    log('爱奇艺·搜索');

    addStyle(`
.btn-ticket,
.btn-yuyue,
.btn-download,
.m-iqyDown {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}
`);
    $('.m-footer').html(OO_SIGN);
  } else if (Is(/\.iqiyi\.com\/(a_|v_|w_|adv)/)) {
    log('爱奇艺·详情');

    addStyle(`
.m-iqyDown,
.header-login + div,
.m-video-action,
div[name="m-vipRights"],
div[name="m-extendBar"],
.m-iqylink-diversion,
.m-iqylink-guide,
.c-openVip,
.c-score-btn,
.m-videoUser-spacing,
.m-pp-entrance {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

.page_play {
  padding-bottom: 0;
}

div[name="m-videoInfo"] {
  padding-top: 1em;
}

.m-box-items .oo-album-item {
  border-radius: .05rem;
  background-color: #e9ecef;
  color: #495057;
  padding: .5em 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: .25em;
  font-weight: bold;
}
`);
    $(function() {
      $('.m-footer').html(OO_SIGN);

      insertVipSource('div[name="m-videoInfo"], #block-C');
    });
  } else if (Is(/m\.youku\.com\/a|m\.youku\.com\/v|v\.youku\.com\/v_/)) {
    log('优酷·详情');

    addStyle(`
.h5-detail-guide,
.h5-detail-ad,
.brief-btm,
.smartBannerBtn,
.cmt-user-action {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

#bpmodule-playpage-lefttitle {
  height: auto !important;
}
`);
    $(function() {
      $('.copyright').html(OO_SIGN);

      insertVipSource('.h5-detail-info, .player-title');
    });
  } else if (Is(/\.mgtv\.com\/b\//)) {
    log('芒果TV·详情');

    addStyle(`
.ad-banner,
.video-area-bar,
.video-error .btn,
.m-vip-list,
.m-vip-list + div:not([class]),
.toapp,
.video-comment .ft,
.mg-app-swip {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}
`);
    $(function() {
      $('.mg-footer-copyright').html(OO_SIGN);

      insertVipSource('.xuanji', 'before');
      insertVipSource('.v-panel-box');
    });
  } else if (Is(/m\.tv\.sohu\.com\/phone_play_film/)) {
    return (location.href = href.replace(
      'phone_play_film',
      `v${href.match(/vid=(\d+)/)[1]}.shtml`
    ));
  } else if (Is(/film\.sohu\.com\/album\/|tv\.sohu\.com\/v/)) {
    log('搜狐视频·详情');

    addStyle(`
.actv-banner,
.btn-xz-app,
.twinfo_iconwrap,
.btn-comment-app,
#ad_banner,
.advertise,
.main-ad-view-box,
.foot.sohu-swiper,
.app-star-vbox,
.app-guess-vbox,
.main-rec-view-box,
.app-qianfan-box,
.comment-empty-bg,
.copyinfo,
.ph-vbox {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

.comment-empty-txt {
  margin-bottom: 0;
}

.app-view-box + footer {
  padding: 0;
  opacity: 0.5;
}
`);
    $(function() {
      $('.links').html(OO_SIGN);

      insertVipSource('.title-wrap, .videoInfo');
    });
  } else if (Is(/\.le\.com\/(ptv\/vplay\/|vplay_)/)) {
    log('乐视·详情');

    addStyle(`
.full_gdt_bits,
.gamePromotion,
.gamePromotionTxt,
#j-leappMore,
.lbzDaoliu,
.up-letv,
.le_briefIntro .Banner_01,
.video_block > .col_6 > [id],
.arkBox {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}
`);
    $(function() {
      insertVipSource('.introduction_box, .briefIntro_left .info_list');
    });
  } else if (isMobile && Is(/movie\.douban\.com\/tag\/#/)) {
    log('豆瓣·选影视');

    var num = 3;

    addStyle(
      prefixCssSelectors(
        `
.category {
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
}

.tags {
  margin-bottom: 1em;
}

.checkbox__input {
  vertical-align: text-top;
}

.tag-nav {
  margin: 0 auto;
  font-size: 12px;
}

.tag-nav .tabs, .tag-nav .check {
  display: flex;
  justify-content: space-around;
}

.tag-nav .tabs a {
  padding: 7.5px 5px 5px;
}

.tabs a:not(.tab-checked) {
  border: 1px solid #dfdfdf;
}

.tabs .tab-checked {
  border: 1px solid #258dcd!important;
}

.tab-checked:after {
  display: none;
}

.checkbox, .range {
  margin-right: 5px;
}

.check {
  float: none;
  margin-top: 5px;
}

.list-wp, .item .cover-wp {
  overflow: unset;
}

a img {
  padding: 2px;
  border-radius: 5px;
  background: linear-gradient(to bottom, #2b68c4 0%,#cf2d6e 100%);
}

a.item {
  width: ${parseInt(100 / num)}%;
  text-align: center;
}

a.item p {
  padding-right: 0;
}

a.item .cover-wp {
  height: auto;
  padding: 0 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
}

a.item .cover-wp:after, .poster:after {
  display: none;
}

a.item .pic img {
  width: 100%;
  height: ${parseInt((screenWidth * 4) / 3 / num)}px;
  max-width: 150px;
  object-fit: cover;
}

.tag-nav .range-dropdown {
  left: 0 !important;
  width: auto !important;
  right: 0 !important;
  top: -4em !important;
}

.more {
  margin: 0 1em .5em;
}

`,
        '.oo'
      ) +
        `
#app .article, .article.oo {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px 6px;
  transition: all .8s;
}

.category::-webkit-scrollbar {
  width: 1px;
  height: 1px;
  background-color: rgba(223, 223, 223, 0.25);
}

.category::-webkit-scrollbar-track {
  background: transparent;
  border: 0px none #ffffff;
  border-radius: 50px;
}

.category::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 2.5px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 2.5px rgba(0, 0, 0, 0.1);
  border-radius: 2.5px;
  background-color: rgba(223, 223, 223, 0.25);
  opacity: 0.7;
  transition: opacity ease-in-out 200ms;
}

.category::-webkit-scrollbar-thumb:hover {
  opacity: 1;
  background-color: rgba(223, 223, 223, 0.25);
}

.oo-search {
  position: relative;
  display: flex;
  margin-bottom: 5px;
}

.oo-search .inp {
  height: 34px;
  text-align: center;
  cursor: text;
  width: 90%;
}

.oo-search .inp input {
  background: #fff;
  width: 96%;
  margin: 0;
  text-align: left;
  height: 30px;
  padding-left: 10px;
  outline: none;
}

.oo-search input {
  -webkit-appearance: none;
  border: none;
  background: transparent;
}

.oo-search .inp-btn {
  position: relative;
  width: 37px;
  height: 34px;
}

.oo-search .inp-btn input {
  width: 100%;
  height: 100%;
  font-size: 0;
  padding: 35px 0 0 0;
  overflow: hidden;
  color: transparent;
  cursor: pointer;
}

.oo-search .inp-btn input:focus {
  outline: none;
}

.oo-search .inp {
  background-image: url(//img3.doubanio.com/dae/accounts/resources/a4a38a5/movie/assets/nav_mv_bg.png?s=1);
}

.oo-search .inp-btn input {
  background: url(//img3.doubanio.com/dae/accounts/resources/a4a38a5/movie/assets/nav_mv_bg.png?s=1) no-repeat 0 -40px;
}
`
    );
    $(function() {
      $('title').append(' - oo');

      $('#app .article .tags').before(
        `<div class="oo-search">
  <div class="inp"><input name="${OO_SIGN}" size="22" maxlength="60" placeholder="搜索电影、电视剧、综艺、影人" value="" autocomplete="off"></div>
  <div class="inp-btn"><input type="submit" value="搜索"></div>
</div>`
      );

      $('body').html($('#app .article').addClass('oo'));

      $('.oo-search input').on('keyup', function(e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          location.href =
            'https://m.douban.com/search/?query=' +
            e.target.value +
            '&type=movie';
        }
      });

      $('.oo-search .inp-btn input').on('click', function(e) {
        e.preventDefault();
        var value = $('.oo-search input').val();
        location.href =
          'https://m.douban.com/search/?query=' + value + '&type=movie';
      });

      function bindScroll() {
        if (
          $(window).scrollTop() + $(window).height() >
          $(document).height() - 40
        ) {
          $(window).unbind('scroll');
          $('.more').click();
          // setTimeout(function() {
          //   $(window).scroll(bindScroll);
          // }, 1000);
        }
      }

      // Select the node that will be observed for mutations
      var targetNode = document.querySelector('.list-wp');

      // Options for the observer (which mutations to observe)
      var config = { attributes: true, childList: true };

      // Callback function to execute when mutations are observed
      var callback = function(mutationsList) {
        var isChildChanged = false;
        for (var mutation of mutationsList) {
          if (mutation.type == 'childList') {
            isChildChanged = true;
            // console.log('A child node has been added or removed.');
            // console.log(mutation);
            mutation.addedNodes.forEach(function(addedNode) {
              if (addedNode.classList.contains('item')) {
                addedNode.setAttribute(
                  'href',
                  addedNode
                    .getAttribute('href')
                    .replace('movie.douban.com', 'm.douban.com/movie')
                );
              }
            });
          }
          // else if (mutation.type == 'attributes') {
          //   console.log(
          //     'The ' + mutation.attributeName + ' attribute was modified.'
          //   );
          // }

          if (isChildChanged) {
            setTimeout(function() {
              $(window).scroll(bindScroll);
            }, 1500);
          }
        }
      };

      // Create an observer instance linked to the callback function
      var observer = new MutationObserver(callback);

      // Start observing the target node for configured mutations
      observer.observe(targetNode, config);

      // stop observing
      // observer.disconnect();
    });
  } else if (Is(/\.bilibili\.com/)) {
    log('bilibili');

    // PC
    if (Is(/www\.bilibili\.com\/(anime|bangumi\/play|video)\//)) {
      var task = setInterval(function() {
        if ($('.media-cover img').length > 0) {
          insertVipSource('#media_module', 'before');
          clearInterval(task);
        }
      }, 500);
      return;
    }

    addStyle(`
.index__openAppBtn__src-commonComponent-topArea-,
.index__container__src-commonComponent-bottomOpenApp-,
.bili-app,
.recom-wrapper,
.b-footer,
.open-app-bar,
.open-app-float,
.more-review-wrapper,
.player-mask .mask {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

.player-mask img {
  filter: none !important;
}
`);

    $(function() {
      insertVipSource('.ep-list-pre-wrapper', 'before');
    });
  } else if (Is(/localhost|ecruos\.gitee\.io\/one/)) {
    log('One·主页');

    $(function() {
      localStorage.setItem('One.plugin.version', VERSION);
    });
  } else if (Is(/\.nfmovies\.com/)) {
    log('奈菲');

    addStyle(`
img[src*='tu/ad'] {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}
`);
  }

  var searchAddon = SEARCH_ADDONS.find(v =>
    typeof v.match === 'string' ? href.includes(v.match) : v.match.test(href)
  );

  if (searchAddon) {
    log('searchAddon:', searchAddon.match);

    $(function() {
      var keyword =
        typeof searchAddon.keyword === 'string'
          ? $(searchAddon.keyword)
              .eq(0)
              .text()
          : typeof searchAddon.keyword === 'function'
          ? searchAddon.keyword($)
          : getKeywordFromUrl(searchAddon.keyword);

      insertSearchAddons(
        keyword,
        searchAddon.position,
        searchAddon.positionBy || 'after'
      );
    });
  }
})();