
//#region ////___AUTO_CONFIG_START___////
/** 资源路径 */
export const ResPath = {

};

let _ResPath = {};

/** 分包名字 */
export const PackName = { "3DScene": "3DScene" };

/** 获取资源，未加载返回null */
export const ResGet = new Proxy(_ResPath, {
    get: function (target, propKey, receiver) {
        let result = Laya.loader.getRes(ResPath[propKey])
        return result ? result : null
    }
});
let VIEWJSONPATH = ["View_Game.json", "View_Loading.json", "View_Main.json"];
//#endregion ////___AUTO_CONFIG_END___////

import Tools from "../ToolsCode/Toools";
class _ResLoad {
    /** 分包加载进度 */
    private PackageLoadNum: number = 0
    /** 加载任务数量 */
    private GetResState: number = 0
    /** 资源清单 */
    private ResList: string[] = []
    /** 是否初始化 */
    private IsInit: boolean = false


    /** 初始化自动下载分包和加载资源 */
    init(ResFn?: Function, PackFn?: Function) {
        if (ResControl.IsInit === false) {
            ResControl.IsInit = true

            //预加载界面JSON文件
            ResControl.load(VIEWJSONPATH, ResControl, null, null, 0)

            //筛选资源路径
            for (let ResName in ResPath) {
                if (typeof ResFn == "function") {
                    if (ResFn(ResPath[ResName])) ResControl.ResList.push(ResPath[ResName])
                } else {
                    ResControl.ResList.push(ResPath[ResName])
                }
            }
            //筛选分包名字
            let PackageNameArr: string[] = [];
            for (let PackageName in PackName) {
                if (typeof PackFn == "function") {
                    if (PackFn(PackName[PackageName])) PackageNameArr.push(PackName[PackageName])
                } else {
                    PackageNameArr.push(PackageName);
                }
            }
            ResControl.DownloadAllPackage(PackageNameArr);
        }
    }

    /** 资源加载
 * @param url 资源地址的数组
 * @param caller 回调执行域(this)
 * @param complete 加载完成,如果全部加载成功，则回调参数的值为true，否则为false
 * @param progress 回调参数值为当前资源加载的进度信息(0-1)
 * @param priority (默认：1)加载的优先级，优先级高的优先加载。有0-4共5个优先级，0最高，4最低
 */
    load(url: string[] = [], caller = null, complete: Function = null, progress: Function = null, priority: (0 | 1 | 2 | 3 | 4) = 1) {
        if (!url) url = []
        Laya.loader.create(url,
            Laya.Handler.create(caller, complete),
            Laya.Handler.create(caller, progress),
            null, null, null, priority, true
        )
    }

    /** 分包加载 方法兼容各环境调用，但是暂时只会调用qq小游戏和微信小游戏的加载方法
     * @param url 包名的数组
     * @param caller 回调执行域(this)
     * @param complete 加载完成,如果全部加载成功，则回调参数的值为true，否则为false
     * @param progress 回调参数值为当前资源加载的进度信息(0-1)
     */
    loadPackage(name: string[] = [], caller = null, complete?: Function, progress?: Function) {
        if (!name) name = []
        if (typeof complete != "function") complete = () => { }
        if (typeof progress != "function") progress = () => { }


        //绑定作用域
        complete = complete.bind(caller);
        progress = progress.bind(caller);

        /** 执行加载分包的次数 */
        let _index = 0;

        /** 记录分包下载成功次数 */
        let _seccess = 0;

        /** 各个分包进度 */
        let _progress = [];

        //下载分包
        DownloadSubpackage()

        //监听进度，并返回进度
        Laya.timer.loop(100, ResControl, AllLoadProgress)

        //===========================================================
        /** 执行下载分包 */
        function DownloadSubpackage() {
            //微信的分包下载
            if (Tools.getPlatform == "wx") {
                //判断是否还有分包未执行下载
                if (_index >= name.length) { return }

                //记录当前需要处理分包的下标
                let index = _index

                //初始化下载进度
                _progress[index] = 0

                //执行下载分包
                Laya.Browser.window.wx.loadSubpackage({
                    name: name[index],
                    success() {
                        let text = '分包[' + name[index] + ']加载成功'
                        console.info('%c' + text + '', 'color: #43bb88;font-size: 10px;');
                        _seccess++
                        _progress[index] = 1
                    },
                    fail(res) {
                        let text = '分包[' + name[index] + ']加载失败'
                        console.error('%c' + text + '', 'color: red;font-size: 14px;font-weight: bold;', res);
                        _progress[index] = 1
                    }
                })

                //监听下载进度(伪进度)
                Laya.timer.loop(100, ResControl, LoadProgress)
                function LoadProgress() {
                    if (_progress[index] >= 0.95) {
                        Laya.timer.clear(ResControl, LoadProgress)
                    } else if (_progress[index] >= 0.75) {
                        _progress[index] += 0.005
                    } else {
                        _progress[index] += 0.01
                    }
                }

                //执行下载下一个分包
                _index++
                DownloadSubpackage()
            } else {
                //判断是否还有分包未执行下载
                if (_index >= name.length) { return }

                //记录当前需要处理分包的下标
                let index = _index

                //初始化下载进度
                _progress[index] = 0

                //执行下载分包
                _seccess++
                _progress[index] = 1

                //监听下载进度(伪进度)
                Laya.timer.loop(100, ResControl, LoadProgress)
                function LoadProgress() {
                    if (_progress[index] >= 0.95) {
                        Laya.timer.clear(ResControl, LoadProgress)
                    } else if (_progress[index] >= 0.75) {
                        _progress[index] += 0.005
                    } else {
                        _progress[index] += 0.01
                    }
                }

                //执行下载下一个分包
                _index++
                DownloadSubpackage()
            }
        }

        /** 监听所有分包的下载进度 */
        function AllLoadProgress() {
            //计算所有分包总进度
            let All_progress = 0
            _progress.forEach((item) => {
                All_progress += item
            })
            All_progress = All_progress / name.length
            //返回进度
            progress(All_progress)
            //判断是否完成
            if (All_progress >= 1) {
                complete(_seccess == name.length)
                Laya.timer.clear(ResControl, AllLoadProgress)
            }
        }
        //===========================================================

    }

