export default class GlobleTouch {
    public static touches: { enable: boolean, x: number, y: number }[] = [];
    private rate = 0;
    constructor() {
        this.rate = Laya.stage.width / Laya.Browser.clientWidth;
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.SetMouse);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.SetMouse);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.DragEnd);
    }

    private SetMouse(evt: Laya.Event) {
        if (!evt.nativeEvent.changedTouches) return;
        let _touch;

        for (let i = 0; i < evt.nativeEvent.changedTouches.length; i++) {
            console.log(evt)
            if (evt.nativeEvent.changedTouches[i].identifier == evt.touchId) {
                _touch = evt.nativeEvent.changedTouches[i];
                break;
            }
        }
        let _body = {
            enable: true,
            x: _touch.clientX,
            y: _touch.clientY
        };
        GlobleTouch.touches[evt.touchId] = _body;
    }

    private DragEnd(evt: laya.events.Event) {
        let _index = evt.touchId;
        let _body =
        {
            enable: false,
            x: 0,
            y: 0
        };
        GlobleTouch.touches[_index] = _body;
    }

}