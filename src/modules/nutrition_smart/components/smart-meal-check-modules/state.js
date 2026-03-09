import{ITEM_TYPES}from'./constants.js';export class MealState{constructor(){this._foods=[];this._currentScope=[];this._breadcrumbs=[];this._progress={};}
init(foodsArray){this._foods=JSON.parse(JSON.stringify(foodsArray||[]));this.resetNavigation();}
loadProgress(savedLog){this._progress=savedLog||{};}
resetNavigation(){this._currentScope=this._foods;this._breadcrumbs=[];}
enterGroup(groupItem){if(groupItem.type!==ITEM_TYPES.GROUP)return;this._breadcrumbs.push({name:'Menú',scope:this._currentScope});this._currentScope=groupItem.items||[];}
navigateUp(){if(this._breadcrumbs.length===0)return;const previous=this._breadcrumbs.pop();this._currentScope=previous.scope;}
isItemDone(itemId){return this._progress[itemId]&&this._progress[itemId].isDone;}
toggleItem(item,quantity=null){if(this.isItemDone(item.id)){delete this._progress[item.id];return false;}
this._progress[item.id]={isDone:true,quantity:parseFloat(quantity!==null?quantity:(item.grams||0)),name:item.name,macros:item.macros||item.base};if(this._breadcrumbs.length>0){const siblings=this._currentScope;const hasVariable=siblings.some(i=>i.mode==='variable');const hasFixed=siblings.some(i=>i.mode==='fixed');const autoMark=(sibling)=>{if(!this.isItemDone(sibling.id)){this._progress[sibling.id]={isDone:true,quantity:parseFloat(sibling.grams||0),name:sibling.name,macros:sibling.macros||sibling.base};}};if(!hasVariable&&hasFixed){siblings.forEach(sibling=>{if(sibling.id!==item.id)autoMark(sibling);});}
else if(hasVariable&&hasFixed){if(item.mode==='variable'){siblings.forEach(sibling=>{if(sibling.mode==='fixed')autoMark(sibling);});}}}
return true;}
_checkScope(scope){return scope.every(item=>{if(item.type===ITEM_TYPES.GROUP){return this._checkScope(item.items||[]);}
return this.isItemDone(item.id);});}
isGroupFinished(groupItem){if(!groupItem.items||groupItem.items.length===0)return true;return this._checkScope(groupItem.items);}
getCurrentViewData(){return{items:this._currentScope,breadcrumbs:this._breadcrumbs,isRoot:this._breadcrumbs.length===0};}
getLog(){return this._progress;}}