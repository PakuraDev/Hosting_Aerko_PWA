import{router}from'../../../core/router/index.js';import{authService}from'../../auth/services/auth.service.js';import{onboardingStore}from'../store/index.js';import{i18nService}from'../../../core/i18n/i18n.service.js';export class OnboardingWizard extends HTMLElement{constructor(){super();this.currentStepIndex=onboardingStore.getStep()||0;this.stepsData=[{id:2,features:[{titleKey:"wizard_feat1_title",textKey:"wizard_feat1_desc"},{titleKey:"wizard_feat2_title",textKey:"wizard_feat2_desc"}],btnKey:"wizard_btn_continue"},{id:3,features:[{titleKey:"wizard_feat3_title",textKey:"wizard_feat3_desc"},{titleKey:"wizard_feat4_title",textKey:"wizard_feat4_desc"}],btnKey:"wizard_btn_start"}];this._handleNext=this._handleNext.bind(this);this._handleNavClick=this._handleNavClick.bind(this);}
async connectedCallback(){this.dict=await i18nService.loadPage('onboarding/wizard');this.render();this.addListeners();this.updateStepView(this.currentStepIndex);}
disconnectedCallback(){this.removeListeners();}
render(){if(!this.dict)return;this.innerHTML=`
        <div class="app-screen screen-wizard">
            
            <div class="pagination-wrapper">
                <div class="page-indicator" data-target="welcome">1</div>
                <div class="page-indicator" data-target="step-0">2</div>
                <div class="page-indicator" data-target="step-1">3</div>
            </div>

            <div class="features-list" id="features-container"></div>

            <div class="wizard-footer">
                <app-btn variant="primary" id="btn-action"></app-btn>
            </div>

        </div>
        `;}
updateStepView(index){if(!this.dict)return;const data=this.stepsData[index];const indicators=this.querySelectorAll('.page-indicator');const container=this.querySelector('#features-container');indicators.forEach(ind=>ind.className='page-indicator');indicators[0].classList.add('completed');if(index===0){indicators[1].classList.add('current');}else if(index===1){indicators[1].classList.add('completed');indicators[2].classList.add('current');}
container.innerHTML=data.features.map(feat=>`
            <div class="feature-item">
                <h2 class="title-feature">${this.dict.t(feat.titleKey)}</h2>
                <p class="text-feature">${this.dict.t(feat.textKey)}</p>
            </div>
        `).join('');this._updateButtonText(this.dict.t(data.btnKey));onboardingStore.setStep(index);}
_updateButtonText(text){const appBtn=this.querySelector('#btn-action');if(!appBtn)return;appBtn.setAttribute('label',text);const innerBtn=appBtn.querySelector('button');if(innerBtn){innerBtn.innerText=text;}else{appBtn.innerHTML=text;}}
addListeners(){this.querySelector('#btn-action').addEventListener('click',this._handleNext);this.querySelectorAll('.page-indicator').forEach(ind=>{ind.addEventListener('click',this._handleNavClick);});}
removeListeners(){this.querySelector('#btn-action').removeEventListener('click',this._handleNext);this.querySelectorAll('.page-indicator').forEach(ind=>{ind.removeEventListener('click',this._handleNavClick);});}
async _handleNext(){if(this.currentStepIndex<this.stepsData.length-1){this.currentStepIndex++;this.updateStepView(this.currentStepIndex);}else{await authService.completeOnboarding();onboardingStore.reset();router.navigate('/');}}
_handleNavClick(e){const target=e.target.dataset.target;if(target==='welcome'){router.navigate('/onboarding/welcome');}else if(target==='step-0'){this.currentStepIndex=0;this.updateStepView(0);}else if(target==='step-1'){this.currentStepIndex=1;this.updateStepView(1);}}}
customElements.define('onboarding-wizard',OnboardingWizard);