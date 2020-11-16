(function () {
    'use strict';

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1334;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Views/View_Loading.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    var View = Laya.View;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var Views;
        (function (Views) {
            class View_LoadingUI extends View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("Views/View_Loading");
                }
            }
            Views.View_LoadingUI = View_LoadingUI;
            REG("ui.Views.View_LoadingUI", View_LoadingUI);
        })(Views = ui.Views || (ui.Views = {}));
    })(ui || (ui = {}));

    class LoadingView extends ui.Views.View_LoadingUI {
        onAwake() {
        }
    }
    LoadingView.NAME = "View_Loading";

    class UIManager {
        static ShowUI(_class) {
            let _index = UIManager.GetUIIndexFromViews(_class.NAME);
            let _view = UIManager.Views[_index];
            if (!_view) {
                _view = new _class();
                UIManager.Views.push(_view);
            }
            _view.name = _class.NAME;
            Laya.stage.addChild(_view);
            _view.visible = true;
            _view.active = true;
            return _view;
        }
        static HideUI(_class) {
            let _index = UIManager.GetUIIndexFromViews(_class.NAME);
            let _view = UIManager.Views[_index];
            if (_view) {
                Laya.stage.removeChild(_view);
                _view.visible = false;
                _view.active = false;
            }
        }
        static RemoveUI(_class) {
            let _index = UIManager.GetUIIndexFromViews(_class.NAME);
            let _view = UIManager.Views[_index];
            if (_view) {
                UIManager.Views.splice(_index, 1);
                Laya.stage.removeChild(_view);
                Laya.timer.frameOnce(3, null, () => {
                    _view.destroy();
                });
            }
        }
        static GetUIIndexFromViews(_names) {
            return UIManager.Views.findIndex(_ui => {
                return _ui.name == _names;
            });
        }
    }
    UIManager.Views = [];

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
            UIManager.ShowUI(LoadingView);
        }
    }
    new Main();

}());
