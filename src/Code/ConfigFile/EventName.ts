/** 事件清单 */
class _EventName {
    //========框架内置事件==========
    /** 写入LocalData */
    public SetLocalData: string = "SetLocalData"
    /** 读取LocalData */
    public GetLocalData: string = "GetLocalData"
    /** 界面显示 */
    public ShowUI: string = "ShowUI"
    /** 界面隐藏 */
    public HideUI: string = "HideUI"
    /** 界面关闭 */
    public RemoveUI: string = "RemoveUI"

    //=========自定义事件=========
    /** 加载进度 传参  0 - 1 */
    public Loading_progress: string = "Loading_progress";
    /** 显示打开(open)/显示关闭(close)/全部隐藏(hide) */
    public DoorSwitch: string = "DoorSwitch";
    /** 进入上/下车区域   参数：UP/DOWN*/
    public Car_UP_Down: string = "Car_UP_Down";
    /**  发生车祸 */
    public Car_Accident: string = "Car_Accident";
    /** 进入红绿灯区域 */
    public Car_RedLight: string = "Car_RedLight";
    /** 进入一个存档点 */
    public Car_Archive: string = "Car_Archive";
    /** 游戏判断结束 (true/false,"text")*/
    public GameOver: string = "GameOver";
}
const EventName = new _EventName()
export default EventName