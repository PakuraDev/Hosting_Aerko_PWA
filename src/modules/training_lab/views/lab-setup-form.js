import{db}from'../../../core/db/index.js';import{router}from'../../../core/router/index.js';import'../../system/components/section-header.js';import'../../system/components/input-card.js';import'../../system/components/select-list.js';import'../../system/components/btn.js';import{i18nService}from'../../../core/i18n/i18n.service.js';export class TrainingLabSetupForm extends HTMLElement{constructor(){super();this.state={hardware_tier:null,preference:null};this.tierOptions=[{value:'1',labelKey:'setup_tier_1'},{value:'2',labelKey:'setup_tier_2'},{value:'3',labelKey:'setup_tier_3'},{value:'4',labelKey:'setup_tier_4'},{value:'5',labelKey:'setup_tier_5'}];this.preferenceOptions=[{value:'speed',labelKey:'setup_pref_speed'},{value:'balanced',labelKey:'setup_pref_balanced'},{value:'precision',labelKey:'setup_pref_precision'}];}
async connectedCallback(){this.dict=await i18nService.loadPage('training_lab/lab-setup-form');this.render();setTimeout(()=>{this._initOptions();this._attachListeners();},0);}
render(){this.innerHTML=`
            <style>
                @import url('/src/core/theme/variables.css');
                @import url('/src/core/theme/main.css');

                /* Estilos base para el contenedor (Sustituimos :host por el tag) */
                training-lab-setup-form {
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

                /* El área del Header, siempre firme arriba como el busto de Lopera */
                .header-area {
                    flex-shrink: 0;
                    width: 100%;
                    padding-top: env(safe-area-inset-top);
                    background: var(--Negro-suave);
                    z-index: 10;
                }

                /* El contenido central, con su scroll para no perder detalle */
                .content-area {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    padding: 24px;
                    gap: 32px;
                    overflow-y: auto;
                    scrollbar-width: none;
                }
                .content-area::-webkit-scrollbar { 
                    display: none;
                }

                /* Footer fijo, para rematar el partido con el botón de continuar */
                .footer-area {
                    flex-shrink: 0;
                    padding: 24px;
                    padding-bottom: calc(env(safe-area-inset-bottom) + 24px);
                    background: var(--Negro-suave);
                    z-index: 10;
                }
            </style>

            <div class="main-container">
                
                <header class="header-area">
                    <app-section-header 
                        title="MediaPipe" 
                        text="">
                    </app-section-header>
                </header>

                <main class="content-area">
                    <app-input-card label="${this.dict.t('setup_lbl_tier')}">
                        <app-select-list id="tier-selector"></app-select-list>
                    </app-input-card>

                    <app-input-card label="${this.dict.t('setup_lbl_priority')}">
                        <app-select-list id="priority-selector"></app-select-list>
                    </app-input-card>
                </main>

                <footer class="footer-area">
                    <app-btn variant="primary" label="${this.dict.t('setup_btn_next')}" id="btn-next"></app-btn>
                </footer>

            </div>
        `;}
_initOptions(){const tierSelector=this.querySelector('#tier-selector');if(tierSelector){const translatedTiers=this.tierOptions.map(opt=>({value:opt.value,label:this.dict.t(opt.labelKey)}));tierSelector.setOptions(translatedTiers);}
const prioritySelector=this.querySelector('#priority-selector');if(prioritySelector){const translatedPrefs=this.preferenceOptions.map(opt=>({value:opt.value,label:this.dict.t(opt.labelKey)}));prioritySelector.setOptions(translatedPrefs);}}
_attachListeners(){const tierSelector=this.querySelector('#tier-selector');if(tierSelector){tierSelector.addEventListener('change',(e)=>{this.state.hardware_tier=parseInt(e.detail.value,10);});}
const prioritySelector=this.querySelector('#priority-selector');if(prioritySelector){prioritySelector.addEventListener('change',(e)=>{this.state.preference=e.detail.value;});}
const btnNext=this.querySelector('#btn-next');if(btnNext){btnNext.addEventListener('click',async()=>{if(!this.state.hardware_tier||!this.state.preference){alert(this.dict.t('setup_alert_missing'));return;}
try{const config={id:'training_lab_config',hardware_tier:this.state.hardware_tier,preference:this.state.preference,is_downloaded:false};await db.put('public_store',config);console.log('🟢⚪ Táctica guardada con éxito:',config);router.navigate('/training/lab/download');}catch(error){console.error('Error al guardar la configuración del Lab:',error);}});}}}
customElements.define('training-lab-setup-form',TrainingLabSetupForm);