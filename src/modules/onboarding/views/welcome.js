import{router}from'../../../core/router/index.js';import{authService}from'../../auth/services/auth.service.js';import{i18nService}from'../../../core/i18n/i18n.service.js';export class OnboardingWelcome extends HTMLElement{constructor(){super();this.touchStartX=0;this.touchEndX=0;this._handleTouchStart=this._handleTouchStart.bind(this);this._handleTouchEnd=this._handleTouchEnd.bind(this);}
async connectedCallback(){this.dict=await i18nService.loadPage('onboarding/welcome');this.render();this.addListeners();}
disconnectedCallback(){this.removeListeners();}
render(){if(!this.dict)return;this.innerHTML=`
        <div class="app-screen screen-onboarding" id="welcome-screen">
            
            <div class="ascii-container">
                <img src="/assets/img/logo_ascii.png" class="ascii-img" alt="Aerko System">
            </div>

            <div class="logs-container">
                <p class="log-line log-green">> System initiation...</p>
                <p class="log-line log-green">> System iniciated</p>
                <p class="log-line log-white">> Onboarding on process...</p>
                <p class="log-line log-white">> Waiting for human interaction...</p>
                <p class="log-line log-white">><span class="cursor-block"></span></p>
            </div>

            <div class="content-wrapper">
                <h1 class="title-welcome">${this.dict.t('welcome_title')}</h1>
                <p class="body-welcome">
                    ${this.dict.t('welcome_desc')}
                </p>
            </div>

            <div class="buttons-container">
                <app-btn variant="secondary" id="btn-skip">${this.dict.t('welcome_btn_skip')}</app-btn>
                <app-btn variant="primary" id="btn-continue">${this.dict.t('welcome_btn_continue')}</app-btn>
            </div>

            <div style="margin-top: auto;"> 
                <a class="text-link-action" id="link-import">${this.dict.t('welcome_link_import')}</a>
            </div>

        </div>
        `;}
addListeners(){this.querySelector('#btn-skip').addEventListener('click',async()=>{await authService.completeOnboarding();router.navigate('/');});this.querySelector('#btn-continue').addEventListener('click',()=>router.navigate('/onboarding/wizard'));this.querySelector('#link-import').addEventListener('click',()=>router.navigate('/onboarding/import'));this.addEventListener('touchstart',this._handleTouchStart,{passive:true});this.addEventListener('touchend',this._handleTouchEnd,{passive:true});}
removeListeners(){this.removeEventListener('touchstart',this._handleTouchStart);this.removeEventListener('touchend',this._handleTouchEnd);}
_handleTouchStart(e){this.touchStartX=e.changedTouches[0].screenX;}
_handleTouchEnd(e){this.touchEndX=e.changedTouches[0].screenX;this._calculateSwipe();}
_calculateSwipe(){const threshold=50;const diff=this.touchEndX-this.touchStartX;if(Math.abs(diff)<threshold)return;if(diff<0){router.navigate('/onboarding/import');}
else{router.navigate('/onboarding/wizard');}}}
customElements.define('onboarding-welcome',OnboardingWelcome);