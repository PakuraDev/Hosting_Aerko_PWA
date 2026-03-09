import{router}from'../../../core/router/index.js';import{wizardStore}from'../store/wizard.store.js';import'../../system/components/btn.js';import'../../system/components/section-header.js';import'../../system/components/input-card.js';import'../../system/components/box.js';import'../../system/components/unit-toggle.js';import'../../system/components/keypad-modal.js';import{unitService}from'../../../core/utils/unit.service.js';import{i18nService}from'../../../core/i18n/i18n.service.js';export class NutritionWizardForm extends HTMLElement{constructor(){super();const savedState=wizardStore.getState();const uHeight=savedState.unitHeight||'CM';const uWeight=savedState.unitWeight||'KG';let displayHeight='--';if(savedState.height&&savedState.height!=='--'){displayHeight=unitService.toDisplay(savedState.height,uHeight);}
this.formData={gender:savedState.gender||'XX',height:displayHeight,age:savedState.age||'--',weight:savedState.weight||'00.0',unitHeight:uHeight,unitWeight:uWeight};}
async connectedCallback(){this.dict=await i18nService.loadPage('nutrition_wizard/form');this.render();}
render(){if(!this.dict)return;this.innerHTML=`
            <div class="wizard-screen">
                <app-keypad-modal id="global-keypad"></app-keypad-modal>
                
                <app-section-header 
                    title="${this.dict.t('title_form')}"
                    text="${this.dict.t('desc_form')}"
                ></app-section-header>

                <main class="wizard-content">
                    
                    <app-input-card label="${this.dict.t('label_gender')}" grid="2">
                        <app-box id="gen-xx" clickable ${this.formData.gender === 'XX' ? 'active' : ''}>XX</app-box>
                        <app-box id="gen-xy" clickable ${this.formData.gender === 'XY' ? 'active' : ''}>XY</app-box>
                    </app-input-card>

                    <app-input-card label="${this.dict.t('label_height')}">
                        <app-box id="box-height" clickable>
                            <span class="value-text" style="flex:1">${this.formData.height}</span>
                            <app-unit-toggle options="CM, IN" value="${this.formData.unitHeight}"></app-unit-toggle>
                        </app-box>
                    </app-input-card>

                    <app-input-card label="${this.dict.t('label_age')}">
                        <app-box id="box-age" clickable>
                            <span style="flex:1">${this.formData.age}</span>
                        </app-box>
                    </app-input-card>

                </main>

                <section class="wizard-buttons">
                    <app-btn variant="secondary" label="${this.dict.t('btn_manual')}" id="btn-manual"></app-btn>
                    <app-btn variant="primary" label="${this.dict.t('btn_next')}" id="btn-next"></app-btn>
                </section>
            </div>
        `;this.addListeners();}
addListeners(){const modal=this.querySelector('#global-keypad');this.querySelector('#gen-xx').addEventListener('click',()=>this.setGender('XX'));this.querySelector('#gen-xy').addEventListener('click',()=>this.setGender('XY'));this.querySelector('#box-height').addEventListener('click',async()=>{const onRealTimeUnitChange=(newUnit)=>{this.formData.unitHeight=newUnit;const toggle=this.querySelector('#box-height app-unit-toggle');if(toggle)toggle.setAttribute('value',newUnit);};const result=await modal.open(this.dict.t('label_height'),this.formData.height,'dynamic',this.formData.unitHeight,'CM, IN',onRealTimeUnitChange);if(result!==null){this.formData.height=result.value;this.formData.unitHeight=result.unit;this.render();}});this.querySelector('#box-age').addEventListener('click',async()=>{const result=await modal.open(this.dict.t('label_age'),this.formData.age,'numeric');if(result!==null){this.formData.age=result.value;this.render();}});this.querySelector('#btn-next').addEventListener('click',()=>{const baseHeight=this.formData.height!=='--'?unitService.toBase(this.formData.height,this.formData.unitHeight):'';wizardStore.update({gender:this.formData.gender,height:baseHeight,age:this.formData.age,weight:this.formData.weight,unitHeight:this.formData.unitHeight,unitWeight:this.formData.unitWeight});router.navigate('/nutrition/wizard/activity');});this.querySelector('#btn-manual').addEventListener('click',()=>{router.navigate('/nutrition/manual-config');});}
setGender(val){this.formData.gender=val;this.render();}}
customElements.define('nutrition-wizard-form',NutritionWizardForm);