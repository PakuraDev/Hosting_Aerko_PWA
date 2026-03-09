class TrainingStore{constructor(){this.state={muscles:[],exercises:[],routines:[],draftRoutine:null,activeSession:null,snapshot:{}};}
setMuscles(data){this.state.muscles=data;}
setExercises(data){this.state.exercises=data;}
setRoutines(data){this.state.routines=data||[];}
setDraftRoutine(routine){this.state.draftRoutine=routine;}
startSession(sessionObj){this.state.activeSession=sessionObj;}
setSnapshot(data){this.state.snapshot=data||{};}
addSetToSession(exerciseId,set){if(!this.state.activeSession)return;const exercise=this.state.activeSession.exercises.find(e=>e.id===exerciseId);if(exercise){if(!exercise.sets)exercise.sets=[];exercise.sets.push(set);}}
updateSetInSession(exerciseId,setIndex,updatedSet){if(!this.state.activeSession)return;const exercise=this.state.activeSession.exercises.find(e=>e.id===exerciseId);if(exercise&&exercise.sets[setIndex]){exercise.sets[setIndex]={...exercise.sets[setIndex],...updatedSet};}}
removeSetFromSession(exerciseId,setIndex){if(!this.state.activeSession)return;const exercise=this.state.activeSession.exercises.find(e=>e.id===exerciseId);if(exercise&&exercise.sets){exercise.sets.splice(setIndex,1);}}
updateSessionStatus(status){if(this.state.activeSession){this.state.activeSession.status=status;}}
clearSession(){this.state.activeSession=null;}
getDraftRoutine(){return this.state.draftRoutine;}
updateDraftName(name){if(this.state.draftRoutine){this.state.draftRoutine.name=name;}}
addExerciseToDraft(exerciseId){if(!this.state.draftRoutine)return;const exists=this.state.draftRoutine.exercises.find(e=>e.id===exerciseId);if(!exists){this.state.draftRoutine.exercises.push({id:exerciseId,addedAt:Date.now()});}}
removeExerciseFromDraft(exerciseId){if(!this.state.draftRoutine)return;this.state.draftRoutine.exercises=this.state.draftRoutine.exercises.filter(ex=>ex.id!==exerciseId);}
getMuscles(){return this.state.muscles;}
getAllExercises(){return this.state.exercises;}
getExerciseById(id){return this.state.exercises.find(e=>e.id===id);}
getRoutines(){return this.state.routines;}
getRoutineById(id){return this.state.routines.find(r=>r.id===id);}
getActiveSession(){return this.state.activeSession;}
getSnapshot(){return this.state.snapshot;}
getExerciseSnapshot(exerciseId){return this.state.snapshot[exerciseId]||null;}}
export const trainingStore=new TrainingStore();