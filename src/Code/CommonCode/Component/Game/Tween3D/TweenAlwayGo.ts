

export default class $kcr_TweenAlwayGo extends Laya.Script3D {


    /**移动的速度 */
    public AlwaygoSpeed:number=1;

    public AlwaygoPos:Laya.Vector3=new Laya.Vector3(0,0,0);

    public Data:any;

    public startTime:number=0.03;

    public IsWorldSpare=false;

    public LaterLitte:number=1;

    private tran:Laya.Transform3D=null;

    public UpdateFix=0.02;


    constructor() {
        super();
        
    }
    onAwake(){
        var obj= this.owner as Laya.Sprite3D;
        this.tran=obj.transform;
    }

    onStart(){

    }

    IsMove:boolean=false;

    public RePlay()
    {
        if(this.IsStart==false){
            this.IsStart=true;
            if(this.tran==null){
                var obj= this.owner as Laya.Sprite3D;
                this.tran=obj.transform;
            }
            //this.IsMove=true;

            this.StartTween(this.startTime);
            
        }else{
            this.IsMove=true;
        }
    }

    public StopPlay(){
        this.IsMove=false;
    }

    public Play(){
        this.IsMove=true;
    }

    IsStart=false;

    private StartTween(t:number){
        this.IsMove=false;
        //console.log(">>>>>>>>>>>"+t);
        
        Laya.timer.once((t+0.03)*1000,this,function starts(){
            this.alwayGo();
        },[],true);
    }

    onUpdate(){
        if(this.IsMove==true){
            //this.update();
            //this.testUpdate();
        }
    }
    private oripos:Laya.Vector3=new Laya.Vector3(0,0,0);
    private tranpo:Laya.Vector3=new Laya.Vector3(0,0,0);
    update(){

        if(this.tran != null)
        {
            if(this.IsWorldSpare==true){
                //console.log("oripos>>1>>",this.oripos);
                
                this.oripos.x=this.tran.position.x;
                this.oripos.y=this.tran.position.y;
                this.oripos.z=this.tran.position.z;

                //console.log("oripos>>2>>",this.oripos);
                //oripos=new Laya.Vector3(this.tran.position.x,this.tran.position.y,this.tran.position.z);
            }else{
                this.oripos.x=this.tran.localPosition.x;
                this.oripos.y=this.tran.localPosition.y;
                this.oripos.z=this.tran.localPosition.z;
                //oripos=new Laya.Vector3(this.tran.localPosition.x,this.tran.localPosition.y,this.tran.localPosition.z);
            }
            let x:number =  this.oripos.x + this.AlwaygoPos.x*0.02*this.AlwaygoSpeed;
            let y:number =  this.oripos.y + this.AlwaygoPos.y*0.02*this.AlwaygoSpeed;
            let z:number =  this.oripos.z + this.AlwaygoPos.z*0.02*this.AlwaygoSpeed;
            this.tranpo.x=x;
            this.tranpo.y=y;
            this.tranpo.z=z;
            //console.log("localPosition>>1>>",this.tran.localPosition);
            if(this.IsWorldSpare==true){
                // this.tran.position.x=x;
                // this.tran.position.y=y;
                // this.tran.position.z=z;
                this.tran.position =this.tranpo;
            }else{
                // this.tran.localPosition.x=x;
                // this.tran.localPosition.y=y;
                // this.tran.localPosition.z=z;
                this.tran.localPosition =this.tranpo;
                //this.tran.localPosition = new Laya.Vector3(x, y, z);
            }
        }
    }
    private alwayGo(){    
        this.IsMove=true;
        Laya.timer.loop(this.UpdateFix,this,function ss(){
            if(this.tran==null){
                Laya.timer.clear(this,ss);
            }
            if(this.IsMove==true){

                if (this.startT > this.time)
                {
                    this.startT = 0;
                }
                if ( this.tran != null)
                {
                    let oripos:Laya.Vector3=new Laya.Vector3(this.tran.localPosition.x,this.tran.localPosition.y,this.tran.localPosition.z);
                    if(this.IsWorldSpare==true){
                        oripos=new Laya.Vector3(this.tran.position.x,this.tran.position.y,this.tran.position.z);
                    }
                    let x:number =  oripos.x + this.AlwaygoPos.x*0.02*this.AlwaygoSpeed;
                    let y:number =  oripos.y + this.AlwaygoPos.y*0.02*this.AlwaygoSpeed;
                    let z:number =  oripos.z + this.AlwaygoPos.z*0.02*this.AlwaygoSpeed;
                    if(this.IsWorldSpare==true){
                        this.tran.position=new Laya.Vector3(x, y, z);
                    }else{
                        this.tran.localPositionX=x;
                        this.tran.localPositionY=y;
                        this.tran.localPositionZ=z;
                    }
                }
            }
    
        },[],true);
        
    }

}
