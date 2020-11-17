/** 事件系统 */
class _EventListener {
    /** 事件调度器 */
    public eventDispatcher: Laya.EventDispatcher = new Laya.EventDispatcher();


    /**
     * 派发事件
     * @param InName 事件类型
     * @param (可选）回调数据。注意：如果是需要传递多个参数 p1,p2,p3,...可以使用数组结构如：[p1,p2,p3,...] ；如果需要回调单个参数 p ，且 p 是一个数组，则需要使用结构如：[p]，其他的单个参数 p ，可以直接传入参数 p。
     * @return 此事件类型是否有侦听者，如果有侦听者则值为 true，否则值为 false。
     */
    public emit(InName, ...agv: any[]) {
        return EventListener.eventDispatcher.event(InName, agv);//派发事件
    }
    /**
     * 侦听器，侦听事件
     * @param InName   事件的类型
     * @param caller   事件侦听函数的执行域
     * @param listener 事件侦听函数
     * @param arg      （可选）事件侦听函数的回调参数
     */
    public on(InName: string, caller, listener: Function, arg?: any[]): void {
        EventListener.eventDispatcher.on(InName, caller, listener, (arg == null) ? null : ([arg]));
    }
    /**
     * 从 EventDispatcher 对象中删除侦听器。
     * @param InName		事件的类型。
     * @param caller	事件侦听函数的执行域。
     * @param listener	事件侦听函数。
     * @return 此 EventDispatcher 对象。
     */
    public off(InName, caller, listener: Function) {
        EventListener.eventDispatcher.off(InName, caller, listener);
    }
    /**
     * 移除caller为target的所有事件监听
     * @param	caller caller对象
     */
    public offAll(caller) {
        EventListener.eventDispatcher.offAllCaller(caller);
    }
}
/** 事件系统 */
const EventListener = new _EventListener()
export default EventListener