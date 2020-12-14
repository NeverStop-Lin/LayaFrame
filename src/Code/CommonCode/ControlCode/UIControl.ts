import EventName from "../../ConfigFile/EventName";
import AutoPage from "../Component/UiView/AutoPage";
import EventControl from "./EventControl";

class _UIControl {
    /** 场景中的页面列表 */
    private Views: Laya.Scene[] = [];

    /**显示UI界面 ++++++++++++++++++++++++++++++++++++++++
     * @param _class UI类名
     * @template T 返回类型
    */
    public ShowUI<T extends Laya.Scene>(_class: any, data?: any): T {

        let _index = UIControl.GetUIIndexFromViews(_class.NAME);
        let _view:any = UIControl.Views[_index];
        _class.DATA = data
        if (!_view) {
            _view = new _class(data);
            UIControl.Views.push(_view);
        }
        _view.name = _class.NAME;
        Laya.stage.addChild(_view) as Laya.Scene;
        _view.visible = true;
        _view.active = true;
        if (_class.AUTO) {
            _view.addComponent(AutoPage)
        }
        EventControl.emit(EventName.Frame.ShowUI, _view.name)
        return _view as T;
    }

    /**隐藏UI界面
     * @param _class UI类名
     */
    public HideUI(_class: any) {
        let _index = UIControl.GetUIIndexFromViews(_class.NAME);
        let _view = UIControl.Views[_index];
        if (_view) {
            Laya.stage.removeChild(_view);
            _view.visible = false;
            _view.active = false;
            EventControl.emit(EventName.Frame.HideUI, _view.name)
        }
    }

    /**移除UI界面
    * @param _class UI类名
    */
    public RemoveUI(_class: any) {
        let _index = UIControl.GetUIIndexFromViews(_class.NAME);
        let _view = UIControl.Views[_index];
        if (_view) {
            Laya.stage.removeChild(_view);
            _view.visible = false;
            _view.active = false;
            _class.DATA = null
            Laya.timer.clearAll(_view);
            Laya.stage.offAllCaller(_view);
            EventControl.offAll(_view);
            UIControl.Views.splice(_index, 1);
            Laya.timer.frameOnce(10, null, () => {
                _view.destroy();
                EventControl.emit(EventName.Frame.RemoveUI, _view.name)
            });
        }
    }

    /**获取UI界面实例，没有则返回null
    * @param _class UI类名
    */
    GetUI<T extends Laya.Scene>(_name: any) {
        let _index = UIControl.GetUIIndexFromViews(_name.name);
        let _view = UIControl.Views[_index];
        if (_view) { return _view as T }
        else { return null as T }
    }

    /**返回传入页面名字在UIControl.Views中首次出现的下标值
     * @param _names 页面名字
     */
    private GetUIIndexFromViews(_names: string): number {
        return UIControl.Views.findIndex(_ui => {
            return _ui.name == _names;
        })
    }
}
const UIControl = new _UIControl()
export default UIControl
