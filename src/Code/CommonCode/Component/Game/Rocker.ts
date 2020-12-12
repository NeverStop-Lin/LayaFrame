
export default class Rocker extends Laya.Script {
    /** 转盘 */
    private RockerImg: Laya.Image;
    /** 转盘旋转的度数 */
    public degrees: number = 0;
    /** 外部函数监听角度变化 */
    private degrees_cb: Function = null;
    /** 起始点 */
    private starPos = new Laya.Vector2(0, 0);
    /** 转盘端点 */
    private centerPos = new Laya.Vector2(0, 0);
    /** 相对轴端点 */
    private Xcenter = new Laya.Vector2;
    onAwake() {
        this.RockerImg = this.owner as Laya.Image;

        this.initData();
        this.addMouseEvent();
    }

    private initData() {

        this.RockerImg.x += this.RockerImg.width / 2 - this.RockerImg.pivotX
        this.RockerImg.y += this.RockerImg.height / 2 - this.RockerImg.pivotY

        this.RockerImg.pivotX = this.RockerImg.width / 2
        this.RockerImg.pivotY = this.RockerImg.height / 2

        this.centerPos.x = this.RockerImg.x;
        this.centerPos.y = this.RockerImg.y;


        this.RockerImg.rotation = 0;
        this.degrees = this.RockerImg.rotation
        this.Xcenter = new Laya.Vector2(this.centerPos.x + 5, this.centerPos.y);

    }

    /**添加鼠标事件 */
    private addMouseEvent() {
        this.RockerImg.on(Laya.Event.MOUSE_DOWN, this, (res) => {
            this.starPos.x = res.stageX;
            this.starPos.y = res.stageY;

        })
        this.RockerImg.on(Laya.Event.MOUSE_MOVE, this, this.rockerEvent);
        this.RockerImg.on(Laya.Event.MOUSE_UP, this, () => {
            Laya.timer.frameLoop(1, this, this.reStore);
        })
        this.RockerImg.on(Laya.Event.MOUSE_OUT, this, () => {
            Laya.timer.frameLoop(1, this, this.reStore);
        })
    }

    /** 转动事件 */
    private rockerEvent(res) {
        Laya.timer.clear(this, this.reStore);
        let _pos = new Laya.Vector2(0, 0);
        /** 计算角度 */
        _pos.x = res.stageX
        _pos.y = res.stageY
        let _angle = this.Angle(this.centerPos, this.starPos, _pos);
        /** 更新图片 */
        if (Math.abs(this.RockerImg.rotation) <= 360) {
            this.RockerImg.rotation += _angle;
            this.degrees = this.RockerImg.rotation
            if (this.RockerImg.rotation > 360) {
                this.RockerImg.rotation = 360;
            }
            else if (this.RockerImg.rotation < -360) {
                this.RockerImg.rotation = -360;
            }

            if (typeof this.degrees_cb == "function") {
                this.degrees_cb(this.degrees);
            }
        }
        /** 更新计算 */
        this.starPos.x = res.stageX;
        this.starPos.y = res.stageY;
    }

    /** 计算夹角 */
    private Angle(centerPos, starPos, EndPos) {
        let scx = starPos.x - centerPos.x;
        let scy = starPos.y - centerPos.y;
        let ecx = EndPos.x - centerPos.x;
        let ecy = EndPos.y - centerPos.y;

        let cosfi = scx * ecx + scy * ecy;

        let norm = (scx * scx + scy * scy) * (ecx * ecx + ecy * ecy)
        cosfi /= Math.sqrt(norm);

        if (cosfi >= 1.0) return 0;
        if (cosfi <= -1.0) return Math.PI;
        let fi = Math.acos(cosfi);

        let StarRotate
        let EndRotate

        if (scx > 0 && ecx > 0) {
            StarRotate = this.countAngle(centerPos, this.Xcenter, starPos);
            EndRotate = this.countAngle(centerPos, this.Xcenter, EndPos);
            if (scy < 0 && ecy < 0) {
                if (EndRotate > StarRotate) {
                    fi = -fi;
                }
            }
            else if (scy > 0 && ecy > 0) {
                if (EndRotate < StarRotate)
                    fi = -fi;
            }
            else if (scy > 0 && ecy < 0) {
                fi = -fi;
            }
        }
        else if (scx < 0 && ecx < 0) {
            StarRotate = this.countAngle(centerPos, this.Xcenter, starPos);
            EndRotate = this.countAngle(centerPos, this.Xcenter, EndPos);
            if (scy > 0 && ecy > 0) {
                if (EndRotate < StarRotate)
                    fi = -fi;
            }
            if (scy < 0 && ecy < 0) {
                if (EndRotate > StarRotate) {
                    fi = -fi;
                }
            }
            else if (scy < 0 && ecy > 0) {
                fi = -fi;
            }
        }
        else if (scx < 0 && scy > 0 && ecx > 0 && ecy > 0) {
            fi = -fi;
        }
        else if (scx > 0 && scy < 0 && ecx < 0 && ecy < 0) {
            fi = -fi
        }


        if (180 * fi / Math.PI < 180) {
            return 180 * fi / Math.PI;
        }
        else {
            return 360 - 180 * fi / Math.PI
        }

    }

    /** 计算角度 */
    private countAngle(centerPos, starPos, EndPos) {
        let scx = starPos.x - centerPos.x;
        let scy = starPos.y - centerPos.y;
        let ecx = EndPos.x - centerPos.x;
        let ecy = EndPos.y - centerPos.y;

        let cosfi = scx * ecx + scy * ecy;

        let norm = (scx * scx + scy * scy) * (ecx * ecx + ecy * ecy)
        cosfi /= Math.sqrt(norm);

        if (cosfi >= 1.0) return 0;
        if (cosfi <= -1.0) return Math.PI;
        let fi = Math.acos(cosfi);
        if (180 * fi / Math.PI < 180) {
            return 180 * fi / Math.PI;
        }
        else {
            return 360 - 180 * fi / Math.PI
        }
    }

    /** 方向盘自动还原 */
    private reStore() {
        if (this.RockerImg.rotation != 0) {
            let isLeft = this.RockerImg.rotation > 0 ? false : true;
            if (isLeft) {
                this.RockerImg.rotation += 10;
            }
            else {
                this.RockerImg.rotation -= 10;
            }

            if (Math.abs(this.RockerImg.rotation) <= 10) {
                this.RockerImg.rotation = 0;
                Laya.timer.clear(this, this.reStore);
            }
            this.degrees = this.RockerImg.rotation;
            if (typeof this.degrees_cb == "function") {
                this.degrees_cb(this.degrees);
            }
        }
    }

    /** 用于外部设置  监听角度变化函数 */
    public setchangeCarRotate(degrees_cb) {
        if (typeof degrees_cb == "function") {
            this.degrees_cb = degrees_cb
        }
    }
}
