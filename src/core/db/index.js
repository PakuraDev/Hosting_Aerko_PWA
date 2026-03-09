import{cryptoService}from'../crypto/index.js';const DB_NAME='AerkoDB';const DB_VERSION=3;const STORES=['public_store','user_vault','nutrition_vault','training_vault','progress_vault'];class Database{constructor(){this.db=null;}
_isProtected(storeName){return storeName!=='public_store';}
async init(){return new Promise((resolve,reject)=>{const request=indexedDB.open(DB_NAME,DB_VERSION);request.onupgradeneeded=(event)=>{console.log('[DB] Upgrading database scheme...');const db=event.target.result;STORES.forEach(storeName=>{if(!db.objectStoreNames.contains(storeName)){db.createObjectStore(storeName,{keyPath:'id'});}});};request.onsuccess=(event)=>{this.db=event.target.result;console.log(`[DB] ${DB_NAME} v${DB_VERSION} initialized.`);resolve(this.db);};request.onerror=(event)=>{console.error('[DB] Connection failed:',event.target.error);reject(event.target.error);};});}
async put(storeName,data){if(!this._isProtected(storeName)||!cryptoService.key){return this._transaction(storeName,'readwrite',store=>store.put(data));}
if(data.data&&data.data.iv&&data.data.content){return this._transaction(storeName,'readwrite',store=>store.put(data));}
const{id,...payload}=data;const encryptedData=await cryptoService.encrypt(payload);const recordToSave={id:id,data:encryptedData};return this._transaction(storeName,'readwrite',store=>store.put(recordToSave));}
async get(storeName,id){const record=await this._transaction(storeName,'readonly',store=>store.get(id));if(!record||!this._isProtected(storeName)||!cryptoService.key||!record.data||!record.data.iv){return record;}
const decryptedPayload=await cryptoService.decrypt(record.data);return{id:record.id,...decryptedPayload};}
async getAll(storeName){const records=await this._transaction(storeName,'readonly',store=>store.getAll());if(!this._isProtected(storeName)||!cryptoService.key){return records;}
return Promise.all(records.map(async(record)=>{if(record.data&&record.data.iv){const decryptedPayload=await cryptoService.decrypt(record.data);return{id:record.id,...decryptedPayload};}
return record;}));}
async delete(storeName,id){return this._transaction(storeName,'readwrite',store=>store.delete(id));}
_transaction(storeName,mode,callback){return new Promise((resolve,reject)=>{if(!this.db){reject(new Error('Database not initialized. Call init() first.'));return;}
const transaction=this.db.transaction([storeName],mode);const store=transaction.objectStore(storeName);const request=callback(store);request.onsuccess=()=>resolve(request.result);request.onerror=(e)=>reject(e.target.error);});}}
export const db=new Database();