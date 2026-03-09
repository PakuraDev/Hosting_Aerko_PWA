import{router}from'../../../core/router/index.js';import{wizardStore}from'../store/wizard.store.js';import'../../system/components/select-list.js';import{unitService}from'../../../core/utils/unit.service.js';import{i18nService}from'../../../core/i18n/i18n.service.js';export class NutritionWizardActivity extends HTMLElement{constructor(){super();const wizardData=wizardStore.getState()||{};const uWeight=wizardData.unitWeight||'KG';let displayWeight='00.0';if(wizardData.weight&&wizardData.weight!=='00.0'){displayWeight=unitService.toDisplay(wizardData.weight,uWeight);}
this.state={weight:displayWeight,unitWeight:uWeight,activityLevel:wizardData.activityLevel||'sedentary'};this.activityOptions=[{value:'sedentary',labelKey:'opt_act_sedentary'},{value:'light',labelKey:'opt_act_light'},{value:'moderate',labelKey:'opt_act_moderate'},{value:'active',labelKey:'opt_act_active'},{value:'extreme',labelKey:'opt_act_extreme'}];}
async connectedCallback(){this.dict=await i18nService.loadPage('nutrition_wizard/activity');this.render();this.addListeners();}
render(){if(!this.dict)return;this.innerHTML=`
            <div class="wizard-screen">
                <app-keypad-modal id="global-keypad"></app-keypad-modal>
                
                <app-section-header 
                    title="${this.dict.t('title_activity')}"
                    text="${this.dict.t('desc_activity')}"
                ></app-section-header>

                <main class="wizard-content">
                    
                    <app-input-card label="${this.dict.t('label_weight')}">
                        <app-box id="box-weight" clickable>
                            <span style="flex:1" class="value-text">${this.state.weight}</span>
                            <app-unit-toggle options="KG, LB, ST" value="${this.state.unitWeight}"></app-unit-toggle>
                        </app-box>
                    </app-input-card>

                    <app-input-card label="${this.dict.t('label_sports')}">
                        <app-select-list id="activity-selector"></app-select-list>
                    </app-input-card>

                </main>

                <section class="wizard-buttons">
                    <app-btn variant="primary" label="${this.dict.t('btn_next_activity')}" id="btn-next"></app-btn>
                </section>
            </div>
        `;const translatedOptions=this.activityOptions.map(opt=>({value:opt.value,label:this.dict.t(opt.labelKey)}));const selector=this.querySelector('#activity-selector');selector.setOptions(translatedOptions);selector.setAttribute('value',this.state.activityLevel);}
addListeners(){const modal=this.querySelector('#global-keypad');this.querySelector('#box-weight').addEventListener('click',async()=>{const onRealTimeUnitChange=(newUnit)=>{this.state.unitWeight=newUnit;const toggle=this.querySelector('#box-weight app-unit-toggle');if(toggle)toggle.setAttribute('value',newUnit);};const res=await modal.open(this.dict.t('label_weight'),this.state.weight,'dynamic',this.state.unitWeight,'KG, LB, ST',onRealTimeUnitChange);if(res!==null){this.state.weight=res.value;this.state.unitWeight=res.unit;const valueSpan=this.querySelector('#box-weight span');if(valueSpan)valueSpan.innerText=res.value;const toggle=this.querySelector('#box-weight app-unit-toggle');if(toggle)toggle.setAttribute('value',res.unit);}});this.querySelector('#activity-selector').addEventListener('change',(e)=>{this.state.activityLevel=e.detail.value;});this.querySelector('#btn-next').addEventListener('click',()=>{const baseWeight=this.state.weight!=='00.0'?unitService.toBase(this.state.weight,this.state.unitWeight):'00.0';wizardStore.update({weight:baseWeight,activityLevel:this.state.activityLevel,unitWeight:this.state.unitWeight});router.navigate('/nutrition/wizard/goal');});}}
customElements.define('nutrition-wizard-activity',NutritionWizardActivity);