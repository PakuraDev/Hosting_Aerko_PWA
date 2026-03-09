import{MealState}from'./smart-meal-check-modules/state.js';import{MealView}from'./smart-meal-check-modules/view.js';import{STYLES}from'./smart-meal-check-modules/styles.js';import{EVENTS,STATUS,ITEM_TYPES}from'./smart-meal-check-modules/constants.js';import{i18nService}from'../../../core/i18n/i18n.service.js';export class SmartMealCheckWit extends HTMLElement{static get observedAttributes(){return['title','status','meal-id'];}
constructor(){super();this.attachShadow({mode:'open'});this.state=new MealState();this._isOpen=false;}
async connectedCallback(){this.dict=await i18nService.loadPage('nutrition_smart/smart-meal-check-wit');this.shadowRoot.innerHTML=`
            <style>${STYLES}</style>
            ${MealView.getTemplate(this.getAttribute('title'))}
        `;this.dom={header:this.shadowRoot.getElementById('mainHeader'),content:this.shadowRoot.getElementById('mainContent'),title:this.shadowRoot.getElementById('headerTitle'),icon:this.shadowRoot.getElementById('headerIcon')};this.dom.header.addEventListener('click',()=>this.toggleAccordion());this.updateView();}
attributeChangedCallback(name,oldVal,newVal){if(oldVal===newVal)return;if(name==='title'&&this.dom){this.dom.title.innerText=newVal;}
if(name==='status'){if(newVal!==STATUS.PENDING)this._isOpen=false;this.updateView();}}
setFoods(foodsArray){this.state.init(foodsArray);this.updateView();}
setProgress(consumedData){this.state.loadProgress(consumedData);this.updateView();}
forceOpen(){this._isOpen=true;this.updateView();}
updateView(){if(!this.dom)return;const currentStatus=this.getAttribute('status')||STATUS.PENDING;MealView.updateHeaderIcon(this.dom.icon,this._isOpen,currentStatus);if(this._isOpen)this.dom.content.classList.add('show');else this.dom.content.classList.remove('show');if(currentStatus!==STATUS.PENDING){MealView.renderSummary(this.dom.content,this.state.getLog(),currentStatus,{onReset:()=>this.resetMeal()});}else{MealView.renderActive(this.dom.content,this.state.getCurrentViewData(),this.state,{onItemClick:(item)=>this.handleItemClick(item),onBack:()=>this.handleBack(),onOther:()=>this.emit(EVENTS.REQUEST_OTHER),onSkip:()=>this.finishMeal(STATUS.SKIPPED),onSave:()=>this.handleSave()});}}
toggleAccordion(){this._isOpen=!this._isOpen;this.updateView();}
handleBack(){this.state.navigateUp();this.updateView();}
handleItemClick(item){if(item.type===ITEM_TYPES.GROUP){this.state.enterGroup(item);this.updateView();return;}
if(this.state.isItemDone(item.id)){this.state.toggleItem(item);this.updateView();return;}
const needsKeypad=item.isVariable||item.mode==='variable';if(needsKeypad){this.emit(EVENTS.REQUEST_QTY,{item:item,callback:(qty)=>{this.state.toggleItem(item,qty);this.updateView();}});}else{this.state.toggleItem(item);this.updateView();}}
handleSave(){const currentLog=this.state.getLog();const itemsCount=Object.keys(currentLog).length;if(itemsCount===0){if(confirm(this.dict.t('alert_empty_save'))){this.finishMeal(STATUS.SKIPPED);}
return;}
this.finishMeal(STATUS.DONE);}
finishMeal(status){this.setAttribute('status',status);if(status===STATUS.SKIPPED){this.state._progress={};this._isOpen=false;this.updateView();this.notifyChange(status);}
else if(status===STATUS.DONE){this.notifyChange(status);setTimeout(()=>{this._isOpen=false;this.updateView();},300);}
else{this._isOpen=false;this.updateView();this.notifyChange(status);}}
resetMeal(){if(confirm(this.dict.t('alert_reset_meal'))){this.state._progress={};this.setAttribute('status',STATUS.PENDING);this._isOpen=true;this.updateView();this.notifyChange(STATUS.PENDING);}}
notifyChange(status){this.emit(EVENTS.MEAL_COMPLETED,{mealId:this.getAttribute('meal-id'),status:status,log:this.state.getLog()});}
emit(eventName,detail={}){this.dispatchEvent(new CustomEvent(eventName,{detail,bubbles:true,composed:true}));}}
customElements.define('smart-meal-check-wit',SmartMealCheckWit);