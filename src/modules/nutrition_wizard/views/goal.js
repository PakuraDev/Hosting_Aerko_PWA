import{router}from'../../../core/router/index.js';import{nutritionStore}from'../../nutrition_core/store/index.js';import{nutritionService}from'../../nutrition_core/services/nutrition.service.js';import{wizardService}from'../../nutrition_core/services/wizard.service.js';import{wizardStore}from'../store/wizard.store.js';import{calculatorService,GOALS,SPEED}from'../../nutrition_core/services/calculator.service.js';import'../../system/components/select-list.js';import'../../system/components/segment-select.js';import{i18nService}from'../../../core/i18n/i18n.service.js';export class NutritionWizardGoal extends HTMLElement{constructor(){super();this.state={goalType:GOALS.LOSE,speed:'normal'};this.goalOptions=[{value:GOALS.GAIN,labelKey:'opt_goal_gain'},{value:GOALS.MAINTAIN,labelKey:'opt_goal_maintain'},{value:GOALS.LOSE,labelKey:'opt_goal_lose'}];this.speedOptions=[{value:'safe',labelKey:'opt_speed_safe'},{value:'normal',labelKey:'opt_speed_normal'},{value:'fast',labelKey:'opt_speed_fast'}];}
async connectedCallback(){this.dict=await i18nService.loadPage('nutrition_wizard/goal');this.render();this.addListeners();}
render(){if(!this.dict)return;const showSpeed=this.state.goalType!==GOALS.MAINTAIN;this.innerHTML=`
        <div class="wizard-screen">
            <app-section-header 
                title="${this.dict.t('title_goal')}"
                text="${this.dict.t('desc_goal')}"
            ></app-section-header>

            <main class="wizard-content">
                
                <app-input-card label="${this.dict.t('label_goal')}">
                    <app-select-list id="goal-selector"></app-select-list>
                </app-input-card>

                <div id="speed-container" style="width: 100%; display: ${showSpeed ? 'block' : 'none'}">
                    <app-input-card label="${this.dict.t('label_speed')}">
                        <app-select-list id="speed-selector"></app-select-list>
                    </app-input-card>
                </div>

            </main>

            <section class="wizard-buttons">
                <app-btn variant="primary" label="${this.dict.t('btn_finish')}" id="btn-finish"></app-btn>
            </section>
        </div>
    `;const translatedGoals=this.goalOptions.map(opt=>({value:opt.value,label:this.dict.t(opt.labelKey)}));const translatedSpeeds=this.speedOptions.map(opt=>({value:opt.value,label:this.dict.t(opt.labelKey)}));const goalSelector=this.querySelector('#goal-selector');goalSelector.setOptions(translatedGoals);goalSelector.setAttribute('value',this.state.goalType);const speedSelector=this.querySelector('#speed-selector');speedSelector.setOptions(translatedSpeeds);speedSelector.setAttribute('value',this.state.speed);}
addListeners(){this.querySelector('#goal-selector').addEventListener('change',(e)=>{const newVal=e.detail.value;this.state.goalType=newVal;const speedContainer=this.querySelector('#speed-container');if(newVal===GOALS.MAINTAIN){speedContainer.style.display='none';}else{speedContainer.style.display='block';}});this.querySelector('#speed-selector').addEventListener('change',(e)=>{this.state.speed=e.detail.value;});this.querySelector('#btn-finish').addEventListener('click',()=>{this.calculateAndSave();});}
async calculateAndSave(){try{wizardStore.update({goalType:this.state.goalType,speed:this.state.speed});await wizardService.saveStandardGoal();router.navigate('/nutrition');}catch(error){console.error("Error al guardar la dieta:",error);alert(this.dict.t('alert_error_save'));}}
_getActivityFactor(level){const map={'sedentary':1.2,'light':1.375,'moderate':1.55,'active':1.725,'extreme':1.9};return map[level]||1.2;}}
customElements.define('nutrition-wizard-goal',NutritionWizardGoal);