    /** 执行下载分包 优先级：最高*/
    private DownloadAllPackage(PackageNameArr: string[] = []) {
        if (PackageNameArr.length >= 1) {
            ResControl.loadPackage(PackageNameArr, ResControl, (res) => {
                ResControl.ResAutoLoad()
            }, (res) => {
                ResControl.PackageLoadNum = res
            });
        } else {
            ResControl.PackageLoadNum = 1
            ResControl.ResAutoLoad()
        }

    }

    /** 执行加载资源  优先级：4*/
    private ResAutoLoad() {
        let indexNum = 0
        load()
        function load() {
            if (ResControl.ResList.length <= indexNum) {
                return
            }
            if (ResControl.GetResState) {
                Laya.timer.frameOnce(100, ResControl, load)
            } else if (Laya.loader.getRes(ResControl.ResList[indexNum])) {
                indexNum++;
                Laya.timer.frameOnce(100, ResControl, load)
            } else {
                ResControl.load([ResControl.ResList[indexNum]], ResControl, (res) => {
                    indexNum++;
                    Laya.timer.frameOnce(100, ResControl, load)
                }, null, 4)
            }
        }
    }

    /** 检验资源并返回进度，未加载资源提高优先级为 1 */
    ResState(resurlarr, caller, callback) {
        if (!resurlarr) resurlarr = []
        if (caller) callback = callback.bind(caller);
        ResControl.GetResState++
        //未加载清单
        let noLoadList: string[] = []
        let noLoadListProgress = 0
        resurlarr.forEach(item => {
            let result = Laya.loader.getRes(item)
            if (result == null && item) {
                noLoadList.push(item)
            }
        });
        //初始进度
        let progress = 1 - ResControl.PackageLoadNum + 1 - noLoadListProgress

        // 等待分包下载完毕 才加载资源
        Laya.timer.frameLoop(1, ResControl, load)
        function load() {
            if (ResControl.PackageLoadNum >= 1 && noLoadList.length > 0) {
                Laya.timer.clear(ResControl, load)
                ResControl.load(noLoadList, ResControl, (res) => {
                }, (res) => {
                    noLoadListProgress = res
                }, 1)
            } else if (noLoadList.length == 0) {
                noLoadListProgress = 1
                Laya.timer.clear(ResControl, load)
            }
        }

        //返回资源加载进度
        Laya.timer.frameLoop(1, ResControl, result)
        function result() {
            let _progress = 1 - (1 - ResControl.PackageLoadNum + 1 - noLoadListProgress) / progress
            if (_progress >= 1) {
                ResControl.GetResState--
                Laya.timer.clear(ResControl, result)
            }
            if (typeof callback == "function") {
                callback(_progress)
            }

        }
    }



}
export let ResControl = new _ResLoad()

