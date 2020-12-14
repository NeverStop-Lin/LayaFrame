
abstract class TweenBase extends Laya.Script3D {

    /** 运动时间 */
    public time:number=1;

    /**初始坐标 */
    public form:Laya.Vector3 =null ;

    /**移动到的坐标 */
    public to:Laya.Vector3 = new Laya.Vector3(0,0,0);


    /**改变的类型 tween.transform */
    protected ChangeType:string=transform.position;

    /**移动类型  tween.TweenMore.*/
    public More:number=0;

    /**运动模式 Laya.Ease.*/
    public Ease=Laya.Ease.linearNone;

    /**用来存数据 */
    public Data:any;

    public fun:any=null;

    private tween:laya.utils.Tween=null;

    private tran:Laya.Transform3D;

    private HuanVe3:Laya.Vector3=new Laya.Vector3(0,0,0);
    private IslineHuan:boolean=false;
    onAwake(){
        this.init();
    }
    init(){
        var obj= this.owner as Laya.Sprite3D;
        this.tran=obj.transform;
    }

    public start(){
        console.log("重新播放：");
        
        if(this.tran==null){
            this.init();
        }

        if(this.form==null){
            this.form=this.tran[this.ChangeType].clone();
        }

        if(this.tween!=null){
            this.tween=null;
        }
        Laya.Tween.clearAll(this);
        this.HuanVe3=this.form.clone();
        this.IslineHuan=false;
        this.tween= Laya.Tween.to(this.HuanVe3,{x:this.to.x,y:this.to.y,z:this.to.z,update:Laya.Handler.create(this,()=>{
            //console.log("更新坐标：",this.HuanVe3);
            
            if(this.ChangeType!=transform.scale){
                this.tran[this.ChangeType]=this.HuanVe3;
            }else{
                this.tran.setWorldLossyScale(this.HuanVe3);
            }
        },null,false)},this.time*1000,this.Ease,Laya.Handler.create(this, this.setFinish))
    }

    private setFinish(){
        if(this.fun!=null){
            this.fun(this.Data);
        }
        switch (this.More) {
            case TweenAll.TweenMore.one:
                Laya.Tween.clearAll(this);
                break;
            case TweenAll.TweenMore.loop:
                this.start();
                break;
            case TweenAll.TweenMore.lineOne:
                Laya.Tween.clearAll(this);
                let tov:Laya.Vector3=null;
                if(this.IslineHuan==false){
                    this.HuanVe3=this.to.clone();
                    tov=this.form.clone();
                    this.tween= Laya.Tween.to(this.HuanVe3,{x:tov.x,y:tov.y,z:tov.z,update:Laya.Handler.create(this,()=>{
                        if(this.ChangeType!=transform.scale){
                            this.tran[this.ChangeType]=this.HuanVe3;
                        }else{
                            this.tran.setWorldLossyScale(this.HuanVe3);
                        }
                    },null,false)},this.time*1000,this.Ease,Laya.Handler.create(this, this.setFinish))
                    this.IslineHuan=true;
                }
                break;
            case TweenAll.TweenMore.lineloop:
                Laya.Tween.clearAll(this);
                let toloop:Laya.Vector3=null;
                if(this.IslineHuan==false){
                    this.HuanVe3=this.to.clone();
                    toloop=this.form.clone();
                    this.IslineHuan=true;
                }else{
                    toloop=this.to.clone();
                    this.HuanVe3=this.form.clone();
                    this.IslineHuan=false;
                }
                this.tween= Laya.Tween.to(this.HuanVe3,{x:toloop.x,y:toloop.y,z:toloop.z,update:Laya.Handler.create(this,()=>{
                    if(this.ChangeType!=transform.scale){
                        this.tran[this.ChangeType]=this.HuanVe3;
                    }else{
                        this.tran.setWorldLossyScale(this.HuanVe3);
                    }
                },null,false)},this.time*1000,this.Ease,Laya.Handler.create(this, this.setFinish))
                break;
            default:
                break;
        }

    }

    public pause(){
        if(this.tween!=null){
            this.tween.pause();
        }
    }

    public contine(){
        if(this.tween!=null){
            this.tween.resume();
        }
    }

    public Stop(){
        Laya.Tween.clearAll(this);
    }

    onDestroy(){
        Laya.Tween.clearAll(this);
    }
}

class transform {
    public static position:string="position";
    public static localPosition:string="localPosition";
    public static rotationEuler:string="rotationEuler";
    public static localRotationEuler:string="localRotationEuler";
    public static scale:string="scale";
    public static localScale:string="localScale";
}

class TweenMore{
    
    /** 运行一次 */
    public static one:number = 0;

    /** 循环 */
    public static loop:number = 1;

    /** 周期一次缓动  */
    public static lineOne:number = 2;

    /**周期缓动循环  */
    public static lineloop :number = 3;
}

class TweenPos extends TweenBase{
    constructor() {
        super();
        this.ChangeType=transform.localPosition;
    }
    private _isWordSpace=false;
    set isWordSpace(value:boolean){
        this._isWordSpace=value;
        if(value==false){
            this.ChangeType=transform.localPosition;
        }else{
            this.ChangeType=transform.position;
        }
    }
    get isWordSpace():boolean{
        return this._isWordSpace;
    }
}

class TweenRotation extends TweenBase{
    constructor() {
        super();
        this.ChangeType=transform.localRotationEuler;
    }
    private _isWordSpace=false;
    set isWordSpace(value:boolean){
        this._isWordSpace=value;
        if(value==false){
            this.ChangeType=transform.localRotationEuler;
        }else{
            this.ChangeType=transform.rotationEuler;
        }
    }
    get isWordSpace():boolean{
        return this._isWordSpace;
    }
}

class TweenScale extends TweenBase{
    constructor() {
        super();
        this.ChangeType=transform.localScale;
    }
    private _isWordSpace=false;
    set isWordSpace(value:boolean){
        this._isWordSpace=value;
        if(value==false){
            this.ChangeType=transform.localScale;
        }else{
            this.ChangeType=transform.scale;
        }
    }
    get isWordSpace():boolean{
        return this._isWordSpace;
    }
}

var TweenAll = {
    TweenPos: TweenPos,
    TweenScale: TweenScale,
    TweenRotation: TweenRotation,
    TweenMore:TweenMore,
    
}
export default TweenAll;