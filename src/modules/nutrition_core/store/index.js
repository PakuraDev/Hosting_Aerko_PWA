class NutritionStore{constructor(){this.state={masterFoods:[],userFoods:[],deletedIds:[],mealPlanIds:[],wizardState:{gender:'XX',age:25,height:170,weight:'00.0',activity:'sedentary'},dietGoal:null};}
setMasterFoods(foods){this.state.masterFoods=foods;}
setUserData(data){this.state.userFoods=data.foods||[];this.state.deletedIds=data.deletedIds||[];}
setMealPlanIds(idsArray){if(Array.isArray(idsArray)){this.state.mealPlanIds=idsArray;}}
setDietGoal(goal){this.state.dietGoal=goal;}
setWizardState(data){this.state.wizardState={...this.state.wizardState,...data};}
getAllFoods(){const userMap=new Map(this.state.userFoods.map(f=>[f.id,f]));const processedMaster=this.state.masterFoods.filter(f=>!this.state.deletedIds.includes(f.id)).filter(f=>!userMap.has(f.id));return[...processedMaster,...this.state.userFoods];}
getWizardState(){return this.state.wizardState;}
getDietGoal(){return this.state.dietGoal;}
getUserData(){return{foods:this.state.userFoods,deletedIds:this.state.deletedIds};}
getMealPlanIds(){return this.state.mealPlanIds;}
addOrUpdateUserFood(food){const index=this.state.userFoods.findIndex(f=>f.id===food.id);if(index>=0){this.state.userFoods[index]=food;}else{this.state.userFoods.push(food);}}
removeUserFood(id){if(id.startsWith('O_')){if(!this.state.deletedIds.includes(id)){this.state.deletedIds.push(id);}}else{this.state.userFoods=this.state.userFoods.filter(f=>f.id!==id);}}}
export const nutritionStore=new NutritionStore();