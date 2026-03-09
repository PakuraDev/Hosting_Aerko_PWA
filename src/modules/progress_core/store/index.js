class ProgressStore{constructor(){this.state={records:[],latestBiometrics:{weight:null,bodyFat:null},draft:{}};}
setRecords(records){this.state.records=records.sort((a,b)=>b.timestamp-a.timestamp);this._updateLatest();}
addRecord(record){this.state.records.push(record);this.state.records.sort((a,b)=>b.timestamp-a.timestamp);this._updateLatest();}
updateDraft(newData){this.state.draft={...this.state.draft,...newData};}
clearDraft(){this.state.draft={};}
getRecords(){return this.state.records;}
getLatestBiometrics(){return this.state.latestBiometrics;}
getDraft(){return this.state.draft;}
_updateLatest(){let w=null,bf=null;for(const r of this.state.records){if(w===null&&r.weight)w=r.weight;if(bf===null&&r.bodyFat)bf=r.bodyFat;if(w!==null&&bf!==null)break;}
this.state.latestBiometrics={weight:w,bodyFat:bf};}}
export const progressStore=new ProgressStore();