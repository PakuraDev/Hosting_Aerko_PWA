class OneRMService{calculate1RM(weight,reps){if(reps<=0||weight<=0)return 0;if(reps===1)return weight;let oneRM=0;if(reps<=5){oneRM=weight*(36/(37-reps));}
else if(reps<=10){oneRM=weight*(1+(reps/30));}
else{oneRM=weight*Math.pow(reps,0.10);}
return oneRM;}
calculateTargetWeight(oneRM,targetReps){if(targetReps<=0||oneRM<=0)return 0;if(targetReps===1)return oneRM;let weight=0;if(targetReps<=5){weight=oneRM*((37-targetReps)/36);}
else if(targetReps<=10){weight=oneRM/(1+(targetReps/30));}
else{weight=oneRM/Math.pow(targetReps,0.10);}
return weight;}
generateRMTable(weight,reps){const raw1RM=this.calculate1RM(weight,reps);const table={"1RM":Math.round(raw1RM)};for(let i=2;i<=9;i++){table[`${i}RM`]=Math.round(this.calculateTargetWeight(raw1RM,i));}
return table;}
getFeedbackMessage(reps){if(reps===1)return"core_feedback_strength";if(reps>15)return"core_feedback_cardio";return null;}}
export const oneRmService=new OneRMService();