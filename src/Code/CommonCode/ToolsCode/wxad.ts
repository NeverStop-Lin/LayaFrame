import EventName from "../../ConfigFile/EventName"
import EventControl from "../ControlCode/EventControl"
import Tools from "./Toools"




class wxad {
    constructor() {
        if (Tools.getPlatform == "wx") {
            var data: any = { withShareTicket: true }
            wx.showShareMenu(data)
        }
    }
    public init(data?) {
        this.banner_ad.adid = data.banner_ad.adid || []
        this.video_ad.adid = data.video_ad.adid || ""
        if (Tools.getPlatform == "wx") {
            this.banner_ad.banner_ad_page_config.page_show = data.banner_ad.page_show || []
            this.banner_ad.banner_ad_page_config.page_hide = data.banner_ad.page_hide || []
            this.banner_ad.banner_rotate.interval = data.banner_ad.interval || 30000
            this.banner_ad.banner_rotate.autoPlay = data.banner_ad.autoPlay || false
            EventControl.on(EventName.ShowUI, this, this.banner_ShowListen)
            EventControl.on(EventName.HideUI, this, this.banner_HideListen)
            EventControl.on(EventName.RemoveUI, this, this.banner_HideListen)
        } else if (Tools.getPlatform == "qq") {
            this.appBox_ad.adid = data.appBox_ad.adid || ""
        }
        this.banner_load()
        this.video_load()
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    /** banner广告 */
    public banner_ad = {
        /** banner广告实例 */
        iv: [],
        /** banner广告id */
        adid: [],
        /** 当前显示状态 */
        isShow: false,
        /** 是否显示banner */
        display: false,
        /** 是否只存在一个banner */
        isOnly: false,
        pos: 'bottom',
        postion: {
            top: null,
            bottom: null,
            left: null,
            right: null
        },
        /** 页面轮播配置表 */
        banner_rotate: {
            /** 当前banner下标 */
            index: 0,
            /** 是否自动轮播 */
            autoPlay: true,
            /** 轮播间隔  单位：毫秒  （1000/秒） */
            interval: 25000,
            /** 定时器id */
            setInterval: null,
            /* 手Qbanner刷新时间 */
            refreshTimer: 0
        },
        /** 页面banner显示控制器配置表 */
        banner_ad_page_config: {
            /** 当前页面层级表 */
            page_arr: [],
            /** 持续显示banner页面配置 */
            page_show: [],
            /** 持续隐藏banner页面配置 */
            page_hide: [],
            /** 上一次监听到的页面 */
            page_next: "",
            /** 是否需要检测banner显示 */
            isDetection: true
        }
    }
    /** 激励视频广告 */
    private video_ad = {
        /** 激励视频广告实例 */
        iv: null,
        /** 激励视频广告id */
        adid: "",
        /** 关闭执行回调 */
        close_cb: null
    }

    /* 手Q游戏盒子广告 */
    private appBox_ad = {
        iv: null,
        adid: ""
    }
    /** 加载banner */
    public banner_load() {
        switch (Tools.getPlatform) {
            case 'wx':
                if (this.video_ad.adid != "") {
                    var getSystemInfoSync = wx.getSystemInfoSync()
                    var $this = this
                    if (this.banner_ad.adid[0].iv != null) {
                        this.banner_ad.adid.map((item, index) => {
                            item.iv.destory()
                        })
                    }
                    this.banner_ad.adid.map((item, index) => {
                        let iv = wx["createBannerAd"]({
                            adid: item,
                            adIntervals: 30,
                        })
                        iv.onLoad(() => {
                            this.banner_ad.postion.top = {
                                top: 0,
                                left: (getSystemInfoSync.windowWidth - iv.style.realWidth) / 2
                            }
                            this.banner_ad.postion.bottom = {
                                top: getSystemInfoSync.windowHeight - iv.style.realHeight,
                                left: (getSystemInfoSync.windowWidth - iv.style.realWidth) / 2
                            }
                            this.banner_ad.postion.left = {
                                top: getSystemInfoSync.windowHeight - iv.style.realHeight,
                                left: 0
                            }
                            this.banner_ad.postion.right = {
                                top: getSystemInfoSync.windowHeight - iv.style.realHeight,
                                left: getSystemInfoSync.windowWidth - iv.style.realWidth
                            }
                            iv.style.top = getSystemInfoSync.windowHeight - iv.style.realHeight
                            iv.style.left = (getSystemInfoSync.windowWidth - iv.style.realWidth) / 2
                            console.log("banner广告加载成功", index, "===>adid:", item)
                            $this.banner_ad.iv.push(iv)
                        })
                        iv.onError((res) => {
                            console.log("banner广告加载失败!!!", index, "===>微信反馈：", res, "===>adid:", item, "===>广告实例：", iv)
                        })

                    })
                    this.banner_controller()
                }
                break;
            case 'qq':
                if (this.video_ad.adid != "") {
                    this.banner_ad.iv[0].load = false;
                    if (this.banner_ad.iv[0] != null) {
                        this.banner_ad.iv[0].hide();
                        this.banner_ad.iv[0] = null
                    }
                    let sysInfo = window["wx"].getSystemInfoSync();
                    let width = sysInfo.screenWidth;
                    let left = (sysInfo.screenWidth - width) / 2;
                    let top = sysInfo.screenHeight * 0.86;
                    this.banner_ad.iv[0] = wx["createBannerAd"]({
                        adUnitId: this.banner_ad.adid[0],
                        style: {
                            top: top,
                            left: left,
                            width: 300,
                            height: 70
                        },
                    });
                    //监听
                    this.banner_ad.iv[0].onLoad(() => {
                        this.banner_ad.iv[0].style.top = getSystemInfoSync.windowHeight - this.banner_ad.iv[0].style.realHeight
                        this.banner_ad.iv[0].style.left = (getSystemInfoSync.windowWidth - this.banner_ad.iv[0].style.realWidth) / 2
                        if (this.banner_ad.banner_rotate.refreshTimer > 0) {
                            this.banner_show()
                        } else {
                            this.banner_hide()
                        }
                    })
                }
                break;
            case 'tt':
                const windowWidth = window["tt"].getSystemInfoSync().windowWidth
                const windowHeight = window["tt"].getSystemInfoSync().windowHeight
                var targetBannerAdWidth = 200;
                this.banner_ad.iv[0] = window["tt"]['createBannerAd']({
                    adUnitId: this.banner_ad.adid[0],
                    adIntervals: 30,
                    style: {
                        left: (windowWidth - targetBannerAdWidth) / 4,
                        width: targetBannerAdWidth,
                        top: windowHeight - (targetBannerAdWidth / 16) * 9, // 根据系统约定尺寸计算出广告高度
                    },
                });
                this.banner_ad.iv[0].onResize(res => {
                    this.banner_ad.iv[0].style.top = windowHeight - res.height;
                    this.banner_ad.iv[0].style.left = (windowWidth - res.width) / 2;
                })
                break;
        }
    }
    /** 显示banner */
    public banner_show(index = null, type = 'bottom') {
        switch (Tools.getPlatform) {
            case "wx":
                let isok = false
                if (index != null && index != this.banner_ad.banner_rotate.index) {
                    this.banner_ad.banner_rotate.index = index;
                    isok = true
                }
                if (this.banner_ad.isShow == false || isok == true) {
                    this.banner_ad.display = true
                    this.banner_ad.pos = type
                    this.banner_update_show()
                }
                if (this.banner_ad.display) {
                    this.banner_ad.pos = type
                    this.banner_update_show()
                }
                break;
            case 'qq':
                if (this.banner_ad.iv[0]) {
                    this.banner_ad.iv[0].show();
                    Laya.timer.clearAll(this)
                    Laya.timer.loop(5000, this, this.banner_load);
                    this.banner_ad.banner_rotate.refreshTimer = 1;
                }
                break;
            case 'tt':
                if (this.banner_ad.iv[0]) {
                    this.banner_ad.iv[0].show();
                }
                break;

        }

    }
    /** 隐藏banner */
    public banner_hide() {
        switch (Tools.getPlatform) {
            case "wx":
                this.banner_ad.isOnly = true
                if (this.banner_ad.isShow == true) {
                    this.banner_ad.display = false
                    this.banner_update_show()
                }
                break;
            case 'qq':
                if (this.banner_ad.iv[0]) {
                    Laya.timer.clearAll(this)
                    this.banner_ad.banner_rotate.refreshTimer = 0;
                    this.banner_ad.iv[0].hide();
                }

                break;
            case 'tt':
                if (this.banner_ad.iv[0]) {
                    this.banner_ad.iv[0].hide();
                }
                break;
        }

    }
    /** 打开页面 */
    public banner_open_page(name: string): void {
        if (Tools.getPlatform == "wx") {
            var index = this.banner_ad.banner_ad_page_config.page_arr.indexOf(name)
            if (index > -1) {
                var page = this.banner_ad.banner_ad_page_config.page_arr.splice(index, 1)
                this.banner_ad.banner_ad_page_config.page_arr.push(page)
            } else {
                this.banner_ad.banner_ad_page_config.page_arr.push(name)
            }

        }

    }
    /** 关闭页面 */
    public banner_close_page(name: string): void {
        if (Tools.getPlatform == "wx") {
            var index = this.banner_ad.banner_ad_page_config.page_arr.indexOf(name)
            if (index > -1) this.banner_ad.banner_ad_page_config.page_arr.splice(index, 1)
        }
    }
    /**
     * 设置显示banner和隐藏banner名单
     * @param open 要显示banner的页面名字
     * @param close 要隐藏banner的页面名字
     */
    public banner_set_page(open: string[], close: string[]): void {
        this.banner_ad.banner_ad_page_config.page_hide = open
        this.banner_ad.banner_ad_page_config.page_hide = close
    }
    /** 页面banner控制器 */
    // protected banner_page_controller() {
    //     setInterval(() => {
    //         let CurPageName = this.banner_ad.banner_ad_page_config.page_arr.slice(-1)[0]
    //         if (this.banner_ad.banner_ad_page_config.page_next == CurPageName) return
    //         var text = ""
    //         if (this.banner_ad.banner_ad_page_config.page_show.indexOf(CurPageName) > -1) {
    //             this.banner_show()
    //             text = "显示"
    //         } else if (this.banner_ad.banner_ad_page_config.page_hide.indexOf(CurPageName) > -1) {
    //             this.banner_hide()
    //             text = "隐藏"
    //         } else {
    //             this.banner_hide()
    //             text = "自定义"
    //         }
    //         this.banner_ad.banner_ad_page_config.page_next = CurPageName
    //         console.log("更新后的状态", this.banner_ad.banner_ad_page_config.page_arr, "==>" + text + "banner")
    //     }, 100)
    // }
    protected banner_ShowListen(_name) {
        console.log(_name, '监听的场景')
        this.banner_ad.banner_ad_page_config.page_arr.push(_name)
        this.initBanner()
    }
    protected banner_HideListen(_name) {
        this.banner_ad.banner_ad_page_config.page_arr.pop()
        let index = this.banner_ad.banner_ad_page_config.page_arr.indexOf(_name);
        if (index > -1) {
            this.banner_ad.banner_ad_page_config.page_arr.splice(index, 1);
        }
        this.initBanner()
    }
    protected initBanner() {
        let CurPageName = this.banner_ad.banner_ad_page_config.page_arr.slice(-1)[0]
        var text = ""
        if (this.banner_ad.banner_ad_page_config.page_show.indexOf(CurPageName) > -1) {
            this.banner_show()
            this.banner_ad.banner_ad_page_config.isDetection = false
            text = "显示"
        } else if (this.banner_ad.banner_ad_page_config.page_hide.indexOf(CurPageName) > -1) {
            this.banner_hide()
            this.banner_ad.banner_ad_page_config.isDetection = false
            text = "隐藏"
        }
        console.log('当前打开的场景', this.banner_ad.banner_ad_page_config.page_arr, text)
    }
    /** banner轮播控制器 */
    protected banner_controller() {
        var $this = this
        if (this.banner_ad.banner_rotate.setInterval === null) {
            this.banner_ad.banner_rotate.setInterval = setInterval(() => {
                if ($this.banner_ad.iv.length > 0) {
                    /** 开启轮播和显示banner才会轮换当前banner下标  */
                    if ($this.banner_ad.banner_rotate.autoPlay && $this.banner_ad.display) {
                        if ($this.banner_ad.banner_rotate.index == $this.banner_ad.iv.length - 1) {
                            $this.banner_ad.banner_rotate.index = 0
                        } else {
                            $this.banner_ad.banner_rotate.index += 1
                        }
                    }
                    /** 更新banner显示状态 */
                    $this.banner_update_show()
                }
            }, this.banner_ad.banner_rotate.interval);
        }
    }
    /** 更新banner显示状态 */
    protected banner_update_show(pos = null) {
        pos = this.banner_ad.pos
        var $this = this
        var isShow = 0
        this.banner_ad.iv.map((item, index) => {
            if ($this.banner_ad.banner_rotate.index == index && $this.banner_ad.display) {
                item.show()
                if (this.banner_ad.banner_ad_page_config.isDetection) {
                    this.initBanner()
                }
                this.banner_ad.banner_ad_page_config.isDetection = true
                if (pos) {
                    item.style.top = this.banner_ad.postion[pos].top
                    item.style.left = this.banner_ad.postion[pos].left
                }
            } else {
                if ($this.banner_ad.isOnly) {
                    item.hide()
                }
                isShow++
            }
        })
        if (isShow == this.banner_ad.iv.length) {
            $this.banner_ad.isShow = false
        } else {
            $this.banner_ad.isShow = true
        }
    }
    /** 主动拉起分享 */
    public share() {
        if (Tools.getPlatform == "wx") {
            wx["shareAppMessage"]({})
        }
    }



    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    /** 加载激励视频 */
    video_load() {
        if (this.video_ad.adid != "") {
            switch (Tools.getPlatform) {
                case 'tt':
                    this.video_ad.iv = window["tt"]["createRewardedVideoAd"]({
                        adUnitId: this.video_ad.adid
                    });
                    break;
                default:
                    this.video_ad.iv = wx["createRewardedVideoAd"]({
                        adUnitId: this.video_ad.adid
                    });
            }
            this.video_ad.iv.onLoad(() => {
                console.log("加载激励视频加载成功", "===>adid:", this.video_ad.adid)
            });
            this.video_ad.iv.onError((res) => {
                console.log("加载激励视频加载失败", "===>adid:", this.video_ad.adid, "===>微信反馈：", res)
            });
            this.video_ad.iv.onClose((a) => {
                if (typeof this.video_ad.close_cb == "function") {
                    this.video_ad.close_cb(a.isEnded)
                }
            });
            return this.video_ad.iv.load();
        }
    }
    /** 播放激励视频 */
    video_play(onClose?: Function) {

        this.video_ad.close_cb = onClose

        if (this.video_ad.iv) {
            this.video_ad.iv.show().catch(err => {
                this.video_load().then(() => {
                    this.video_ad.iv.show()
                })
            })
        } else {
            this.tip("暂无视频")
        }



    }

    /** 提示信息 */
    tip(val) {
        if (Tools.getPlatform == "wx") {
            var data: any = {
                title: val,
                icon: 'none',
                duration: 2000
            }
            wx.showToast(data)
        } else {
            alert(val)
        }
    }
    protected loadAppBox() {
        this.appBox_ad.iv = window["qq"]['createAppBox']({
            adUnitId: this.appBox_ad.adid,
        });
        this.appBox_ad.iv.onLoadAppBox()
    }

    public showAppBox() {
        console.log('打开盒子广告')
        if (this.appBox_ad.iv != null) {
            this.appBox_ad.iv.show();
        }
    }

    public hideAppBox() {
        if (this.appBox_ad.iv != null) {
            this.appBox_ad.iv.hide();
        }
    }

};

export default new wxad()





