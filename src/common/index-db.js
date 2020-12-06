const { Result } = require("./Result");
const { cat } = require("shelljs");
const { data } = require("jquery");

let tableNames = {
  "REQUESTS":"REQUESTS"
};
let dbConfig = {
  databaseName:"test1",
  version:Date.now(),
  tables:{
    [tableNames.REQUESTS]:{
      keyPath: 'id'
    }
  }
}

class IndexedDB{
  dbConfig = dbConfig;
  db = null;
  tables = {};
  constructor(){
    this.init()

  }
  async init(){
    return new Promise((resolve,reject) => {
      try{
        if(!window.indexedDB){
          return resolve(Result.fail({msg:"浏览器不支持indexdb"}));
        }
        let request = window.indexedDB.open(dbConfig.databaseName, dbConfig.version);
        request.onerror = event => resolve(Result.fail({msg:"数据库打开报错"}));
        request.onsuccess = event => {
          // this.db = request.result;
          // resolve(Result.success({msg:"数据库打开成功",data:request.result}));
        };
        request.onupgradeneeded = event => {
          this.db = request.result;
          for(let tablename in this.dbConfig.tables){
            let objectStore = null;
            if(!this.db.objectStoreNames.contains(tablename)){
              objectStore = this.db.createObjectStore(tablename,this.dbConfig.tables[tablename]);
            }
            this.tables[tablename] = objectStore;
          }
          resolve(Result.success({msg:"数据库打开成功",data:request.result}));
        };
      }catch(e){
        resolve(Result.fail({msg:"程序错误",data:e}))
      }
    })
  }
  async add(tablename,data){
    return new Promise((resolve,reject) => {
      if(this.db.objectStoreNames.contains(tablename)){
        let request = this.db
          .transaction([tablename], 'readwrite')
          .objectStore(tablename)
          .add(data);
        request.onsuccess = function (event) {
          resolve(Result.success({msg:"数据写入成功",data:data}));
        };
        request.onerror = function (event) {
          resolve(Result.success({msg:"数据写入失败",data:data}));
        }
      }else{
        resolve(Result.fail({msg:`表${tablename}不存在`}))
      }
    });
  }
  async get(tablename,key){
    return new Promise((resolve,reject) => {
      if(this.db.objectStoreNames.contains(tablename)){
        let request = this.db
          .transaction([tablename], 'readwrite')
          .objectStore(tablename)
          .get(key);
        request.onerror = function(event) {
          resolve(Result.fail({msg:"失败"}))
        };
        request.onsuccess = function( event) {
          resolve(Result.success({msg:"查询成功",data:request.result||{}}))
        };
      }else{
        resolve(Result.fail({msg:`表${tablename}不存在`}))
      }
    });
  }
  async put(tablename,data){
    return new Promise((resolve,reject) => {
      if(this.db.objectStoreNames.contains(tablename)){
        let request = this.db
          .transaction([tablename], 'readwrite')
          .objectStore(tablename)
          .put(data);
        request.onerror = function(event) {
          resolve(Result.fail({msg:`${tablename}更新失败`,data:data}));
        };
        request.onsuccess = function( event) {
          resolve(Result.success({msg:`${tablename}更新成功`,data:data}));
        };
      }else{
        resolve(Result.fail({msg:`表${tablename}不存在`}))
      }
    });
  }
  async delete(tablename,key){
    return new Promise((resolve,reject) => {
      if(this.db.objectStoreNames.contains(tablename)){
        let request = this.db
          .transaction([tablename], 'readwrite')
          .objectStore(tablename)
          .delete(key);
        request.onerror = function(event) {
          resolve(Result.fail({msg:`${tablename}删除${key}失败`}));
        };
        request.onsuccess = function( event) {
          resolve(Result.success({msg:`${tablename}删除${key}成功`,data:key}));
        };
      }else{
        resolve(Result.fail({msg:`表${tablename}不存在`}))
      }
    });
  }
}
let indexdb = new IndexedDB();
export {
  indexdb,
  tableNames
};
