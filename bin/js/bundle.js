(function () {
    'use strict';

    class _EventName {
        constructor() {
            this.SetLocalData = "SetLocalData";
            this.GetLocalData = "GetLocalData";
            this.ShowUI = "ShowUI";
            this.HideUI = "HideUI";
            this.RemoveUI = "RemoveUI";
            this.Loading_progress = "Loading_progress";
            this.DoorSwitch = "DoorSwitch";
            this.Car_UP_Down = "Car_UP_Down";
            this.Car_Accident = "Car_Accident";
            this.Car_RedLight = "Car_RedLight";
            this.Car_Archive = "Car_Archive";
            this.GameOver = "GameOver";
        }
    }
    const EventName = new _EventName();

    class EventControl {
        constructor() {
            this.eventDispatcher = new Laya.EventDispatcher();
        }
        emit(InName, ...agv) {
            return this.eventDispatcher.event(InName, agv);
        }
        on(InName, caller, listener, arg) {
            this.eventDispatcher.on(InName, caller, listener, (arg == null) ? null : ([arg]));
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

    const ResPath = {
        "刹车.mp3": "res/sounds/刹车.mp3",
        "喇叭.mp3": "res/sounds/喇叭.mp3",
        "引擎.mp3": "res/sounds/引擎.mp3",
        "背景音乐2.mp3": "res/sounds/背景音乐2.mp3",
        "SampleSceneGIReflection.ltcb.ls": "res/3DScene/LayaScene_SampleScene/Conventional/Assets/SampleSceneGIReflection.ltcb.ls",
        "SampleScene.ls": "res/3DScene/LayaScene_SampleScene/Conventional/SampleScene.ls",
        "Cube.lh": "res/3DScene/LayaScene_SampleScene/Conventional/Cube.lh",
        "DirectionalLight.lh": "res/3DScene/LayaScene_SampleScene/Conventional/DirectionalLight.lh",
        "lubiao.lh": "res/3DScene/LayaScene_SampleScene/Conventional/lubiao.lh",
        "LV1.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV1.lh",
        "LV10.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV10.lh",
        "LV11.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV11.lh",
        "LV12.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV12.lh",
        "LV13.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV13.lh",
        "LV14.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV14.lh",
        "LV15.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV15.lh",
        "LV16.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV16.lh",
        "LV17.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV17.lh",
        "LV18.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV18.lh",
        "LV19.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV19.lh",
        "LV2.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV2.lh",
        "LV20.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV20.lh",
        "LV21.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV21.lh",
        "LV22.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV22.lh",
        "LV23.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV23.lh",
        "LV24.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV24.lh",
        "LV25.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV25.lh",
        "LV26.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV26.lh",
        "LV27.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV27.lh",
        "LV28.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV28.lh",
        "LV29.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV29.lh",
        "LV3.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV3.lh",
        "LV30.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV30.lh",
        "LV4.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV4.lh",
        "LV5.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV5.lh",
        "LV6.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV6.lh",
        "LV7.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV7.lh",
        "LV8.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV8.lh",
        "LV9.lh": "res/3DScene/LayaScene_SampleScene/Conventional/LV9.lh",
        "MainCamera.lh": "res/3DScene/LayaScene_SampleScene/Conventional/MainCamera.lh",
        "MAP.lh": "res/3DScene/LayaScene_SampleScene/Conventional/MAP.lh",
        "NPC1.lh": "res/3DScene/LayaScene_SampleScene/Conventional/NPC1.lh",
        "NPC2.lh": "res/3DScene/LayaScene_SampleScene/Conventional/NPC2.lh",
        "NPC3.lh": "res/3DScene/LayaScene_SampleScene/Conventional/NPC3.lh",
        "SM_Prop_Barrier.lh": "res/3DScene/LayaScene_SampleScene/Conventional/SM_Prop_Barrier.lh",
        "SM_Prop_LightPole_Arm.lh": "res/3DScene/LayaScene_SampleScene/Conventional/SM_Prop_LightPole_Arm.lh",
        "SM_Prop_Sign_XXX.lh": "res/3DScene/LayaScene_SampleScene/Conventional/SM_Prop_Sign_XXX.lh",
        "start.lh": "res/3DScene/LayaScene_SampleScene/Conventional/start.lh",
        "xiaoche00.lh": "res/3DScene/LayaScene_SampleScene/Conventional/xiaoche00.lh",
        "xiaoche1.lh": "res/3DScene/LayaScene_SampleScene/Conventional/xiaoche1.lh",
        "xiaoche10.lh": "res/3DScene/LayaScene_SampleScene/Conventional/xiaoche10.lh",
        "xiaoche2.lh": "res/3DScene/LayaScene_SampleScene/Conventional/xiaoche2.lh",
        "xiaoche3.lh": "res/3DScene/LayaScene_SampleScene/Conventional/xiaoche3.lh",
        "xiaoche4.lh": "res/3DScene/LayaScene_SampleScene/Conventional/xiaoche4.lh",
        "xiaoche5.lh": "res/3DScene/LayaScene_SampleScene/Conventional/xiaoche5.lh",
        "xiaoche6.lh": "res/3DScene/LayaScene_SampleScene/Conventional/xiaoche6.lh",
        "xiaoche7.lh": "res/3DScene/LayaScene_SampleScene/Conventional/xiaoche7.lh",
        "xiaoche8.lh": "res/3DScene/LayaScene_SampleScene/Conventional/xiaoche8.lh",
        "xiaoche9.lh": "res/3DScene/LayaScene_SampleScene/Conventional/xiaoche9.lh",
        "yingdao.lh": "res/3DScene/LayaScene_SampleScene/Conventional/yingdao.lh",
        "zhangaiche1.lh": "res/3DScene/LayaScene_SampleScene/Conventional/zhangaiche1.lh",
        "zhangaiche2.lh": "res/3DScene/LayaScene_SampleScene/Conventional/zhangaiche2.lh",
        "zhangaiche3.lh": "res/3DScene/LayaScene_SampleScene/Conventional/zhangaiche3.lh"
    };
    let _ResPath = { "刹车.mp3": null, "喇叭.mp3": null, "引擎.mp3": null, "背景音乐2.mp3": null, "SampleSceneGIReflection.ltcb.ls": null, "SampleScene.ls": null, "Cube.lh": null, "DirectionalLight.lh": null, "lubiao.lh": null, "LV1.lh": null, "LV10.lh": null, "LV11.lh": null, "LV12.lh": null, "LV13.lh": null, "LV14.lh": null, "LV15.lh": null, "LV16.lh": null, "LV17.lh": null, "LV18.lh": null, "LV19.lh": null, "LV2.lh": null, "LV20.lh": null, "LV21.lh": null, "LV22.lh": null, "LV23.lh": null, "LV24.lh": null, "LV25.lh": null, "LV26.lh": null, "LV27.lh": null, "LV28.lh": null, "LV29.lh": null, "LV3.lh": null, "LV30.lh": null, "LV4.lh": null, "LV5.lh": null, "LV6.lh": null, "LV7.lh": null, "LV8.lh": null, "LV9.lh": null, "MainCamera.lh": null, "MAP.lh": null, "NPC1.lh": null, "NPC2.lh": null, "NPC3.lh": null, "SM_Prop_Barrier.lh": null, "SM_Prop_LightPole_Arm.lh": null, "SM_Prop_Sign_XXX.lh": null, "start.lh": null, "xiaoche00.lh": null, "xiaoche1.lh": null, "xiaoche10.lh": null, "xiaoche2.lh": null, "xiaoche3.lh": null, "xiaoche4.lh": null, "xiaoche5.lh": null, "xiaoche6.lh": null, "xiaoche7.lh": null, "xiaoche8.lh": null, "xiaoche9.lh": null, "yingdao.lh": null, "zhangaiche1.lh": null, "zhangaiche2.lh": null, "zhangaiche3.lh": null };
    const Package = { "3DScene": "3DScene", "sounds": "sounds" };
    const ResGet = new Proxy(_ResPath, {
        get: function (target, propKey, receiver) {
            let result = Laya.loader.getRes(ResPath[propKey]);
            return result ? result : null;
        }
    });
    let VIEWJSONPATH = ["View_Game.json", "View_GameOver.json", "View_Loading.json", "View_SelectLevel.json", "View_Setting.json"];
    class _LoadRes {
        constructor() {
            this.PackageLoadNum = 0;
            this.GetResState = 0;
            this.ResList = [];
            this.IsInit = false;
        }
        init(ResFn, PackFn) {
            if (LoadRes.IsInit === false) {
                LoadRes.IsInit = true;
                LoadRes.load(VIEWJSONPATH, LoadRes, null, null, 0);
                for (let ResName in ResPath) {
                    if (typeof ResFn == "function") {
                        if (ResFn(ResPath[ResName]))
                            LoadRes.ResList.push(ResPath[ResName]);
                    }
                    else {
                        LoadRes.ResList.push(ResPath[ResName]);
                    }
                }
                let PackageNameArr = [];
                for (let PackageName in Package) {
                    if (typeof PackFn == "function") {
                        if (PackFn(Package[PackageName]))
                            PackageNameArr.push(Package[PackageName]);
                    }
                    else {
                        PackageNameArr.push(PackageName);
                    }
                }
                LoadRes.DownloadAllPackage(PackageNameArr);
            }
        }
        load(url = [], caller = null, complete = null, progress = null, priority = 1) {
            Laya.loader.create(url, Laya.Handler.create(caller, complete), Laya.Handler.create(caller, progress), null, null, null, priority, true);
        }
        loadPackage(name = [], caller = null, complete = () => { }, progress = () => { }) {
            complete = complete.bind(caller);
            progress = progress.bind(caller);
            let _index = 0;
            let _seccess = 0;
            let _progress = [];
            DownloadSubpackage();
            Laya.timer.loop(100, LoadRes, AllLoadProgress);
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
                    Laya.timer.loop(100, LoadRes, LoadProgress);
                    function LoadProgress() {
                        if (_progress[index] >= 0.95) {
                            Laya.timer.clear(LoadRes, LoadProgress);
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
                    Laya.timer.loop(100, LoadRes, LoadProgress);
                    function LoadProgress() {
                        if (_progress[index] >= 0.95) {
                            Laya.timer.clear(LoadRes, LoadProgress);
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
                    Laya.timer.clear(LoadRes, AllLoadProgress);
                }
            }
        }
        DownloadAllPackage(PackageNameArr = []) {
            if (PackageNameArr.length >= 1) {
                LoadRes.loadPackage(PackageNameArr, LoadRes, (res) => {
                    LoadRes.LoadRes();
                }, (res) => {
                    LoadRes.PackageLoadNum = res;
                });
            }
            else {
                LoadRes.PackageLoadNum = 1;
                LoadRes.LoadRes();
            }
        }
        LoadRes() {
            let indexNum = 0;
            load();
            function load() {
                if (LoadRes.ResList.length <= indexNum) {
                    return;
                }
                if (LoadRes.GetResState) {
                    Laya.timer.frameOnce(100, LoadRes, load);
                }
                else if (Laya.loader.getRes(LoadRes.ResList[indexNum])) {
                    indexNum++;
                    Laya.timer.frameOnce(100, LoadRes, load);
                }
                else {
                    LoadRes.load([LoadRes.ResList[indexNum]], LoadRes, (res) => {
                        indexNum++;
                        Laya.timer.frameOnce(100, LoadRes, load);
                    }, null, 4);
                }
            }
        }
        ResState(resurlarr, caller, callback) {
            if (caller)
                callback = callback.bind(caller);
            LoadRes.init();
            LoadRes.GetResState++;
            let noLoadList = [];
            let noLoadListProgress = 0;
            resurlarr.forEach(item => {
                let result = Laya.loader.getRes(item);
                if (result == null) {
                    noLoadList.push(item);
                }
            });
            let progress = 1 - LoadRes.PackageLoadNum + 1 - noLoadListProgress;
            Laya.timer.frameLoop(1, LoadRes, load);
            function load() {
                if (LoadRes.PackageLoadNum >= 1 && noLoadList.length > 0) {
                    Laya.timer.clear(LoadRes, load);
                    LoadRes.load(noLoadList, LoadRes, (res) => {
                    }, (res) => {
                        noLoadListProgress = res;
                    }, 1);
                }
                else if (noLoadList.length == 0) {
                    noLoadListProgress = 1;
                    Laya.timer.clear(LoadRes, load);
                }
            }
            Laya.timer.frameLoop(1, LoadRes, result);
            function result() {
                let _progress = 1 - (1 - LoadRes.PackageLoadNum + 1 - noLoadListProgress) / progress;
                if (_progress >= 1) {
                    LoadRes.GetResState--;
                    Laya.timer.clear(LoadRes, result);
                }
                callback(_progress);
            }
        }
    }
    let LoadRes = new _LoadRes();

    class Ready {
        constructor() {
            LoadRes.init();
            EventControl$1.on(EventName.ShowUI, this, LoadRes.init);
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
            if (!_view) {
                _view = new _class();
                UIControl.Views.push(_view);
            }
            _view.name = _class.NAME;
            Laya.stage.addChild(_view);
            _view.visible = true;
            _view.active = true;
            if (_class.AUTO) {
                _view.addComponent(AutoPage);
            }
            EventControl$1.emit(EventName.ShowUI, _view.name);
            return _view;
        }
        HideUI(_class) {
            let _index = UIControl.GetUIIndexFromViews(_class.NAME);
            let _view = UIControl.Views[_index];
            if (_view) {
                Laya.stage.removeChild(_view);
                _view.visible = false;
                _view.active = false;
                EventControl$1.emit(EventName.HideUI, _view.name);
            }
        }
        RemoveUI(_class) {
            let _index = UIControl.GetUIIndexFromViews(_class.NAME);
            let _view = UIControl.Views[_index];
            if (_view) {
                UIControl.Views.splice(_index, 1);
                Laya.stage.removeChild(_view);
                Laya.timer.frameOnce(3, null, () => {
                    _view.destroy();
                    EventControl$1.emit(EventName.RemoveUI, _view.name);
                });
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
        class View_GameOverUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("View_GameOver");
            }
        }
        ui.View_GameOverUI = View_GameOverUI;
        REG("ui.View_GameOverUI", View_GameOverUI);
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
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(View_MainUI.uiView);
            }
        }
        View_MainUI.uiView = { "type": "View", "props": { "x": 0, "width": 1334, "top": 0, "right": 0, "left": 0, "height": 750, "bottom": 0 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "images/image_16.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 29 }, { "type": "Box", "props": { "var": "menu_view", "top": 0, "right": 0, "left": 0, "bottom": 0 }, "compId": 24, "child": [{ "type": "Button", "props": { "width": 60, "var": "btn_setting", "top": 20, "stateNum": 2, "skin": "images/image_2.png", "height": 60, "centerX": -500 }, "compId": 25 }, { "type": "Image", "props": { "var": "btn_start", "skin": "images/image_4.png", "right": 150, "centerY": -190, "centerX": 450 }, "compId": 26 }, { "type": "Image", "props": { "var": "btn_level", "skin": "images/image_32.png", "right": 150, "centerY": 13, "centerX": 450 }, "compId": 27 }, { "type": "Image", "props": { "var": "btn_more", "skin": "images/image_3.png", "right": 150, "centerY": 218, "centerX": 450 }, "compId": 28 }] }, { "type": "Box", "props": { "width": 727, "var": "skin_view", "mouseEnabled": true, "left": 100, "height": 524, "centerY": 14 }, "compId": 22, "child": [{ "type": "Image", "props": { "y": 0, "x": 94, "width": 541, "top": 0, "skin": "images/椭圆 1.png" }, "compId": 20, "child": [{ "type": "List", "props": { "y": 33, "x": 34, "width": 475, "var": "SkinList", "spaceX": 100, "repeatY": 1, "mouseEnabled": false, "height": 345, "hScrollBarSkin": "comp/hscroll.png" }, "compId": 57, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 474, "renderType": "render", "height": 345 }, "compId": 58, "child": [{ "type": "Image", "props": { "name": "CarImage", "centerX": 0, "bottom": 20 }, "compId": 59 }] }] }] }, { "type": "Image", "props": { "x": 27, "width": 53, "var": "btn_skin_left", "top": 160, "skin": "images/image_12.png", "pivotY": 45, "pivotX": 27, "height": 89 }, "compId": 21 }, { "type": "Image", "props": { "x": 696, "width": 53, "var": "btn_skin_right", "top": 160, "skin": "images/image_12.png", "rotation": 180, "pivotY": 45, "pivotX": 27, "height": 89 }, "compId": 23 }, { "type": "Image", "props": { "width": 175, "var": "btn_buy", "skin": "images/iamge_68.png", "height": 81, "centerX": 170, "bottom": 0 }, "compId": 52, "child": [{ "type": "Label", "props": { "y": 6, "x": 0, "valign": "middle", "text": "购买", "fontSize": 35, "font": "SimHei", "color": "#ffffff", "centerX": 0, "bold": true, "align": "center" }, "compId": 66 }, { "type": "Label", "props": { "y": 42, "width": 68, "var": "btn_buy_text", "valign": "middle", "text": "100", "height": 25, "fontSize": 25, "font": "SimHei", "color": "#ffffff", "centerX": 26, "bold": true, "align": "left" }, "compId": 67 }, { "type": "Sprite", "props": { "y": 42, "x": 51.5, "width": 25, "texture": "images/图层 263.png", "height": 25 }, "compId": 68 }] }, { "type": "Image", "props": { "width": 175, "visible": true, "var": "btn_buy_video", "skin": "images/iamge_68.png", "height": 81, "centerX": -170, "bottom": 0 }, "compId": 60, "child": [{ "type": "Label", "props": { "y": 6, "valign": "middle", "text": "解锁", "fontSize": 35, "font": "SimHei", "color": "#ffffff", "centerX": 0, "bold": true, "align": "center" }, "compId": 61 }, { "type": "Label", "props": { "y": 42, "var": "btn_buy_video_text", "valign": "middle", "text": "视频 0/10", "fontSize": 25, "font": "SimHei", "color": "#ffffff", "centerX": 0, "bold": true, "align": "center" }, "compId": 65 }] }] }, { "type": "Image", "props": { "width": 203, "top": 20, "skin": "images/image_70.png", "height": 72, "centerX": -300 }, "compId": 50, "child": [{ "type": "Label", "props": { "y": 18, "x": 88, "width": 99, "var": "coin_num", "valign": "middle", "text": "20", "height": 40, "fontSize": 40, "font": "SimHei", "color": "#ffffff", "bold": true, "align": "left" }, "compId": 51 }] }], "animations": [{ "nodes": [{ "target": 27, "keyframes": { "x": [{ "value": 987, "tweenMethod": "linearNone", "tween": true, "target": 27, "key": "x", "index": 0 }], "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 27, "key": "rotation", "index": 0 }, { "value": 360, "tweenMethod": "linearNone", "tween": true, "target": 27, "key": "rotation", "index": 60 }] } }], "name": "ani1", "id": 1, "frameRate": 60, "action": 2 }], "loadList": ["images/image_16.png", "images/image_2.png", "images/image_4.png", "images/image_32.png", "images/image_3.png", "images/椭圆 1.png", "comp/hscroll.png", "images/image_12.png", "images/iamge_68.png", "images/图层 263.png", "images/image_70.png"], "loadList3D": [] };
        ui.View_MainUI = View_MainUI;
        REG("ui.View_MainUI", View_MainUI);
        class View_SelectLevelUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("View_SelectLevel");
            }
        }
        ui.View_SelectLevelUI = View_SelectLevelUI;
        REG("ui.View_SelectLevelUI", View_SelectLevelUI);
        class View_SettingUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("View_Setting");
            }
        }
        ui.View_SettingUI = View_SettingUI;
        REG("ui.View_SettingUI", View_SettingUI);
    })(ui || (ui = {}));

    class CameraFollow extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.speedPos = 0.95;
            this.speedRot = 0.95;
        }
        onEnable() {
            this.Camera = this.owner;
        }
        setFollow(nodePos, nodeRot, speedPos = 0.95, speedRot = 0.95) {
            this.rot = nodeRot.transform.position;
            this.nodePos = nodePos;
            this.nodeRot = nodeRot;
            this.speedPos = speedPos;
            this.speedRot = speedRot;
        }
        onLateUpdate() {
            this.startFollow();
        }
        startFollow() {
            if (this.nodePos && this.nodePos) {
                let pos = this.slowAction(this.nodePos.transform.position, this.Camera.transform.position, this.speedPos);
                this.rot = this.slowAction(this.nodeRot.transform.position, this.rot, this.speedRot);
                this.Camera.transform.lookAt(this.rot, new Laya.Vector3(0, 1, 0));
                this.Camera.transform.position = pos;
            }
        }
        slowAction(Cube, Camera, speed) {
            let v3 = new Laya.Vector3();
            let offX = Camera.x - Cube.x;
            let offY = Camera.y - Cube.y;
            let offZ = Camera.z - Cube.z;
            v3.x = Cube.x + offX * speed;
            v3.y = Cube.y + offY * speed;
            v3.z = Cube.z + offZ * speed;
            return v3;
        }
    }

    class _Scenes3DControl {
        constructor() {
            this.NPC1 = null;
            this.NPC2 = null;
            this.NPC3 = null;
            this.zhangaiche1 = null;
            this.zhangaiche2 = null;
            this.zhangaiche3 = null;
        }
        ;
        init() {
            let ResData = [
                ResPath["SampleScene.ls"],
                ResPath["MAP.lh"],
                ResPath["MainCamera.lh"],
                ResPath["DirectionalLight.lh"],
                ResPath["NPC1.lh"],
                ResPath["NPC2.lh"],
                ResPath["NPC3.lh"],
                ResPath["zhangaiche1.lh"],
                ResPath["zhangaiche2.lh"],
                ResPath["zhangaiche3.lh"],
                ResPath["背景音乐2.mp3"],
                ResPath["引擎.mp3"],
                ResPath["喇叭.mp3"],
                ResPath["刹车.mp3"],
                ResPath["Cube.lh"]
            ];
            LoadRes.ResState(ResData, this, this.addNode);
        }
        addNode(res) {
            if (res != 1)
                return;
            this.Scene3D = Laya.stage.addChild(ResGet["SampleScene.ls"]);
            this.DirectionalLight = this.Scene3D.addChild(ResGet["DirectionalLight.lh"]);
            this.MainCamera = this.Scene3D.addChild(ResGet["MainCamera.lh"]);
            this.MAP = this.Scene3D.addChild(ResGet["MAP.lh"]);
            this.Scene3D.addChild(ResGet["Cube.lh"]);
            this.NPC1 = this.Scene3D.addChild(ResGet["NPC1.lh"]);
            this.NPC2 = this.Scene3D.addChild(ResGet["NPC2.lh"]);
            this.NPC3 = this.Scene3D.addChild(ResGet["NPC3.lh"]);
            this.zhangaiche1 = ResGet["zhangaiche1.lh"];
            this.zhangaiche2 = ResGet["zhangaiche2.lh"];
            this.zhangaiche3 = ResGet["zhangaiche3.lh"];
            this.Scene3D.zOrder = -1;
            this.MainCamera.enableHDR = false;
            this.MainCamera.addComponent(CameraFollow);
        }
    }
    const Scenes3DControl = new _Scenes3DControl();

    class View_Game extends ui.View_GameUI {
        constructor() {
            super(...arguments);
            this.test_text = "View_Game";
        }
        onAwake() {
            console.log("222=====>", this.test_text);
        }
    }
    View_Game.NAME = "View_Game";
    View_Game.AUTO = true;

    class View_Main extends ui.View_MainUI {
        constructor() {
            super(...arguments);
            this.test_text = "View_Main";
        }
        onAwake() {
            Scenes3DControl.init();
            console.log("222=======>", this.test_text);
            Laya.stage.once(Laya.Event.CLICK, this, () => {
                let _View_Game = UIControl.ShowUI(View_Game);
                console.log("111=======>", _View_Game.test_text);
                _View_Game.test_text = "Engine.ts";
            });
        }
    }
    View_Main.NAME = "View_Main";
    View_Main.AUTO = true;

    class Engine extends Ready {
        constructor() {
            super();
            EventControl$1.on(EventName.ShowUI, this, (name) => {
                console.log("显示页面：", name);
            });
            EventControl$1.on(EventName.HideUI, this, (name) => {
                console.log("隐藏页面：", name);
            });
            EventControl$1.on(EventName.RemoveUI, this, (name) => {
                console.log("关闭页面：", name);
            });
            let _View_Main = UIControl.ShowUI(View_Main);
            console.log("111=======>", _View_Main.test_text);
            _View_Main.test_text = "Engine.ts";
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
    GameConfig.startScene = "View_Main.scene";
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
