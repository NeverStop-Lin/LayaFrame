
class UtilTool2d {
    /**  自适应
    * @param  m_currView view
    */
    viewAuto(m_currView) {
        m_currView.width = Laya.stage.width;
        m_currView.height = Laya.stage.height;

    }

    on(scr, btn, fun, ty = btnType.scale, isSetCenter = true) {
        if (ty != btnType.normal) {
            btn.pivotY = btn.height / 2;
            btn.pivotX = btn.width / 2;
        }

        let scalex = btn.scaleX;
        let scaley = btn.scaleY;

        btn.on(Laya.Event.MOUSE_DOWN, scr, (e: Laya.Event) => {
            if (ty == btnType.scale) {
                btn.scaleX = scalex + 0.2;
                btn.scaleY = scaley + 0.2;
            } else if (ty == btnType.color) {
                btn.blendMode = Laya.BlendMode.LIGHTER;
            }
        })

        // btn.on(Laya.Event.MOUSE_MOVE, this, (e: Laya.Event) => {
        //     fun(e);
        // })
        btn.on(Laya.Event.MOUSE_OUT, scr, (e: Laya.Event) => {
            if (ty == btnType.scale) {
                btn.scaleX = scalex;
                btn.scaleY = scaley;
            } else if (ty == btnType.color) {
                btn.blendMode = null;
            }
        })
        btn.on(Laya.Event.MOUSE_UP, scr, (e: Laya.Event) => {
            if (ty == btnType.scale) {
                btn.scaleX = scalex;
                btn.scaleY = scaley;
            } else if (ty == btnType.color) {
                btn.blendMode = null;
            }
            fun(e);
        })
    }

}

class btnType {
    public static scale = "scale";
    public static color = "color";
    public static normal = "normal";
}
var Tools_2dutil = {
    btnType: btnType,
    util: new UtilTool2d(),

}
export default Tools_2dutil