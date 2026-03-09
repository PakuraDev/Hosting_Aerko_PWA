import{db}from'../db/index.js';import{bus}from'../bus/index.js';import{SUPPORTED_LANGUAGES,DEFAULT_LANG,DEFAULT_MODE}from'./config.js';const STORE_NAME='public_store';const PREFS_KEY='app_preferences';class I18nService{constructor(){this._currentLang=DEFAULT_LANG;this._currentMode=DEFAULT_MODE;this.dictionaries={};}
async init(){try{const record=await db.get(STORE_NAME,PREFS_KEY);if(record&&record.data){this._currentLang=record.data.lang||DEFAULT_LANG;this._currentMode=record.data.mode||DEFAULT_MODE;}}catch(error){console.error('[I18N] Error cargando preferencias:',error);}}
getPreferences(){return{lang:this._currentLang,mode:this._currentMode};}
async loadPage(pageName){if(this.dictionaries[pageName]){return this.dictionaries[pageName];}
const lang=this._currentLang;const mode=this._currentMode;let modeSuffix='';if(mode==='b')modeSuffix='_zen';if(mode==='c')modeSuffix='_tsu';const basePath=`/src/core/i18n/${lang}/${pageName}.js`;const modePath=modeSuffix?`/src/core/i18n/${lang}${modeSuffix}/${pageName}.js`:basePath;let baseData={};let modeData={};try{const baseModule=await import(basePath);baseData=baseModule.default||{};}catch(e){console.warn(`[I18N] ⚠️ Fallo al cargar base: ${basePath}`,e);}
if(modePath!==basePath){try{const modeModule=await import(modePath);modeData=modeModule.default||{};}catch(e){}}
const mergedData={...baseData,...modeData};const dictWrapper={data:mergedData,t:(key,vars={})=>{let text=dictWrapper.data[key];let finalId=key;if(text===undefined)return`[${key}]`;if(Array.isArray(text)){const randomIndex=Math.floor(Math.random()*text.length);text=text[randomIndex];finalId=`${key}-${randomIndex}`;}
if(vars&&typeof text==='string'){for(const[vKey,vValue]of Object.entries(vars)){text=text.replace(new RegExp(`{{${vKey}}}`,'g'),vValue);}}
if(this._currentMode==='c'){this._registerTsundereLog(finalId);}
return text;}};this.dictionaries[pageName]=dictWrapper;return dictWrapper;}
tData(dbObject){if(!dbObject||typeof dbObject!=='object')return'';if(dbObject[this._currentLang])return dbObject[this._currentLang];if(dbObject[DEFAULT_LANG])return dbObject[DEFAULT_LANG];return Object.values(dbObject)[0]||'';}
async _registerTsundereLog(logId){try{const record=await db.get(STORE_NAME,'tsundere_collection');const unlocked=(record&&record.data)?record.data:[];if(unlocked.includes(logId))return;unlocked.push(logId);await db.put(STORE_NAME,{id:'tsundere_collection',data:unlocked});}catch(error){console.error('[I18N] Error guardando el insulto en la colección:',error);}}
async setLanguage(langId){this._currentLang=langId;const langConfig=SUPPORTED_LANGUAGES.find(l=>l.id===langId);if(langConfig&&!langConfig.type.includes(this._currentMode)){this._currentMode='a';}
this.dictionaries={};await this._saveAndEmit();}
async setMode(modeChar){this._currentMode=modeChar;this.dictionaries={};await this._saveAndEmit();}
async _saveAndEmit(){const newData={lang:this._currentLang,mode:this._currentMode};try{await db.put(STORE_NAME,{id:PREFS_KEY,data:newData});bus.emit('APP_PREFERENCES_UPDATED',newData);}catch(error){console.error('[I18N] Error guardando preferencias:',error);}}}
export const i18nService=new I18nService();