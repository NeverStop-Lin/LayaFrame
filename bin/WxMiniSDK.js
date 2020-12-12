var oldSDK;
window.WxMiniSDK = {
    version: "3.0"
}
!function () {

    /**线上地址**/
    const hostUrl = 'https://api.xiangjiaogame.com/api';

    /**获取网络状态标识与断网上报失败列表**/
    var netWatching = false;
    var netIsConnected = true;
    var noNetRequestList = [];

    /****************************************************************************************************************/
    /**断网上报失败的元素**/
    class noNetRequestItem {
        constructor(url, params) {
            this.url = url;
            this.params = params;
            this.request = this.request.bind(this)
        }
        request() {
            statRequest(this.url, this.params);
            //发完请求删除自己
            noNetRequestList.splice(noNetRequestList.indexOf(this), 1)
        }
    }
    /**网络状态获取设置与检测**/
    function watchNetChange() {
        if (netWatching) {
            return
        }
        netWatching = true;
        // 网络状态获取
        wx.getNetworkType({
            success(res) {
                res.networkType == 'none' && (netIsConnected = false)
            }
        });


        /**网络检测，有网重传**/
        wx.onNetworkStatusChange((res) => {
            netIsConnected = res.isConnected ? true : false;
            res.isConnected && noNetRequestList.length > 0 && againRequest()
        });

        /**网络变化有网情况下重发失败的请求**/
        function againRequest() {
            let t = 0;
            noNetRequestList.forEach(ele => {
                setTimeout(ele.request, t += 100)
            });
            t = 0
        }
    }

    /**获取code**/
    function getCode() {
        return new Promise((resolve, reject) => {
            wx.login({
                success(res) {
                    resolve(res.code)
                },
                fail() {
                    console.log('获取code失败，请重新获取')
                }
            })
        })
    }
    /****************************************************************************************************************/


    /**
     * SDK初始化
     * 
     * @param {String} appKey 平台给配置的appKey
     * @param {String} openid 从微信获取的个人标识
     * @param {Object} options 小程序或小游戏启动参数
     */
    function init(appKey = '', openid = '', options = {}, fn) {
        /**网络监测开启*/
        watchNetChange();
        if (!appKey) {
            console.log('请传入正确的appKey');
            return new Promise((resolve, reject) => {
                resolve('请传入正确的appKey')
            })
        }

        // 存appKey
        wx.setStorageSync('count_appkey', appKey);
        window.WxMiniSDK.count_appkey = appKey

        // openid获取
        if (openid) {
            wx.setStorageSync('count_openid', openid)
            window.WxMiniSDK.count_openid = openid
        } else {
            openid = window.WxMiniSDK.count_openid || ''
        }

        //渠道标识
        options.query = options.query || {};
        let channel = "";
        if (options.ch) {
            channel = options.ch
        } else if (options.query.ch) {
            channel = options.query.ch
        } else if (options.query.scene) {
            channel = decodeURIComponent(options.query.scene)
        }
        wx.setStorageSync('count_ch', channel);
        window.WxMiniSDK.count_ch = channel
        let scene = options.scene || '1001';
        let optStr = JSON.stringify(options) || '';

        let aldstat_uuid = window.WxMiniSDK.aldstat_uuid


        let params = {
            code: '',
            channel: channel,
            scene: scene,
            appKey: appKey,
            openid: openid,
            options: optStr,
            aldstat_uuid,
            fn
        };
        if (openid) {
            return reportInit(params)
        } else {
            return getCode().then(code => {
                params.code = code;
                return reportInit(params)
            })
        }
    }


    /**
     * 上报初始化
     * 
     * @param {String} code 通过微信静默授权获取的个人标识
     * @param {String} channel 自定义的渠道标识，如ch=cljd
     * @param {String} scene 启动场景标识
     * @param {String} appKey 平台给配置的appKey
     * @param {String} openid 通过微信静默授权获取的个人标识
     * @param {String} options 小程序或小游戏启动参数，转换后的字符串
     */
    function reportInit(params) {
        var { fn } = params;
        delete params.fn;
        return statRequest('/openid', params).then(res => {
            if (res && res.data.code == 200) {
                wx.setStorageSync('count_openid', res.data.openid);
                window.WxMiniSDK.count_openid = res.data.openid
                if (window.WxMiniSDK.load_event) {
                    load()
                }
                if (fn) fn(res.data);
                // 初始化成功后的一些任务执行
                // reportInitCallBack(params, res.data);
                return res
            } else if (res === false) { } else {
                // console.log(res.data.message, '上报初始化错误1');
                console.error("===WxMiniSDK--init--", res.data.message + ",请核对初始化时的appkey是否填写正确===");
                return res
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 初始化成功后的一些任务执行
     * 
     *  */
    function reportInitCallBack(params, resData) {
        // wx.getStorageSync()
    }
    var eventName, subEventName;
    /****************************************************************************************************************/

    /**
     * 上报自定义统计事件
     * 
     * @param {String} params.appkey,   统计平台分配的appKey，必传
     * @param {String} params.openid,   用户的openid，必传
     * @param {String} params.channel,   进入小程序或小游戏的渠道，可不传
     * @param {String} params.eventName,   自定义上报事件一级名称，必传
     * @param {String} params.subEventName,   自定义上报事件二级名称，可不传，
     */
    function reportCustomEvent(params = {}) {
        params.appKey = window.WxMiniSDK.count_appkey || '';
        params.openid = window.WxMiniSDK.count_openid || '';
        params.channel = window.WxMiniSDK.count_ch || '';
        params.eventName = params.eventName || '';
        params.subEventName = params.subEventName || '';
        eventName = params.eventName;
        subEventName = params.subEventName;
        if (params.openid && params.appKey) {
            return doReportCustomEvent(params)
        } else {
            console.log('自定义缺参数');
            return
        }
    }


    /**
   * 上报自定义统计事件
   * 
   * @param {String} params.appkey,   统计平台分配的appKey，必传
   * @param {String} params.openid,   用户的openid，必传
   * @param {String} params.channel,   进入小程序或小游戏的渠道，可不传
   * @param {String} params.eventName,   自定义上报事件一级名称，必传
   * @param {String} params.subEventName,   自定义上报事件二级名称，可不传，
   */
    function doReportCustomEvent(params) {
        if (!params.eventName) {
            console.log('reportCustomEvent errMsg: 参数错误');
            return 'err'
        }
        return statRequest('/event', params).then(res => {
            if (res && res.data.code == 200) {
                return res
            } else if (res === false) { } else {
                // console.log(res.data.message, '自定义事件错误1');
                if (params.params == "clickMiniProgram") {
                    console.error("===WxMiniSDK--click--", res.data.message + ",请核对初始化时的appkey是否填写正确===");
                }
                if (params.params == "navigateToMiniProgram") {
                    console.error("===WxMiniSDK--skip--", res.data.message + ",请核对初始化时的appkey是否填写正确===");
                }

                return res
            }
        }).catch((err) => {
            console.log('上报自定义事件失败2');
            console.log(err)
        })
    }



    /**
   * 上报自定义统计事件_a
   * 
   * @param {String} params.appkey,   统计平台分配的appKey，必传
   * @param {String} params.openid,   用户的openid，必传
   * @param {String} params.channel,   进入小程序或小游戏的渠道，可不传
   * @param {String} params.eventName,   自定义上报事件一级名称，必传
   * @param {String} params.subEventName,   自定义上报事件二级名称，可不传，
   */
    function reportCustomEvent_a(params = {}) {
        params.appKey = window.WxMiniSDK.count_appkey || '';
        params.openid = window.WxMiniSDK.count_openid || '';
        params.channel = window.WxMiniSDK.count_ch || '';
        params.eventName = params.eventName || '';
        params.subEventName = params.subEventName || '';
        eventName = params.eventName;
        subEventName = params.subEventName;
        if (params.openid && params.appKey) {
            return doReportCustomEvent_a(params)
        } else {
            console.log('自定义缺参数_a');
            return
        }
    }


    /**
   * 上报自定义统计事件_a
   * 
   * @param {String} params.appkey,   统计平台分配的appKey，必传
   * @param {String} params.openid,   用户的openid，必传
   * @param {String} params.channel,   进入小程序或小游戏的渠道，可不传
   * @param {String} params.eventName,   自定义上报事件一级名称，必传
   * @param {String} params.subEventName,   自定义上报事件二级名称，可不传，
   */
    function doReportCustomEvent_a(params) {
        if (!params.eventName) {
            console.log('reportCustomEvent_a errMsg: 参数错误');
            return 'err'
        }
        return statRequest('/event_a', params).then(res => {
            if (res && res.data.code == 200) {
                return res
            } else if (res === false) { } else {
                // console.log(res.data.message, '自定义事件错误_a1');
                if (params.params == "exposureMiniProgram") {
                    console.error("===WxMiniSDK--show--", res.data.message + ",请核对初始化时的appkey是否填写正确===");
                }
                return res
            }
        }).catch((err) => {
            console.log('上报自定义事件失败_a2');
            console.log(err)
        })
    }

    /****************************************************************************************************************/




    //----------------------------------------------------------------------------------
    /**
     * 微信授权
     * @param {String} params.appkey,   统计平台分配的appKey，必传
     * @param {String} params.openid,   用户的openid，必传
     * @param {String} params.channel,   进入小程序或小游戏的渠道，可不传
     */
    function login(params = {}) {
        params.appKey = window.WxMiniSDK.count_appkey || '';
        params.openid = window.WxMiniSDK.count_openid || '';
        params.channel = window.WxMiniSDK.count_ch || '';
        if (!params.appKey || !params.openid) {
            console.log('授权缺参数');
            return 'err'
        }
        return statRequest('/login', params).then(res => {
            if (res && res.data.code == 200) {
                return res
            } else if (res === false) { } else {
                // console.log(res.data.message, '首次授权错误1');
                console.error("===WxMiniSDK--login--", res.data.message + ",请核对初始化时的appkey是否填写正确===");
                return res
            }
        }).catch((err) => {
            console.log('首次授权上报错误2');
            console.log(err)
        })
    }
    /**
     * 首次加载
     * @param {String} params.appkey,   统计平台分配的appKey，必传
     * @param {String} params.openid,   用户的openid，必传
     * @param {String} params.channel,   进入小程序或小游戏的渠道，可不传
     */
    function load(params = {}) {
        params.appKey = window.WxMiniSDK.count_appkey || '';
        params.openid = window.WxMiniSDK.count_openid || '';
        params.channel = window.WxMiniSDK.count_ch || '';
        if (!params.appKey || !params.openid) {
            wx.setStorageSync("load_event", true);
            window.WxMiniSDK.load_event = true
            console.log('首次加载缺参数');
            return 'err'
        }
        return statRequest('/load', params).then(res => {
            if (res && res.data.code == 200) {
                return res
            } else if (res === false) { } else {
                // console.log(res.data.message, '首次加载错误1');
                console.error("===WxMiniSDK--load--", res.data.message + ",请核对初始化时的appkey是否填写正确===");
                return res
            }
        }).catch((err) => {
            console.log('首次加载上报错误2');
            console.log(err)
        })
    }
    /**
      * 首次创角
      * @param {String} params.appkey,   统计平台分配的appKey，必传
      * @param {String} params.openid,   用户的openid，必传
      * @param {String} params.channel,   进入小程序或小游戏的渠道，可不传
      */
    function role(params = {}) {
        params.appKey = window.WxMiniSDK.count_appkey || '';
        params.openid = window.WxMiniSDK.count_openid || '';
        params.channel = window.WxMiniSDK.count_ch || '';
        if (!params.appKey || !params.openid) {
            console.log('首次创角缺参数');
            return 'err'
        }
        return statRequest('/role', params).then(res => {
            if (res && res.data.code == 200) {
                return res
            } else if (res === false) { } else {
                // console.log(res.data.message, '首次创角错误1');
                console.error("===WxMiniSDK--role--", res.data.message + ",请核对初始化时的appkey是否填写正确===");

                return res
            }
        }).catch((err) => {
            console.log('首次创角上报错误2');
            console.log(err)
        })
    }



    //曝光
    function exposureMiniProgram(val) {

        val = val.join(',');

        let params = {
            eventName: 'exposureMiniProgram_a',
            subEventName: val
        }
            ; reportCustomEvent_a(params)
    }
    //点击

    function clickMiniProgram(url) {
        let params = {
            eventName: 'clickMiniProgram',
            subEventName: url
        }
            ; reportCustomEvent(params)
    }


    //跳转

    function navigateToMiniProgram(url) {
        let params = {
            eventName: 'navigateToMiniProgram',
            subEventName: url
        }
            ; reportCustomEvent(params)
    }

    //----------------------------------------------------------------------------------
    let UserPaySay = true;
    /**
     * 用户点击支付上报
     * 
     * @param {String} openid 微信小游戏的openid，必填
     * @param {String} out_trade_no 自定义订单号，必填
     * @param {Number} total_fee 支付金额单位，必填
     * @param {Number} goods_id 商品的id，必填
     * @param {String} goods_name 商品名称，必填
     * @param {String} notify_url 支付成功之后的通知地址，必填
     * @param {String} extra 附加参数，选填
     */
    function gameUserPay(openid, out_trade_no, total_fee, goods_id, goods_name, notify_url, extra, callback) {
        let url = 'https://api.xiangjiaogame.com/pay/create';
        if (UserPaySay) {
            UserPaySay = false;
            wx.request({
                url: `${url}?openid=${openid}&out_trade_no=${out_trade_no}&total_fee=${total_fee}&goods_id=${goods_id}&goods_name=${goods_name}&notify_url=${notify_url}&extra=${extra}`,
                success(data) {
                    UserPaySay = true;
                    if (typeof callback == "function") {
                        callback(data)

                    }
                    return data
                },
                fail(data) {
                    UserPaySay = true;
                    if (typeof callback == "function") {
                        callback(data)

                    }
                    return data
                }
            })
        }
    }

    /**
    * 导量数据接口
    * @param {number} version  版本号-[填写正整数]
    * @param {function} fn 回调函数-function ( res )
    */
    function getGuide(version, fn) {
        var options = wx.getLaunchOptionsSync();
        options.query = options.query || {};
        let channel = "";
        if (options.ch) {
            channel = options.ch
        } else if (options.query.ch) {
            channel = options.query.ch
        } else if (options.query.scene) {
            channel = decodeURIComponent(options.query.scene)
        }
        wx.setStorageSync('count_ch', channel);
        window.WxMiniSDK.count_ch = channel
        let params = { version, channel };
        let reg = /^[1-9]\d*$/;
        if (reg.test(params.version)) {
            wx.request({
                url: "https://api.xiangjiaogame.com/guide/data",
                data: params,
                success(res) {
                    fn && fn(res.data);
                }, fail(res) {
                    console.log("guide请求报错", res);
                }
            })
        } else {
            console.log("guide版本号填写错误");
        }
    }


    /****************************************************************************************************************/

    /**
     * 各统计上报失败后重新上报一次
     * 
     * @param {String} reportEventName 需要上报的事件名称
     * @param {String} params 需要上报的事件参数
     * @param {Function} cb 特殊事件的回调函数，若无，可省略
     */
    function reportFailDeal(reportEventName = '', params = {}) {
        if (!reportEventName) {
            return 'err'
        }
        if (getrep('rep_' + reportEventName)) {
            return
        }
        setTimeout(() => {
            if (reportEventName == '/openid') {
                reportInit(params)

            }
            if (reportEventName == '/event') {
                ; reportCustomEvent(params)
            }
            if (reportEventName == '/load') {
                load(params)
            }
            if (reportEventName == '/login') {
                login(params)
            }
            if (reportEventName == '/role') {
                role(params)
            }
        }, 5000);


        //重新上报8次后  冷却10分钟
        function getrep(val) {
            var rep = window.WxMiniSDK[val];


            if (rep) {
                wx.setStorageSync(val, rep + 1)
                window.WxMiniSDK[val] = rep + 1

            } else {
                wx.setStorageSync(val, 1)
                window.WxMiniSDK[val] = 1
            }
            if (rep >= 8) {
                setTimeout(() => {
                    wx.setStorageSync(val, 0)
                    window.WxMiniSDK[val] = 0

                }, 60000);
                return true
            } else {
                return false
            }
        }
    }


    /****************************************************************************************************************/
    /**
     * 防频繁点击
     * @param {String} fleld,  标识
     */
    class peel {
        constructor(fleld) {
            this.val = fleld;
            this.set = function (val) {
                wx.setStorageSync(`diy_event_${val.val}`, `${val.val}`)
                window.WxMiniSDK[`diy_event_${val.val}`] = `${val.val}`

            };
            this.get = (val) => {
                let fleld = window.WxMiniSDK[`diy_event_${val.val}`];


                if (fleld === val.val) {
                    return 1
                } else {
                    return 0
                }
            };
            this.ret = () => {
                let then = {};
                then.then = function (val) {
                    val(false);
                    let then = {};
                    then.catch = function (val) { };
                    return then
                };
                return then
            };
            this.end = (val) => {
                wx.removeStorageSync(`diy_event_${val.val}`)
                delete window.WxMiniSDK[`diy_event_${val.val}`]
            }
        }
    }

    /**
     * 重新封装组合wx请求api
     * 
     * @param {String} url,  要访问的接口名称，必传
     * @param {Object} data,  要访问的接口数据，必传
     */
    function statRequest(url, data) {

        // let _peel = new peel(url);
        // if (_peel.get(_peel)) {
        //   return _peel.ret()
        // } else {
        //   _peel.set(_peel)
        // }
        // console.log(123333)
        if (!url) {
            return 'err'
        }

        return new Promise((resolve, reject) => {
            wx.request({
                url: hostUrl + url,
                method: 'POST',
                data: data,
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: resolve,
                fail(res) {
                    wx.getNetworkType({
                        success(res) {
                            if (res.networkType == 'none') {
                                noNetRequestList.push(new noNetRequestItem(url, data))
                            } else {
                                reportFailDeal(url, data)
                            }
                        }
                    });
                    reject(res)
                },
                complete() {
                    // if (_peel.get(_peel)) {
                    //   _peel.end(_peel)
                    // }
                }
            })
        }).catch(err => {
            console.log(err)
        })
    }
    oldSDK = {
        init,
        reportCustomEvent,
        load,
        login,
        role,
        exposureMiniProgram,
        clickMiniProgram,
        navigateToMiniProgram,
        gameUserPay,
        getGuide
    }
}();


!function () {
    window.WxMiniSDK.initState = false
    window.WxMiniSDK.guideData = {}

    if (typeof wx != "undefined") {
        window.WxMiniSDK.iswx = true
    } else {
        window.WxMiniSDK.iswx = false
    }

    function isok(val) {
        if (val != null && val != "" && val != undefined) {
            return true
        } else {
            return false
        }
    }

    function init(appkey, openid, callback) {
        if (!window.WxMiniSDK.iswx) return

        if (typeof openid == "string") {
            openid = openid.trim()
        }
        if (!isok(openid)) openid = ""
        if (typeof appkey == "string") {
            appkey = appkey.trim()
        }
        if (!isok(appkey)) {
            console.error("===WxMiniSDK--init--appkey格式错误===")
            console.error("===WxMiniSDK--init--初始化失败===")
            return
        }
        if (typeof callback != "function") {
            callback = function (res) {
                console.log("===WxMiniSDK--init--初始化完成===", res)
            }
        }
        let options = wx.getLaunchOptionsSync();
        oldSDK.init(appkey, openid, options, (res) => {
            window.WxMiniSDK.initState = true
            callback(res)
        });
    }
    window.WxMiniSDK.init = init

    function load() {
        if (!window.WxMiniSDK.iswx) return
        if (window.WxMiniSDK.initState) {
            oldSDK.load()
        } else {
            console.error("===WxMiniSDK--load--SDK未初始化完成，无法调用===")
        }
    }
    window.WxMiniSDK.load = load

    function login() {
        if (!window.WxMiniSDK.iswx) return
        if (window.WxMiniSDK.initState) {
            oldSDK.login()
        } else {
            console.error("===WxMiniSDK--login--SDK未初始化完成，无法调用===")
        }
    }
    window.WxMiniSDK.login = login


    function role() {
        if (!window.WxMiniSDK.iswx) return
        if (window.WxMiniSDK.initState) {
            oldSDK.role()
        } else {
            console.error("===WxMiniSDK--role--SDK未初始化完成，无法调用===")
        }
    }
    window.WxMiniSDK.role = role

    function divEvent(params) {
        if (!window.WxMiniSDK.iswx) return
        if (window.WxMiniSDK.initState) {
            oldSDK.reportCustomEvent(params)
        } else {
            console.error("===WxMiniSDK--divEvent--SDK未初始化完成，无法调用===")
        }
    }
    window.WxMiniSDK.divEvent = divEvent


    function getGuide(version, callback) {
        if (!window.WxMiniSDK.iswx) return
        if (typeof version != "number") {
            console.error("===WxMiniSDK--getGuide--版本号格式错误===")
            return
        }

        if (typeof callback != "function") {
            callback = function (res) {
                console.log("===WxMiniSDK--guide--数据获取成功===", res)
            }
        }
        oldSDK.getGuide(version, (res) => {
            var isNoScenes = res.sence.indexOf(wx["getLaunchOptionsSync"]().scene * 1) == -1
            if (res.special_edition == 1 || isNoScenes) {
                res.guide_flag_two = res.guide_flag_three = res.guide_flag_four = res.guide_flag_one = false
            }

            if (res.guide_flag_two == 1) res.guide_flag_two = true
            if (res.guide_flag_two == 0) res.guide_flag_two = false
            if (res.guide_flag_three == 1) res.guide_flag_three = true
            if (res.guide_flag_three == 0) res.guide_flag_three = false
            if (res.guide_flag_four == 1) res.guide_flag_four = true
            if (res.guide_flag_four == 0) res.guide_flag_four = false
            if (res.guide_flag_one == 1) res.guide_flag_one = true
            if (res.guide_flag_one == 0) res.guide_flag_one = false


            if (res.special_edition == 1 || res.is_mp == 0) {
                res.is_mp = false
            } else if (res.special_edition == 0 && res.is_mp == 1) {
                res.is_mp = true
            }

            if (res.special_edition == 1 || res.flag == 0 || res.flag == 1 && isNoScenes) {
                res.flag = false
            } else if (res.special_edition == 0 && res.flag == 1 && !isNoScenes || res.special_edition == 0 && res.flag == 2) {
                res.flag = true
            }

            window.WxMiniSDK.guideData = res
            callback(res)


        })

    }
    window.WxMiniSDK.getGuide = getGuide

    function show(idArr) {
        if (!window.WxMiniSDK.iswx) return
        if (window.WxMiniSDK.initState) {
            if (typeof idArr != "string" && idArr && idArr.length && idArr.length > 0 && isok(idArr[0])) {
                oldSDK.exposureMiniProgram(idArr)
            } else {
                console.error("===WxMiniSDK--show--参数格式错误，当前参数格式为===>" + typeof idArr + " 当前参数的值为===>", idArr)
            }
        } else {
            console.error("===WxMiniSDK--show--SDK未初始化完成，无法调用===")
        }
    }
    window.WxMiniSDK.show = show
    function click(id) {
        if (!window.WxMiniSDK.iswx) return
        if (window.WxMiniSDK.initState) {

            if (isok(id)) {
                oldSDK.clickMiniProgram(id)
            } else {
                console.error("===WxMiniSDK--click--参数格式错误，当前参数为===> " + id)
            }

        } else {
            console.error("===WxMiniSDK--click--SDK未初始化完成，无法调用===")
        }

    }
    window.WxMiniSDK.click = click
    function skip(id) {
        if (!window.WxMiniSDK.iswx) return
        if (window.WxMiniSDK.initState) {
            if (isok(id)) {
                oldSDK.navigateToMiniProgram(id)
            } else {
                console.error("===WxMiniSDK--skip--参数格式错误，当前参数为===> " + id)
            }
        } else {
            console.error("===WxMiniSDK--skip--SDK未初始化完成，无法调用===")
        }
    }
    window.WxMiniSDK.skip = skip

    window.WxMiniSDK.gameUserPay = oldSDK.gameUserPay
}()


