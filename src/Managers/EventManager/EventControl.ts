
/**
 * 事件系统
 */
export class EventListener {
    static eventDispatcher: Laya.EventDispatcher = new Laya.EventDispatcher();
    ///注册事件
    public static Emit(InName, ...agv: any[]) {
        //派发事件
        EventListener.eventDispatcher.event(InName, agv);
    }
    //侦听事件
    public static AddNotice(InName, caller, listener: Function, arg?: any[]): void {
        EventListener.eventDispatcher.on(InName, caller, listener, (arg == null) ? null : ([arg]));
    }
    /**
     * 从 EventDispatcher 对象中删除侦听器。
     * @param InName		事件的类型。
     * @param caller	事件侦听函数的执行域。
     * @param listener	事件侦听函数。
     * @return 此 EventDispatcher 对象。
     */
    public static RemoveNotice(InName, caller, listener: Function) {
        EventListener.eventDispatcher.off(InName, caller, listener);
    }
    /**
     * 移除caller为target的所有事件监听
     * @param	caller caller对象
     */
    public static RemoveAllNotice(caller) {
        EventListener.eventDispatcher.offAllCaller(caller);
    }
}