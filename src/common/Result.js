

export class Result{
  status = 0;
  data = {};
  msg = "";
  constructor(options = {}){
    this.status = options.status || 0;
    this.data = options.data || {};
    this.msg = options.msg || "";
  }
  static success = options => new Result(Object.assign(options,{status:1}));
  static fail = options => new Result(Object.assign(options,{status:0}));
  static build = res => new Result(res);
  get isSuccess(){
    return this.status === 1;
  }
}

