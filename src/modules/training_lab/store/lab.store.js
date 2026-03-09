class LabStore{constructor(){this.reset();}
reset(){this.state={tempVideoFile:null,tempAnalysisData:null,currentExercise:'squat'};}
setVideoFile(file){this.state.tempVideoFile=file;}
setAnalysisData(data){this.state.tempAnalysisData=data;}
update(partialData){this.state={...this.state,...partialData};}
getState(){return{...this.state};}}
export const labStore=new LabStore();