export default class TaskManager
{
    private mCount = 0;
    private mTotalCount = 0;
    private mFinishedCallBack:Laya.Handler;
    private mProgress:Laya.Handler;
    constructor(_tasks:Laya.Handler[],_complete:Laya.Handler,_progress?:Laya.Handler)
    {
        this.mTotalCount = _tasks.length;
        if(this.mTotalCount == 0)
        {
            _complete && _complete.run();
            return;
        }
        this.mFinishedCallBack = _complete;
        this.mProgress = _progress;
        _tasks.forEach(element => {
            element.caller = this;
            element.method = this.complete;
        });
    }

    private complete()
    {
        this.mCount++;
        let _arg = this.mCount / this.mTotalCount;
        this.mProgress && this.mProgress.runWith(_arg);
        if(this.mCount == this.mTotalCount)
        {
            this.mFinishedCallBack && this.mFinishedCallBack.run();
        }
    }
}