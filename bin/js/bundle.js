(function () {
    'use strict';

    class _EventName {
        constructor() {
            this.Frame = {
                SetLocalData: "SetLocalData",
                GetLocalData: "GetLocalData",
                ShowUI: "ShowUI",
                HideUI: "HideUI",
                RemoveUI: "RemoveUI",
            };
            this.Test = "Test";
        }
    }
    const EventName = new _EventName();

    class EventControl {
        constructor() {
            this.eventDispatcher = new Laya.EventDispatcher();
        }
        emit(InName, data = null) {
            return this.eventDispatcher.event(InName, [data]);
        }
        on(InName, caller, listener, arg) {
            this.eventDispatcher.on(InName, caller, listener, arg);
        }
        off(InName, caller, listener) {
            this.eventDispatcher.off(InName, caller, listener);
        }
        offAll(caller) {
            this.eventDispatcher.offAllCaller(caller);
        }
    }
    var EventControl$1 = new EventControl();

    class _Tools {
        get getPlatform() {
            if (Laya.Browser.window.qq && typeof Laya.Browser.window.qq.getSystemInfoSync == "function" && Laya.Browser.window.qq.getSystemInfoSync().benchmarkLevel) {
                return "qq";
            }
            else if (Laya.Browser.window.tt && typeof Laya.Browser.window.tt.getSystemInfoSync == "function" && Laya.Browser.window.tt.getSystemInfoSync().safeArea) {
                return "tt";
            }
            else if (Laya.Browser.window.wx && typeof Laya.Browser.window.wx.getSystemInfoSync == "function" && Laya.Browser.window.wx.getSystemInfoSync().benchmarkLevel) {
                return "wx";
            }
            else {
                return "other";
            }
        }
    }
    let Tools = new _Tools();

    const ResPath = {};
    let _ResPath = {};
    const PackName = { "3DScene": "3DScene" };
    const ResGet = new Proxy(_ResPath, {
        get: function (target, propKey, receiver) {
            let result = Laya.loader.getRes(ResPath[propKey]);
            return result ? result : null;
        }
    });
    let VIEWJSONPATH = ["View_Game.json", "View_Loading.json", "View_Main.json"];
    class _ResLoad {
        constructor() {
            this.PackageLoadNum = 0;
            this.GetResState = 0;
            this.ResList = [];
            this.IsInit = false;
        }
        init(ResFn, PackFn) {
            if (ResControl.IsInit === false) {
                ResControl.IsInit = true;
                ResControl.load(VIEWJSONPATH, ResControl, null, null, 0);
                for (let ResName in ResPath) {
                    if (typeof ResFn == "function") {
                        if (ResFn(ResPath[ResName]))
                            ResControl.ResList.push(ResPath[ResName]);
                    }
                    else {
                        ResControl.ResList.push(ResPath[ResName]);
                    }
                }
                let PackageNameArr = [];
                for (let PackageName in PackName) {
                    if (typeof PackFn == "function") {
                        if (PackFn(PackName[PackageName]))
                            PackageNameArr.push(PackName[PackageName]);
                    }
                    else {
                        PackageNameArr.push(PackageName);
                    }
                }
                ResControl.DownloadAllPackage(PackageNameArr);
            }
        }
        load(url = [], caller = null, complete = null, progress = null, priority = 1) {
            if (!url)
                url = [];
            Laya.loader.create(url, Laya.Handler.create(caller, complete), Laya.Handler.create(caller, progress), null, null, null, priority, true);
        }
        loadPackage(name = [], caller = null, complete, progress) {
            if (!name)
                name = [];
            if (typeof complete != "function")
                complete = () => { };
            if (typeof progress != "function")
                progress = () => { };
            complete = complete.bind(caller);
            progress = progress.bind(caller);
            let _index = 0;
            let _seccess = 0;
            let _progress = [];
            DownloadSubpackage();
            Laya.timer.loop(100, ResControl, AllLoadProgress);
            function DownloadSubpackage() {
                if (Tools.getPlatform == "wx") {
                    if (_index >= name.length) {
                        return;
                    }
                    let index = _index;
                    _progress[index] = 0;
                    Laya.Browser.window.wx.loadSubpackage({
                        name: name[index],
                        success() {
                            let text = '分包[' + name[index] + ']加载成功';
                            console.info('%c' + text + '', 'color: #43bb88;font-size: 10px;');
                            _seccess++;
                            _progress[index] = 1;
                        },
                        fail(res) {
                            let text = '分包[' + name[index] + ']加载失败';
                            console.error('%c' + text + '', 'color: red;font-size: 14px;font-weight: bold;', res);
                            _progress[index] = 1;
                        }
                    });
                    Laya.timer.loop(100, ResControl, LoadProgress);
                    function LoadProgress() {
                        if (_progress[index] >= 0.95) {
                            Laya.timer.clear(ResControl, LoadProgress);
                        }
                        else if (_progress[index] >= 0.75) {
                            _progress[index] += 0.005;
                        }
                        else {
                            _progress[index] += 0.01;
                        }
                    }
                    _index++;
                    DownloadSubpackage();
                }
                else {
                    if (_index >= name.length) {
                        return;
                    }
                    let index = _index;
                    _progress[index] = 0;
                    _seccess++;
                    _progress[index] = 1;
                    Laya.timer.loop(100, ResControl, LoadProgress);
                    function LoadProgress() {
                        if (_progress[index] >= 0.95) {
                            Laya.timer.clear(ResControl, LoadProgress);
                        }
                        else if (_progress[index] >= 0.75) {
                            _progress[index] += 0.005;
                        }
                        else {
                            _progress[index] += 0.01;
                        }
                    }
                    _index++;
                    DownloadSubpackage();
                }
            }
            function AllLoadProgress() {
                let All_progress = 0;
                _progress.forEach((item) => {
                    All_progress += item;
                });
                All_progress = All_progress / name.length;
                progress(All_progress);
                if (All_progress >= 1) {
                    complete(_seccess == name.length);
                    Laya.timer.clear(ResControl, AllLoadProgress);
                }
            }
        }
        DownloadAllPackage(PackageNameArr = []) {
            if (PackageNameArr.length >= 1) {
                ResControl.loadPackage(PackageNameArr, ResControl, (res) => {
                    ResControl.ResAutoLoad();
                }, (res) => {
                    ResControl.PackageLoadNum = res;
                });
            }
            else {
                ResControl.PackageLoadNum = 1;
                ResControl.ResAutoLoad();
            }
        }
        ResAutoLoad() {
            let indexNum = 0;
            load();
            function load() {
                if (ResControl.ResList.length <= indexNum) {
                    return;
                }
                if (ResControl.GetResState) {
                    Laya.timer.frameOnce(100, ResControl, load);
                }
                else if (Laya.loader.getRes(ResControl.ResList[indexNum])) {
                    indexNum++;
                    Laya.timer.frameOnce(100, ResControl, load);
                }
                else {
                    ResControl.load([ResControl.ResList[indexNum]], ResControl, (res) => {
                        indexNum++;
                        Laya.timer.frameOnce(100, ResControl, load);
                    }, null, 4);
                }
            }
        }
        ResState(resurlarr, caller, callback) {
            if (!resurlarr)
                resurlarr = [];
            if (caller)
                callback = callback.bind(caller);
            ResControl.GetResState++;
            let noLoadList = [];
            let noLoadListProgress = 0;
            resurlarr.forEach(item => {
                let result = Laya.loader.getRes(item);
                if (result == null) {
                    noLoadList.push(item);
                }
            });
            let progress = 1 - ResControl.PackageLoadNum + 1 - noLoadListProgress;
            Laya.timer.frameLoop(1, ResControl, load);
            function load() {
                if (ResControl.PackageLoadNum >= 1 && noLoadList.length > 0) {
                    Laya.timer.clear(ResControl, load);
                    ResControl.load(noLoadList, ResControl, (res) => {
                    }, (res) => {
                        noLoadListProgress = res;
                    }, 1);
                }
                else if (noLoadList.length == 0) {
                    noLoadListProgress = 1;
                    Laya.timer.clear(ResControl, load);
                }
            }
            Laya.timer.frameLoop(1, ResControl, result);
            function result() {
                let _progress = 1 - (1 - ResControl.PackageLoadNum + 1 - noLoadListProgress) / progress;
                if (_progress >= 1) {
                    ResControl.GetResState--;
                    Laya.timer.clear(ResControl, result);
                }
                if (typeof callback == "function") {
                    callback(_progress);
                }
            }
        }
    }
    let ResControl = new _ResLoad();

    var _LocalData = {
        VERSION: 2,
        Test: {
            name: "王二狗",
            age: 3,
            merit: ["能吃", "能喝", "能睡"]
        }
    };

    let InitState = false;
    function _InitLocaData() {
        if (InitState)
            return;
        InitState = true;
        if (Laya.LocalStorage.getJSON("VERSION") != LocalData.VERSION) {
            for (const key in _LocalData) {
                LocalData[key] = LocalData[key];
            }
        }
        else {
            for (const key in _LocalData) {
                let data = Laya.LocalStorage.getJSON(key);
                if (!data) {
                    LocalData[key] = LocalData[key];
                }
                else {
                    LocalData[key] = data;
                }
            }
        }
    }
    let LocalData = new Proxy(_LocalData, {
        get(target, key) {
            _InitLocaData();
            EventControl$1.emit(EventName.Frame.GetLocalData, [key]);
            return target[key];
        },
        set(target, key, value) {
            Reflect.set(target, key, value);
            Laya.LocalStorage.setJSON(key, target[key]);
            EventControl$1.emit(EventName.Frame.SetLocalData, [key, value]);
            _InitLocaData();
            return true;
        }
    });

    class Ready {
        constructor() {
            Laya.SoundManager.autoStopMusic = false;
            EventControl$1.on(EventName.Frame.ShowUI, this, ResControl.init);
            _InitLocaData();
            if (Tools.getPlatform == "wx") {
                var data = { withShareTicket: true };
                wx.showShareMenu(data);
            }
        }
    }

    class AutoPage extends Laya.Script {
        onAwake() {
            let View = this.owner;
            View.width = Laya.stage.width;
            View.height = Laya.stage.height;
        }
    }

    class _UIControl {
        constructor() {
            this.Views = [];
        }
        ShowUI(_class, data) {
            let _index = UIControl.GetUIIndexFromViews(_class.NAME);
            let _view = UIControl.Views[_index];
            _class.DATA = data;
            if (!_view) {
                _view = new _class(data);
                UIControl.Views.push(_view);
            }
            _view.name = _class.NAME;
            Laya.stage.addChild(_view);
            _view.visible = true;
            _view.active = true;
            if (_class.AUTO) {
                _view.addComponent(AutoPage);
            }
            EventControl$1.emit(EventName.Frame.ShowUI, _view.name);
            return _view;
        }
        HideUI(_class) {
            let _index = UIControl.GetUIIndexFromViews(_class.NAME);
            let _view = UIControl.Views[_index];
            if (_view) {
                Laya.stage.removeChild(_view);
                _view.visible = false;
                _view.active = false;
                EventControl$1.emit(EventName.Frame.HideUI, _view.name);
            }
        }
        RemoveUI(_class) {
            let _index = UIControl.GetUIIndexFromViews(_class.NAME);
            let _view = UIControl.Views[_index];
            if (_view) {
                Laya.stage.removeChild(_view);
                _view.visible = false;
                _view.active = false;
                _class.DATA = null;
                Laya.timer.clearAll(_view);
                Laya.stage.offAllCaller(_view);
                EventControl$1.offAll(_view);
                UIControl.Views.splice(_index, 1);
                Laya.timer.frameOnce(10, null, () => {
                    _view.destroy();
                    EventControl$1.emit(EventName.Frame.RemoveUI, _view.name);
                });
            }
        }
        GetUI(_name) {
            let _index = UIControl.GetUIIndexFromViews(_name.name);
            let _view = UIControl.Views[_index];
            if (_view) {
                return _view;
            }
            else {
                return null;
            }
        }
        GetUIIndexFromViews(_names) {
            return UIControl.Views.findIndex(_ui => {
                return _ui.name == _names;
            });
        }
    }
    const UIControl = new _UIControl();

    var View = Laya.View;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class View_GameUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("View_Game");
            }
        }
        ui.View_GameUI = View_GameUI;
        REG("ui.View_GameUI", View_GameUI);
        class View_LoadingUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("View_Loading");
            }
        }
        ui.View_LoadingUI = View_LoadingUI;
        REG("ui.View_LoadingUI", View_LoadingUI);
        class View_MainUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("View_Main");
            }
        }
        ui.View_MainUI = View_MainUI;
        REG("ui.View_MainUI", View_MainUI);
    })(ui || (ui = {}));

    class View_Main extends ui.View_MainUI {
        constructor() {
            super();
            console.log(View_Main.DATA);
        }
    }
    View_Main.NAME = "View_Main";
    View_Main.AUTO = true;
    View_Main.DATA = null;

    class Engine extends Ready {
        constructor() {
            super();
            EventControl$1.on(EventName.Test, this, Test);
            EventControl$1.emit(EventName.Test, "测试触发Test事件并传参");
            function Test(data) {
                console.log("Test事件被触发，参数：", data);
                EventControl$1.off(EventName, this, Test);
            }
            ResControl.init();
            ResControl.ResState([ResPath["Cube.lh"]], this, (progress) => {
                console.log("加载进度:", progress);
                if (progress == 1) {
                    console.log("加载完成：", ResGet["Cube.lh"]);
                }
            });
            ResControl.load(null, null, null, null, null);
            ResControl.loadPackage(null, null, null, null);
            ResGet;
            ResPath;
            LocalData.Test.name;
            LocalData.Test.age = 4;
            LocalData.Test.merit[0];
            LocalData.Test = LocalData.Test;
            let _View_Main = UIControl.ShowUI(View_Main, "测试打开界面并传参");
            UIControl.HideUI(View_Main);
            UIControl.RemoveUI(View_Main);
            UIControl.ShowUI(View_Main);
            UIControl.GetUI(View_Main);
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 1334;
    GameConfig.height = 750;
    GameConfig.scaleMode = "fixedheight";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "View_Game.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            new Engine();
        }
    }
    new Main();

}());
