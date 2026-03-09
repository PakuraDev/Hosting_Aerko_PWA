import{db}from'../../../core/db/index.js';import{router}from'../../../core/router/index.js';import{AI_MODELS}from'../constants.js';import{labService}from'../services/lab.service.js';import'../../system/components/btn.js';import{i18nService}from'../../../core/i18n/i18n.service.js';export class TrainingLabSetupDownload extends HTMLElement{constructor(){super();this.config=null;this.recommendedModel=null;}
async connectedCallback(){try{this.config=await db.get('public_store','training_lab_config');}catch(e){console.error('Error cargando config:',e);}
if(!this.config||!this.config.hardware_tier){router.navigate('/training/lab/setup');return;}
this.recommendedModel=this._calculateRecommendation(this.config.hardware_tier,this.config.preference);const[pageDict,constDict]=await Promise.all([i18nService.loadPage('training_lab/lab-setup-download'),i18nService.loadPage('training_lab/constants')]);this.dict=pageDict;this.constDict=constDict;this.render();setTimeout(()=>this._attachListeners(),0);}
_calculateRecommendation(tier,pref){if(tier===1)return AI_MODELS.lite;if(tier===2)return pref==='precision'?AI_MODELS.full:AI_MODELS.lite;if(tier===3)return pref==='speed'?AI_MODELS.lite:AI_MODELS.full;if(tier===4)return pref==='precision'?AI_MODELS.heavy:AI_MODELS.full;if(tier===5)return AI_MODELS.heavy;return AI_MODELS.full;}
render(){const otherModels=Object.values(AI_MODELS).filter(m=>m.id!==this.recommendedModel.id);this.innerHTML=`
            <style>
                @import url('/src/core/theme/variables.css');
                @import url('/src/core/theme/main.css');

                /* Sustituimos :host por el nombre del tag para mantener el orden */
                training-lab-setup-download {
                    display: block;
                    width: 100%;
                    height: 100dvh;
                    background-color: var(--Negro-suave);
                    overflow: hidden; 
                }

                .main-container {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    max-width: 480px;
                    height: 100%;
                    margin: 0 auto;
                    background: var(--Negro-suave);
                }

                .content-area {
                    display: flex;
                    flex-direction: column;
                    flex: 1; 
                    padding: calc(env(safe-area-inset-top) + 32px) 24px 24px 24px;
                    gap: 32px;
                    overflow-y: auto;
                    scrollbar-width: none; 
                }
                .content-area::-webkit-scrollbar { display: none; }

                .msg-text {
                    color: var(--Verde-acido);
                    font-family: "JetBrains Mono", monospace;
                    font-size: 16px;
                    font-weight: 400;
                    line-height: 150%;
                    margin: 0;
                }

                .footer-area {
                    flex-shrink: 0;
                    padding: 24px;
                    padding-bottom: calc(env(safe-area-inset-bottom) + 24px);
                    background: var(--Negro-suave);
                    z-index: 10;
                    position: relative;
                }

                .buttons-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    transition: opacity 0.3s ease;
                }

                .loader-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 16px;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                    background: var(--Negro-suave);
                }

                .loader-overlay.active {
                    opacity: 1;
                    pointer-events: all;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(204, 255, 0, 0.2);
                    border-top-color: var(--Verde-acido);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>

            <div class="main-container">
                
                <main class="content-area">
                    <p class="msg-text">${this.dict.t('download_msg_recommended', { modelName: this.recommendedModel.name })}</p>
                    
                    <p class="msg-text">${this.constDict.t(this.recommendedModel.msgKey)}</p>
                    
                    <p class="msg-text">${this.dict.t('download_msg_others')}</p>
                </main>

                <footer class="footer-area">
                    <div class="loader-overlay" id="loader-view">
                        <div class="spinner"></div>
                        <span class="msg-text">${this.dict.t('download_lbl_loading')}</span>
                    </div>

                    <div class="buttons-wrapper" id="buttons-view">
                        ${otherModels.map(m => `<app-btn variant="secondary"label="${m.name} - ${m.size}"data-id="${m.id}"class="btn-download"></app-btn>`).join('')}
                        
                        <app-btn variant="primary" label="${this.dict.t('download_btn_main', { size: this.recommendedModel.size })}" data-id="${this.recommendedModel.id}" class="btn-download"></app-btn>
                    </div>
                </footer>

            </div>
        `;}
_attachListeners(){const buttons=this.querySelectorAll('.btn-download');buttons.forEach(btn=>{btn.addEventListener('click',async(e)=>{const modelId=e.currentTarget.dataset.id;await this._startDownload(modelId);});});}
async _startDownload(modelId){const buttonsView=this.querySelector('#buttons-view');const loaderView=this.querySelector('#loader-view');buttonsView.style.opacity='0';buttonsView.style.pointerEvents='none';loaderView.classList.add('active');try{await labService.downloadModel(modelId);setTimeout(()=>{router.navigate('/training/lab/upload');},500);}catch(error){console.error('Error descargando el modelo:',error);alert(this.dict.t('download_alert_error'));buttonsView.style.opacity='1';buttonsView.style.pointerEvents='all';loaderView.classList.remove('active');}}}
customElements.define('training-lab-setup-download',TrainingLabSetupDownload);