/** 事件清单 */
class _EventName {
    //========框架内置事件==========
    /** 框架内置事件 */
    public Frame={
        /** 写入LocalData */
        SetLocalData:"SetLocalData",
        /** 读取LocalData */
        GetLocalData:"GetLocalData",
        /** 界面显示 */
        ShowUI:"ShowUI",
        /** 界面隐藏 */
        HideUI:"HideUI",
        /** 界面关闭 */
        RemoveUI:"RemoveUI",
    }
    //=========自定义事件=========
    /** 测试 */
    public Test: string = "Test";

}
/** 事件清单 */
const EventName = new _EventName()
export default EventName