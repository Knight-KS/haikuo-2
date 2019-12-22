//==========via-plugin:6==========
//==========百度文库直接下载==========
(function() {
/*
 * @name: 百度文库直接下载
 * @Author: 谷花泰
 * @version: 1.0
 * @description: 调用第三方接口直接下载文库文档
 * @include: *
 * @createTime: 2019-10-04 01:47:08
 * @updateTime: 2019-10-11 00:15:58
 */
(function () {
  /* 判断是否该执行 */
  const whiteList = ['wenku.baidu.com', 'wk.baidu.com'];
  const hostname = window.location.hostname;
  const key = encodeURIComponent('谷花泰:百度文库直接下载:执行判断');
  const canLoad = whiteList.some(keyword => {
    if (hostname.match(keyword)) {
      return true;
    };
    return false;
  });

  if (!canLoad || window[key]) {
    return;
  };
  window[key] = true;

  /* 开始执行代码 */
  class DownloadDocuments {
    constructor() {
      this._animeTimerId;
      this._url = window.location.href;
      /* example: http://wenku.baidu.com/view/f1e1b912571252d380eb6294dd88d0d233d43cd1.html*/
      this.createView();
    };
    /*
     * 创建视图
     *
     */
    createView() {
      /* 创建 loading */
      this.createLoadingMask();

      const parentNode = document.querySelector('.top-doc-info-root.wk-container');
      const appBtn = parentNode.querySelector('.btn-view-in-app');
      /* 移除app查看按钮 */
      appBtn && parentNode.removeChild(appBtn);
      /* 下载按钮 */
      const downBtns = [
        {
          text: 'via插件：下载doc',
          id: 'viaDownDOCBtn',
          type: 'doc'
        },
        {
          text: 'via插件：下载pdf',
          id: 'viaDownPDFBtn',
          type: 'pdf'
        },
        {
          text: 'via插件：下载ppt',
          id: 'viaDownPPTBtn',
          type: 'ppt'
        }
      ];

      downBtns.forEach(downBtn => {
        const { text, id } = downBtn;
        const downDiv = this.createDownloadBtn({ text, id });
        parentNode.appendChild(downDiv);
      });

      /* 循环绑定下载事件 */
      let pastTime = 0;
      let maxTime = 5000;
      let interval = 100;
      let timerId = null;
      timerId = setInterval(() => {
        if (pastTime >= maxTime) {
          clearInterval(timerId);
          return;
        };
        pastTime += interval;
        downBtns.forEach(downBtn => {
          const btn = document.querySelector(`#${downBtn.id}`);
          this.bindDownloadEvent(btn, downBtn.type);
        })
      }, interval);
    };
    /* 创建下载按钮 */
    createDownloadBtn({ text, id }) {
      const div = document.createElement('div');
      div.setAttribute('style', `
        font-size: 13px;
        line-height: 30px;
        border-radius: 5px;
        display: inline-block;
        padding: 0 8px;
        position: relative;
        border: 0;
        background: #1CB584;
        color: #fff;
        width: 40%;
        margin-right: 15px;
        margin-top: 8px;
        text-align: center;
      `);
      div.innerText = text;
      div.setAttribute('id', id);

      return div;
    };
    /* 为下载按钮绑定下载事件 */
    bindDownloadEvent(elm, type) {
      const that = this;
      function down() {
        const _type = type || 'doc';
        that.setLoadingState(true);
        that.getDownloadUrl(that._url, _type).then(url => {
          that.setLoadingState(false);
          window.open(url, '_self');
        }).catch(err => {
          that.setLoadingState(false);
          window.open(`http://wenku.baiduvvv.com/d/?url=${encodeURIComponent(that._url)}`, '_blank');
        })
      };
      elm.onclick = down;
    };
    /*  
     * 创建 loading 函数 
     * 
     */
    createLoadingMask() {
      const div = document.createElement('div');
      const loadingIconUrl = this.loadingIconUrl();
      div.innerHTML = `
        <div 
          id="__loading_mask"
          style="position: fixed; top: 0; left: 0; z-index: 999999999; width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.5);">
          <div
            id="__loading_icon" 
            style="width: 48px; height: 48px; background-image: url(${loadingIconUrl}); background-size: 100% auto; background-repeat: no-repeat;"></div>
          <div id="__loading_tips" style="color: #fff; font-size: 16px; margin-top: 16px">解析中</div>
        </div>
      `;
      div.style.display = 'none';
      div.setAttribute('id', '__loading');
      document.body.appendChild(div);
    };
    /* 获取 loading 图标 base64 */
    loadingIconUrl() {
      return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD+UlEQVRoQ+WZS6gdRRCGv38jQkBUJCIqJCJkoQgJoqCBmIUaXYgPEnwE42PlCyUoIi6Mu8SIEcFsxEdADRhFMaCGCAmCiAtBF1HBhUJAF0oWghsRfqlLn0PfOTNzp2fuwLlJbQ5npqq6/qrqqu4ascJJK9x+RgVg+5ZwkKTPx3LUaABsvwDsSobvkvTiGCDGBHAMuCEZfVzS5rkBYHsPcA1wl6RTdYbZ7gTA9qXAa8C5bfqawBdHoJIaRyXdNBBA7I8tfVNtKIBY9zFJ+6sgukTA9v3AgUy2eK8UA4jFbH8AbE0L/wpcL+mPHMRSAGyfBXwDbEhyPyQ9/5Tslb4A1gE/Zwvtk7SzEMDTwN5MZruk90qMXyjRpQITftu7gWcz+U2SvsreN25i25ck78dv0IeSJhEtMmkIgAuBn4Dz0oqHJd3WEUB4PiIQ9B+wUdK3RZYn5kYAtp8CTkg62qTYdjUNHpb0VtontY3MduR85H7sgaDdkp5rWeNG4ApJr9bx1AKobMCPgf2SvqwqsH02EJ67Kr1bVEVsL6SFpENZZB4FXk//Yx9FAZjpJbavBZ4E7km8tc2wCUAYfXvF4PcTkK/z5+m8E43o8pQKi97XgA6+X9LzbTm4FLm1yfAwPqdPJN1R1dcEILrjm0CEr0rx/BVJP/bJ2WTkBcA6SVOwtldlhq+u6I40jvQ82QlAFu5H0ma7rCIYe+PKvgBqohKn1peAqs7oMS/XNcqJjiWrkO2LEoi8zn8vaf0yAoiUitTKaV/0iWqDLIpAJdc3As8AUSpncncIGNvO5A8nr097SpvuJSMwxLCusqnixIHu5KQMd5WdCwBdja3jO70ApLP+5BaVA46SeUTSp0O81SZr+3zg7uyU28QeDW16PZ1GIHXNOCY30XeSrh4RwH3Aux31T4tIDiBq8WctCg5J2tZxgWI22zcDX3QUvHUy6Vi0B1pSKM4qceQ92HGBYjbb5wDPp7t2m3x9ChWvOCcCp1cVmhOnFplxZkTAdpx/1o81HixyeYW5NQK24zb0OHBdkpuZPgxZfDlkmy40FwNvAAvT5YxGm3H2BdME4CPgzorSI8C9TbPQvgYMletyqT8BROrEVXLuqAlAHKyeyPL+77mzPBl0ZpTROu/bfgD4F4j7ce8JxdDI9oqA7YfS2CXWX9YJRSmgvgDywe3gCYXthUuUpOOjA6g5txd/lMiNHPoxsDgCtmO0EkOooN8lRdObIdtrgB3pxQFJvzXwxdB2MkYsdkYxgDAiDX//bLuh2X4biI0e9I6kBxsAhANithqle6ukv0rSqBeALgss9Ympi44uPGMCWNkfulOqzXwf6OLVEp7RIlBixBDeFQ/gfy0tikB6h7jsAAAAAElFTkSuQmCC`;
    };
    /* 更改 loading 状态 */
    setLoadingState(isShow) {
      const loading = document.querySelector('#__loading');
      clearInterval(this._animeTimerId);
      if (!isShow) {
        loading.style.display = 'none';
        return;
      }
      loading.style.display = 'block';
      /* 加载动画 */
      const loadingIcon = document.querySelector('#__loading_icon');
      let deg = 0;
      this._animeTimerId = setInterval(() => {
        if (deg >= 360) {
          deg = 0;
        };
        loadingIcon.style.transform = `rotateZ(${deg}deg)`;
        deg += 20;
      }, 80);
    };
    /* 
     * type值为doc、pdf、ppt
     *
     */
    getDownloadUrl(url, type) {
      return new Promise((resolve, reject) => {
        const that = this;
        const uid = this.getUid();
        let timestamp, sign, f, h, s, uuid = 'undefined', id = 'undefined', _;
        /* 获取 timestamp, sign */
        this.getSignAndTimestamp(url).then(res => {
          sign = res.sign;
          timestamp = res.timestamp;
          /* 获取 f, h, s */
          that.getOtherInfo({ url, type, timestamp, sign }).then(res => {
            f = res.f;
            h = res.h;
            s = res.s;
            /* 获取 uuid, id */
            that.getUuidAndId({ url, type, timestamp, sign, uid, f, h, s }).then(res => {
              uuid = res.uuid || 'undefined';
              id = res.id || 'undefined';
              _ = res._;
              /* 生成链接 */
              const downloadUrl = that.generateDownloadUrl({ url, type, timestamp, sign, uid, f, h, s, uuid, id });
              if (res.code === 2) {
                /* 可以下载了 */
                resolve(downloadUrl);
              } else {
                /* 获取生成进度 */
                that.awaitComplete({ url, type, timestamp, sign, uid, f, h, s, id, uuid, _ }).then(() => {
                  resolve(downloadUrl);
                });
              };
            });
          });
        }).catch(err => reject(err));
      });
    };
    /* 获取sign、timestamp */
    getSignAndTimestamp(url) {
      return new Promise((resolve, reject) => {
        this.ajax({
          url: `http://wenku.baiduvvv.com/d/`,
          proxy: `https://jsonp.afeld.me/?url=`,
          data: {
            url
          },
          method: 'get',
          success(res) {
            const sign = res.match(/name=\"sign\".+?value=\"([a-zA-Z0-9]+)?\"/)[1] || null;
            const timestamp = res.match(/name=\"t\".+?value=\"([a-zA-Z0-9]+)?\"/)[1] || null;
            resolve({
              sign,
              timestamp
            });
          },
          error(err) {
            reject(err)
          }
        })
      })
    };
    /* 获取uid */
    getUid() {
      let pwd = '';
      let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      const len = 32;
      const maxPos = chars.length;

      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }

      return pwd;
    };
    /* 获取其他参数(f, h, s) */
    getOtherInfo({ url, type, timestamp, sign }) {
      return new Promise((resolve, reject) => {
        this.ajax({
          url: `http://wenku.baiduvvv.com/ds.php`,
          proxy: `https://jsonp.afeld.me/?url=`,
          method: 'get',
          data: {
            url,
            type,
            sign,
            t: timestamp
          },
          success(res) {
            const { code, f, h, s } = JSON.parse(res);
            resolve({
              f,
              h,
              s
            });
          },
          error(err) {
            reject(err);
          }
        });
      });
    };
    /* 
     * 获取 uuid 和 id
     * 返回的code为1则代表准备合成
     * 返回的code为2则代表已经有合成过了
     * 
     */
    getUuidAndId({ url, type, timestamp, sign, uid, f, h, s }) {
      return new Promise((resolve, reject) => {
        const btype = 'start';
        const callbackName = 'callback2';
        const _ = new Date().getTime();
        this.ajax({
          url: `${s}/wkc.php`,
          proxy: `https://cors-anywhere.herokuapp.com/`,
          encodeUrl: false,
          header: {
            'x-requested-with': ''
          },
          data: {
            url,
            type,
            t: timestamp,
            sign,
            c: uid,
            f,
            h,
            btype,
            callback: callbackName,
            _
          },
          success(res) {
            res = JSON.parse(res.match(/callback2\((.+)\)/)[1]);
            const { code, did, id, msg, uuid } = res;
            resolve({
              code,
              did,
              id,
              msg,
              uuid,
              _
            });
          },
          error() {
            reject();
          }
        });
      });
    };
    /* 
     * 获取进度 
     * code为3时进度为开始
     * code为2时进度为结束
     * code为-1时内部错误
     * 
     */
    getProgress({ url, type, timestamp, sign, uid, f, h, s, id, uuid, _ }) {
      return new Promise((resolve, reject) => {
        const btype = 'getProgress';
        const callbackName = 'callback2';
        _ += 1;
        this.ajax({
          url: `${s}/wkc.php`,
          proxy: `https://cors-anywhere.herokuapp.com/`,
          encodeUrl: false,
          header: {
            'x-requested-with': ''
          },
          data: {
            url,
            type,
            t: timestamp,
            sign,
            c: uid,
            f,
            h,
            btype,
            id,
            uuid,
            callback: callbackName,
            _
          },
          success(res) {
            res = JSON.parse(res.match(/callback2\((.+)\)/)[1]);
            const { code, isRuning, msg, p } = res;
            if (code === -1) {
              reject();
              return;
            };
            document.querySelector('#__loading_tips').innerText = `合成中--${p}%`;
            resolve({
              code,
              isRuning,
              msg,
              p,
              _
            });
          },
          error() {
            reject();
          }
        });
      });
    };
    /* 
     * 等到进度为完成时才回调 
     * 
     */
    awaitComplete({ url, type, timestamp, sign, uid, f, h, s, id, uuid, _ }) {
      let that = this;
      return new Promise((resolve, reject) => {
        that.getProgress({ url, type, timestamp, sign, uid, f, h, s, id, uuid, _ }).then(res => {
          if (res.code === 2) {
            resolve();
          } else if (res.code === -1) {
            reject();
          } else {
            that.awaitComplete({ url, type, timestamp, sign, uid, f, h, s, id, uuid, _ }).then(() => resolve());
          }
        })
      })
    };
    /* 
     * code为2时获取下载链接
     * 生成下载链接 
     * 
     */
    generateDownloadUrl({ url, type, timestamp, sign, uid, f, h, s, id = 'undefined', uuid = 'undefined' }) {
      const btype = 'down';
      return `${s}/wkc.php?url=${encodeURIComponent(url)}&type=${type}&t=${timestamp}&sign=${sign}&c=${uid}&f=${f}&h=${h}&btype=${btype}&id=${id}&uuid=${uuid}`;
    };
    /* 封装请求库 */
    ajax({ url, method = 'get', header = {}, data = {}, success = () => { }, error = () => { }, proxy, encodeUrl = true }) {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      let urlForGet = url;
      method = method.toLowerCase();

      /* 数据 */
      Object.keys(data).forEach((key, index) => {
        const connectSymbol = index === 0 ? '?' : '&';
        urlForGet += `${connectSymbol + key}=${encodeURIComponent(data[key])}`;
        formData.append(key, data[key]);
      });

      /* 请求地址 */
      method === 'get' ? (url = urlForGet) : '';

      if (proxy && encodeUrl) {
        url = proxy + encodeURIComponent(url);
      } else if (proxy && !encodeUrl) {
        url = proxy + url;
      };

      xhr.open(method, url, true);

      /* 请求头 */
      Object.keys(header).forEach(key => {
        xhr.setRequestHeader(key, header[key]);
      });

      /* 监听回调 */
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            success && success(xhr.responseText);
          } else {
            error && error(xhr.responseText);
          };
        };
      };

      /* 发送 */
      method === 'get' ? xhr.send() : xhr.send(formData);
    };
  };
  new DownloadDocuments();
})();
})();
//==========via-plugin:6==========
//==========via-plugin:14==========
//==========纯净苍穹==========
(function() {
/*
 * @name: 纯净苍穹
 * @Author: 谷花泰
 * @version: 1.0
 * @description: 对常用网站去掉app下载提示
 * @include: *
 * @createTime: 2019-10-13 08:46:24
 * @updateTime: 2019-10-13 14:29:01
 */
(function () {
  /* 执行判断 */
  const key = encodeURIComponent('谷花泰:纯净苍穹:执行判断');
  if (window[key]) {
    return;
  };
  window[key] = true;

  class FuckAD {
    constructor(configs) {
      this._configs = configs;

      /*
       * config里的配置解释
       * {
       *   正则匹配的域名数组
       *   sites: ['zhihu.com'],
       * 
       *   移除的节点数组
       *   remove: ['#id'],
       * 
       *   display隐藏的节点数组
       *   displayNone: ['#id'],
       * 
       *   visibility隐藏的节点数组
       *   visibilityHidden: ['#id'],
       * 
       *   额外的css
       *   style: `
       *   body {
       *     background-color: #000;
       *   }
       *   `,
       *  
       *   额外的函数执行
       *   others() {
       *     console.log('others: 哈哈');
       *   }
       * }
       *
       */

      /* 初始化 */
      this.init();
    };
    /*
     * 初始化
     */
    init() {
      const that = this;
      /* 所有要移除的节点 */
      let remove = [];
      /* 总体style */
      let style = '';
      /* 要执行的其它函数集 */
      let others = [];

      /* 统计 */
      this._configs.forEach(config => {
        const canLoad = that.siteInList(config.sites);
        if (canLoad) {
          remove = remove.concat(config.remove);
          style += (config.style || '');
          style += (that.letSelectorsDisplayNone(config.displayNone));
          style += (that.letSelectorsVisibilityHidden(config.visibilityHidden));
          config.others && (others = others.concat(config.others));
        };
      });

      /* 添加style */
      this.addStyle(style);
      that.removeNodesBySelectors(remove);

      /* 执行others内所有函数 */
      try {
        others.forEach(func => {
          func();
        });
      } catch (err) {
        console.error('via: others function run error', err);
      };

      /* 监听dom，确保节点移除 */
      if (remove && remove.length > 0) {
        this.observe({
          targetNode: document.documentElement,
          config: {
            attributes: false
          },
          callback(mutations, observer) {
            that.removeNodesBySelectors(remove);
          }
        })
      }
    };
    /*
     * 监听dom节点加载函数
     */
    observe({ targetNode, config = {}, callback = () => { } }) {
      if (!targetNode) {
        return;
      };

      config = Object.assign({
        attributes: true,
        childList: true,
        subtree: true
      }, config);

      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    };
    /*
     * 添加style 
     */
    addStyle(style = '') {
      const styleElm = document.createElement('style');
      styleElm.innerHTML = style;
      document.head.appendChild(styleElm);
    };
    /*
     * 选择节点，返回节点数组
     */
    selectNodes(selector) {
      if (!selector) {
        return [];
      };
      const nodes = document.querySelectorAll(selector);
      return nodes;
    };
    /*
     * 判断网站是否在名单内 
     */
    siteInList(sites) {
      const hostname = window.location.hostname;
      const result = sites.some(site => {
        if (hostname.match(site)) {
          return true;
        }
        return false;
      });
      return result;
    };
    /*
     * 移除多个节点
     */
    removeNodes(nodes = []) {
      Array.from(nodes, node => {
        node.parentNode.removeChild(node);
      });
    };
    /*
     * 根据selector数组移除多个节点
     */
    removeNodesBySelectors(selectors = []) {
      let nodeArr = [];
      selectors.forEach(selector => {
        const nodes = this.selectNodes(selector);
        if (nodes && nodes.length > 0) {
          nodeArr = nodeArr.concat(Array.from(nodes));
        };
      });
      this.removeNodes(nodeArr);
    };
    /*
     * 根据css选择器生成style
     */
    generateStyleBySelectors(selectors = [], customStyle = `{}`) {
      if (!selectors || selectors.length === 0) {
        return '';
      };
      let style = '';
      selectors.forEach(selector => {
        if (selector) {
          style += `
          
          ${selectors} ${customStyle}
  
          `;
        };
      });
      return style;
    };
    /*
     * 让数组里的选择器全部 display: none
     */
    letSelectorsDisplayNone(selectors = []) {
      return this.generateStyleBySelectors(selectors, `{
        display: none!important;
      }`);
    };
    /*
     * 让数组里的选择器全部 visibility: hidden
     */
    letSelectorsVisibilityHidden(selectors = []) {
      return this.generateStyleBySelectors(selectors, `{
        visibility: hidden!important;
      }`);
    };
  };

  new FuckAD([
    {
      sites: ['bilibili.com'],
      displayNone: [
        '.index__openAppBtn__src-commonComponent-topArea-',
        '.index__container__src-commonComponent-bottomOpenApp-',
        '.index__openApp__src-videoPage-related2Col-videoItem-',
        '.index__floatOpenBtn__src-videoPage-floatOpenBtn-',
        '.index__downLoadBtn__src-videoPage-commentArea-',
        '.bili-app-link-container',
        '.open-app-bar',
        '.btn-ctnr',
        '.bili-app',
        '#openAppBtn'
      ]
    },
    {
      sites: ['zhihu.com'],
      displayNone: [
        '.MobileAppHeader-downloadLink',
        '.ContentItem-more',
        '.TopstoryItem--advertCard',
        '.DownloadGuide',
        '.Profile-followButton',
        '.OpenInAppButton',
        '.OpenInApp',
        '.ViewAllInappButton',
        '.HotQuestions-bottomButton',
        '.MHotFeedAd',
        '.MBannerAd',
        '.HotQuestions'
      ],
      style: `
        .MobileAppHeader-actions {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
      `
    },
    {
      sites: ['www.baidu.com', 'm.baidu.com'],
      remove: [
        '#header > div:last-child',
        '.ec_wise_ad'
      ],
      displayNone: [
        '.blank-frame',
        '#bottom',
        '.suggest-hot',
        '.callicon-wrap',
        '#navs',
        '#page-copyright',
        '[data-module="xcxMulti"]',
      ],
      visibilityHidden: [
        '#userinfo-wrap'
      ],
      style: `
        body {
          background-color: #fff !important;
          height: 100vh !important;
        }
      `
    },
    {
      sites: ['music.163.com'],
      displayNone: [
        '.topfr',
        '.m-homeft',
        '.u-ft',
        '.cmt_more_applink'
      ],
      visibilityHidden: [
        '.m-moreLists'
      ],
      style: `
        .m-scroll_wrapper {
          bottom: 0 !important;
        }
      `
    },
    {
      sites: ['y.qq.com'],
      displayNone: [
        '#js_mod_dialog',
        '.top_box',
        '.bottom_bar',
        '.top_bar',
        '.top_operation_box',
        '.lyric_action',
        '.sing',
        '.btn_download',
        '.open_qqmusic__btn',
        '.similar_song',
        '.related_album',
        '.related_info',
        '.recommend_mv',
        '.mod_lead_flow'
      ]
    }
  ]);
})();
})();
//==========via-plugin:14==========
(function() {
    //以下VIP解析功能
    var apis=[

         {"name":"腾讯专用","url":"https://vip.66parse.club/?url="},
 {"name":"爱奇艺专用","url":"https://www.playm3u8.cn/jiexi.php?url="},
{"name":"h8x","url":"http://www.h8jx.com/jiexi.php?url="},
     {"name":"360解析","url":"http://jx.cx77m1.cn/?url="},   
    {"name":"初心解析","url":"http://jx.bwcxy.com/?v="},
    {"name":"1907","url":"https://z1.m1907.cn/?jx="},
     {"name":"云播放","url":"http://yun.mt2t.com/lines?url="}, 
    {"name":"360dy接口","url":"http://yun.360dy.wang/?url="},
    {"name":"科技解析","url":"http://ka61b.cn/jx.php?url="},
    {"name":"17K云","url":"http://17kyun.com/api.php?url="},
        {"name":"小蒋极致","url":"https://www.kpezp.cn/jlexi.php?url="},
       {
        "name": "牛牛吧解析",
        "url": "http://jx.yuanzhi668.cn/?url="
    },

    {
        "name": "无名解析",
        "url": "http://69p.top/?url="
    },
    {
        "name": "8B解析",
        "url": "http://api.8bjx.cn/?url="
    },
    {
        "name": "无广解析",
        "url": "https://api.5ifree.top/?url="
    },
    {
        "name": "Hk解析",
        "url": "http://jx.rdhk.net/?v="
    },
    {
        "name": "搜搜库",
        "url": "http://jx.sosoku.cn/jx/?url="
    },
    {
        "name": "爱酷看看",
        "url": "https://www.ikukk.com/?url="
    },
    {
        "name": "1616",
        "url": "https://www.1616jx.com/jx/api.php?url="
    },
    {
        "name": "爱解析",
        "url": "http://jx.wfxzzx.cn/?url="
    },
    {
        "name": "AT520",
        "url": "http://at520.cn/jx/?url="
    },
    {
        "name": "蓝科迪梦",
        "url": "http://api.lkdmkj.com/jx/jx00/index.php?url="
    },
    {
        "name": "全网vip",
        "url": "https://play.fo97.cn/?url="
    },

    {
        "name": "OK解析",
        "url": "http://okjx.cc/?url="
    },
    {
        "name": "瑞特解析",
        "url": "http://jx.0421v.pw/index.php?url="
    },
    {
        "name": "维多解析（超清）",
        "url": "https://jx.ivito.cn/?url="
    },
    {
        "name": "771解析",
        "url": "https://vip.qi71.cn/jiexi.php?url="
    },
    {
        "name": "黑云解析",
        "url": "http://jx.daheiyun.com/?url="
    },
    {
        "name": "云渡",
        "url": "http://yy.6tc.top/jx/?url="
    },
    {
        "name": "星空解析",
        "url": "https://jx.fo97.cn/?url="
    },
    {
        "name": "云梦解析",
        "url": "http://www.xuanbo.top/yjx/index.php?url="
    },
    {
        "name": "tv920解析",
        "url": "https://api.tv920.com/vip/?url="
    },
    {
        "name": "热点解析",
        "url": "http://jx.rdhk.net/?v="
    },
    {
        "name": "WoCao",
        "url": "https://www.wocao.xyz/index.php?url="
    },
    {
        "name": "流氓凡",
        "url": "https://jx.wslmf.com/?url="
    },
    {
        "name": "酷博",
        "url": "http://jx.x-99.cn/api.php?id="
    },
    {
        "name": "vip多线路",
        "url": "http://api.ledboke.com/vip/?url"
    },
    {
        "name": "玩得嗨",
        "url": "http://tv.wandhi.com/go.html?url="
    },
    {
        "name": "我爱解析",
        "url": "http://jx.52a.ink/?url="
    },
    {
        "name": "飞鸟云播",
        "url": "http://jx.ledboke.com/?url="
    },
    {
        "name": "弦易阁",
        "url": "http://jx.hongyishuzhai.com/index.php?url="
    },
    {
        "name": "大亨解析",
        "url": "http://jx.cesms.cn/?url="
    },
    {
        "name": "爸比解析",
        "url": "http://www.33tn.cn/?url="
    },
    {
        "name": "凉城解析",
        "url": "http://jx.mw0.cc/?url="
    },
    {
        "name": "618戈",
        "url": "http://jx.618ge.com/?url="
    },
    {
        "name": "517解析",
        "url": "http://cn.bjbanshan.cn/jx.php?url="
    },
    {
        "name": "超清干货",
        "url": "http://k8aa.com/jx/index.php?url="
    },
    {
        "name": "解析系统",
        "url": "https://www.ckmov.vip/api.php?url="
    },
    {
        "name": "XyPlayer解析",
        "url": "http://www.jx.xyplay.vip/?url="
    },
    {
        "name": "下视频",
        "url": "http://www.xiashipin.net/?url="
    },
    {
        "name": "猪蹄无广告1",
        "url": "https://jx.iztyy.com/svip/?url="
    },
    {
        "name": "猪蹄无广告",
        "url": "http://jx.iztyy.com/svip/?url="
    },
    {
        "name": "1907影视",
        "url": "https://z1.m1907.cn/?jx="
    },
    {
        "name": "大白解析",
        "url": "http://jx.myzch.cn/jx/?v="
    }
];
    loadVipFunc();

    //小说双击自动滚动功能，白名单设置
    function openReadScrollMode() {
        let whiteList = ["jx.hao0606.com"];
        let inWhiteList = false;
        for (let i = 0; i < whiteList.length; i++) {
            if (location.href.indexOf(whiteList[i]) != -1) {
                inWhiteList = true;
                break;
            }
        }
        if (!inWhiteList) {
            eval(function(p, a, c, k, e, r) {
                e = function(c) {
                    return (c < a ? '': e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
                };
                if (!''.replace(/^/, String)) {
                    while (c--) r[e(c)] = k[c] || e(c);
                    k = [function(e) {
                        return r[e]
                    }];
                    e = function() {
                        return '\\w+'
                    };
                    c = 1
                };
                while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
                return p
            } ('(5(){6(3.1c(\'L\')){}1b{4 f=3.1a(\'b\');f.19=\'L\';3.7.18(f);13(J,12);5 J(){N();6(9.w.Y(\'X\')>-1){9.t(0,0);i=H;j[h]=M(r,s);h++}}4 g,u,p,s=W;4 h=0;4 i=C;4 j=o V();5 r(){g=3.B.l||3.7.l;9.t(0,++g)};5 F(){i=C;T(4 x=0;x<j.S;x++){R(j[x])};h=0};5 N(){K(2,3.7,5(a,n){i=H;j[h]=M(r,s);h++});4 b=3.P(\'7\')[0];3.m("Q",5(e){u=e.I[0].G});3.m("U",5(e){p=e.I[0].G;4 y=p-u;﻿6(y>=15){9.w="";F()}})};4 k=0;3.m("t",A);5 A(){z=3.B.l||3.7.l;6(z+9.Z.10>3.7.O+11){k=k*1+1;6(k>1&&i){}}}5 K(n,c,d){c.14(\'16\',17);4 n=E(n)<1?1:E(n),8=0,q=0;4 e=5(a){4 b=o v().D();8=(b-q)<1d?8+1:0;q=o v().D();6(8>=n-1){d(a,n);8=0}};c.m(\'1e\',e)}}})();', 62, 77, '|||document|var|function|if|body|count|window||||||||||||scrollTop|addEventListener||new|pooendY|lastTime|pooScrollWin|poomsec|scroll|poostartY|Date|dataOxp|||topin|dddb|documentElement|false|getTime|parseInt|pooScrollWin_Off|clientY|true|changedTouches|okrex|nclickEvent|xxmRead2019|setInterval|scrollAutoClickNextUrl|scrollHeight|getElementsByTagName|touchstart|clearInterval|length|for|touchmove|Array|40|oxp|indexOf|screen|height|110|400|setTimeout|removeEventListener||dblclick|null|appendChild|id|createElement|else|getElementById|300|click'.split('|'), 0, {}))
        }
    }
    //小说双击自动滑动，多次双击可以加速，上滑停止滑动；
    //如果要关闭此功能，可以在下面一行代码前加上"//"即可
    openReadScrollMode();

    //以下是VIP解析功能
    function loadVipFunc() {
     var domain = location.href.split("?");
	    var ye = "<span style='display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:3.78vw 2.1vw;'>★</span>";
	    if (domain[0].match(".iqiyi.com") || domain[0].match(".youku.com") || domain[0].match(".le.com") || domain[0].match(".letv.com") || domain[0].match("v.qq.com") || domain[0].match(".tudou.com") || domain[0].match(".mgtv.com") || domain[0].match(".sohu.com")) {
    		var myBtn = document.createElement("div");
	    	myBtn.id = "myBtn2019";
    		myBtn.innerHTML = "➿‍";
    		myBtn.setAttribute("style", "width:24vw;height:24vw;position:fixed;bottom:30vh;right:10vw;z-index:100000;border-radius:100%;text-align:center;line-height:20vw;box-shadow:0px 1px 3px rgba(0,0,0,0.3);font-size:9vw;background:#fafafa;");
    		myBtn.onclick = function() {
			    loadVip(location.href);
		    };
	    	document.body.appendChild(myBtn);
    		var myul = document.createElement("ul");
		    myul.id = "myul2019";
	    	myul.setAttribute("style", "display:none;background:#fff;box-shadow:0px 1px 10px rgba(0,0,0,0.3);margin:0;padding:0 4.2vw;position:fixed;bottom:35vh;right:12vw;z-index:99999;height:60vh;overflow:scroll;border-radius:1.26vw;");
	    	for (var i = 0; i < apis.length; i++) {
	    		var myli = document.createElement("li");
	    		var that = this;
    			myli.setAttribute("style", "margin:0;padding:0;display:block;list-style:none;font-size:4.2vw;width:33.6vw;text-align:left;line-height:12.6vw;letter-spacing:0;border-bottom:1px solid #f0f0f0;position:relative;overflow:hidden;text-overflow:hidden;white-space:nowrap;"); 
    			(function(num) {
			    	myli.onclick = function() {
			    		window.open(apis[num].url + tryGetRealUrl(location.href), '_blank');
		    		};
		    		myli.ontouchstart = function() {
				    	this.style.cssText += "color:yellow;background:#373737;border-radius:1.26vw;";
			    	};
			    	myli.ontouchend = function() {
				    	this.style.cssText += "color:black;background:transparent;border-radius:0;";
			    	};
		    	})(i);
		    	myli.innerHTML = apis[i].name;
		    	myul.appendChild(myli)
	    	}
	    	document.body.appendChild(myul);
        }
    }

    function tryGetRealUrl(url) {
        var realUrl = url;
        try {
            realUrl = getRealUrl(url);
        } catch(err) {
            console.log(err);
        }
        return realUrl;
    }
    function getYoukuRealUrl(url) {
        var li = document.getElementsByClassName('hot-row-bottom')[0].children[0];
        var data = li.getAttribute('data-param');
        var s = data.split('svid=');
        if (s.length > 1) {
            var svid = s[1].split('&')[0];
            return 'https://v.youku.com/v_show/id_' + svid + '.html';
        }
        return url;
    }
    function getRealUrl(url) {
        var dataurl2 = url;
        var txurlc = dataurl2.split(":");
        var txurl = txurlc[1].slice(0, 12);
        var ykurl = txurlc[1].slice(0, 13);
        var ykdata = txurlc[1].slice(13);
        var funurl = txurlc[1].slice(0, 11);
        if (ykurl == '//m.youku.com') {
            return getYoukuRealUrl(url);
        }
        if (ykurl == '//m.youku.com') {
            var txurlc = dataurl2.split(":");
            var ykurl = txurlc[1].slice(0, 13);
            var ykdata = txurlc[1].slice(13);
            dataurl2 = 'http://www.youku.com' + ykdata;
        } else if (ykurl == '//m.iqiyi.com') {
            var txurlc = dataurl2.split(":");
            var ykurl = txurlc[1].slice(0, 13);
            var ykdata = txurlc[1].slice(13);
            dataurl2 = 'https://www.iqiyi.com' + ykdata;
        } else if (txurl == '//m.v.qq.com') {
            var vid = getParam(dataurl2, "vid");
            var cid = getParam(dataurl2, "cid");
            var txdata2 = dataurl2.split("?");
            var str = "play.html";
            if (txdata2[0].slice(txdata2[0].length - str.length) == str) {
                if (cid.length > 1) {
                    dataurl2 = "https://v.qq.com/x/cover/" + cid + ".html";
                    return dataurl2;
                } else if (vid.length == 11) {
                    return "https://v.qq.com/x/page/" + vid + ".html";
                }
            }
            cid = txdata2[0].slice( - 20, -5);
            if (vid.length == 11) {
                dataurl2 = 'https://v.qq.com/x/cover/' + cid + '/' + vid + '.html';
            } else {
                dataurl2 = 'https://v.qq.com/x/cover/' + cid + '.html';
            }
        } else if (ykurl == '//m.le.com/vp') {
            var leurlc = dataurl2.split("_");
            var leurl = leurlc[1];
            dataurl2 = 'http://www.le.com/ptv/vplay/' + leurl;
        }
        return dataurl2;
    }
    function getParam(dataurl2, name) {
        return dataurl2.match(new RegExp('[?&]' + name + '=([^?&]+)', 'i')) ? decodeURIComponent(RegExp.$1) : '';
    }
    function loadVip(url) {
        var myBtn = document.getElementById("myBtn2019");
        var myul = document.getElementById("myul2019");
        if (myul.style.display == "none") {
            myul.style.display = "block";
            myBtn.innerHTML = "➕";
            myBtn.style.transform = "rotateZ(45deg)";
        } else {
            myul.style.display = "none";
            myBtn.innerHTML = "➿";
            myBtn.style.transform = "rotateZ(0deg)";
        }
    }
})();