class WizardStore{constructor(){this.reset();}
reset(){this.state={gender:'XX',age:'',height:'',weight:'00.0',unitWeight:'KG',unitHeight:'M',activityLevel:'sedentary',goalType:'lose',speed:'normal',targetKcal:0,protein:0,carbs:0,fat:0,interval:0.05,isCustom:false};}
hydrate(userProfile={},currentGoal={}){if(userProfile.weight){this.state.gender=userProfile.gender||'XX';this.state.age=userProfile.age||'';this.state.height=userProfile.height||'';this.state.weight=userProfile.weight||'00.0';this.state.activityLevel=userProfile.activityLevel||'sedentary';}
if(currentGoal.targetKcal){this.state.goalType=currentGoal.goalType||'lose';this.state.isCustom=currentGoal.isCustom||false;if(this.state.isCustom){this.state.targetKcal=currentGoal.targetKcal||0;this.state.protein=currentGoal.protein||0;this.state.carbs=currentGoal.carbs||0;this.state.fat=currentGoal.fat||0;this.state.interval=currentGoal.interval||0.05;}}
console.log('[WIZARD STORE] Pizarra hidratada con datos reales:',this.state);}
update(partialData){this.state={...this.state,...partialData};}
getState(){return{...this.state};}}
export const wizardStore=new WizardStore();