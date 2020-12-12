/** 工具类 */
class _Tools {

    /**返回当前平台 
     * "wx" == 微信小游戏,"tt" == 头条小游戏,"other"" == 其他 
     */
    get getPlatform(): string {
        if (Laya.Browser.window.qq && typeof Laya.Browser.window.qq.getSystemInfoSync == "function" && Laya.Browser.window.qq.getSystemInfoSync().benchmarkLevel) {
            return "qq"
        }
        else if (Laya.Browser.window.tt && typeof Laya.Browser.window.tt.getSystemInfoSync == "function" && Laya.Browser.window.tt.getSystemInfoSync().safeArea) {
            return "tt"
        }
        else if (Laya.Browser.window.wx && typeof Laya.Browser.window.wx.getSystemInfoSync == "function" && Laya.Browser.window.wx.getSystemInfoSync().benchmarkLevel) {
            return "wx"
        } else {
            return "other"
        }
    }



}
let Tools: _Tools = new _Tools()
export default Tools