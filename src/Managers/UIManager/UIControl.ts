import { ui } from "../../ui/layaMaxUI";

export default class UIManager {

    /** 场景中的页面列表 */
    private static Views: Laya.Scene[] = [];

    /**显示UI 
     * @param _class UI类名
     * @template T 返回类型
    */
    public static ShowUI<T extends Laya.Scene>(_class: any): T {
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
        return _view as T;
    }

    /**隐藏UI
     * @param _class UI类名
     */
    public static HideUI(_class: any) {
        let _index = UIManager.GetUIIndexFromViews(_class.NAME);
        let _view = UIManager.Views[_index];
        if (_view) {
            Laya.stage.removeChild(_view);
            _view.visible = false;
            _view.active = false;
        }
    }

    /**移除UI
    * @param _class UI类名
    */
    public static RemoveUI(_class: any) {
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

    /**返回传入页面名字在UIManager.Views中首次出现的下标值
     * @param _names 页面名字
     */
    private static GetUIIndexFromViews(_names: string): number {
        return UIManager.Views.findIndex(_ui => {
            return _ui.name == _names;
        })
    }
}

