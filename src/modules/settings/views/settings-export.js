import{ICONS}from'../../../core/theme/icons.js';import{bus}from'../../../core/bus/index.js';import{exportService}from'../services/export.service.js';import{i18nService}from'../../../core/i18n/i18n.service.js';import'../../system/components/btn.js';import'../../system/components/input-card.js';import'../../system/components/box.js';export class SettingsExport extends HTMLElement{constructor(){super();this.selectedVaults=['public_store','user_vault','progress_vault','training_vault','nutrition_vault'];this.dict=null;}
async connectedCallback(){this.dict=await i18nService.loadPage('settings/export');this.render();this.addListeners();}
render(){if(!this.dict)return;this.innerHTML=`
            <style>
                @import url('/src/core/theme/variables.css');
                .settings-screen {
                    display: flex;
                    flex-direction: column; width: 100%; height: 100dvh; background: var(--Negro-suave);
                }

                .content-scroll {
                    flex: 1;
                    display: flex; flex-direction: column; padding: 24px; gap: 32px;
                    overflow-y: auto; scrollbar-width: none;
                    border-bottom: 1px solid var(--Blanco);
                }
                .content-scroll::-webkit-scrollbar { display: none; }

                .footer-section {
                    background: var(--Negro-suave);
                    padding: 0 24px 24px 24px; flex-shrink: 0;
                }
                .spacer-24 { height: 24px; }

                .info-box {
                    border: 1px solid var(--Blanco);
                    background: transparent;
                    padding: 16px;
                    color: var(--Blanco);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 14px;
                    line-height: 150%;
                }
            </style>

            <div class="settings-screen">
                <div id="btn-back" style="padding: calc(env(safe-area-inset-top) + 24px) 24px 24px 24px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid var(--Blanco); cursor: pointer; background: var(--Negro-suave); position: sticky; top: 0; z-index: 10;">
                    ${ICONS.ARROW_LEFT}
                    <span style="color: var(--Blanco); font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 500;">
                        ${this.dict.t('export_header')}
                    </span>
                </div>

                <main class="content-scroll">
                    <div class="info-box">
                        ${this.dict.t('export_desc')} <br><br>
                        <span style="color: var(--Verde-acido);">${this.dict.t('export_note_title')}</span> 
                        ${this.dict.t('export_note_desc')}
                    </div>

                    <app-input-card label="${this.dict.t('export_label_vaults')}" grid="1">
                        <app-box class="vault-toggle" data-vault="public_store" clickable active>${this.dict.t('vault_public')}</app-box>
                        <app-box class="vault-toggle" data-vault="user_vault" clickable active>${this.dict.t('vault_user')}</app-box>
                        <app-box class="vault-toggle" data-vault="progress_vault" clickable active>${this.dict.t('vault_progress')}</app-box>
                        <app-box class="vault-toggle" data-vault="training_vault" clickable active>${this.dict.t('vault_training')}</app-box>
                        <app-box class="vault-toggle" data-vault="nutrition_vault" clickable active>${this.dict.t('vault_nutrition')}</app-box>
                    </app-input-card>
                    
                </main>

                <section class="footer-section">
                    <div class="spacer-24"></div>
                    <app-btn variant="primary" label="${this.dict.t('btn_export')}" id="btn-export" style="width: 100%; display: block;"></app-btn>
                </section>
            </div>
        `;}
addListeners(){if(!this.dict)return;this.querySelector('#btn-back').addEventListener('click',()=>window.history.back());this.querySelectorAll('.vault-toggle').forEach(box=>{box.addEventListener('click',()=>{const vaultName=box.dataset.vault;if(this.selectedVaults.includes(vaultName)){this.selectedVaults=this.selectedVaults.filter(v=>v!==vaultName);box.removeAttribute('active');}else{this.selectedVaults.push(vaultName);box.setAttribute('active','');}
const btnExport=this.querySelector('#btn-export');if(this.selectedVaults.length===0){btnExport.setAttribute('disabled','true');}else{btnExport.removeAttribute('disabled');}});});const btnExport=this.querySelector('#btn-export');btnExport.addEventListener('click',async()=>{if(this.selectedVaults.length===0)return;try{btnExport.setAttribute('label',this.dict.t('btn_processing'));btnExport.setAttribute('disabled','true');await exportService.exportData(this.selectedVaults);bus.emit('SYSTEM_NOTIFY',{message:this.dict.t('notify_export_success'),type:'success'});}catch(error){console.error('[EXPORTACIÓN FALLIDA]',error);const errorMsg=error.message.startsWith('err_')?this.dict.t(error.message):this.dict.t('notify_export_error');bus.emit('SYSTEM_NOTIFY',{message:errorMsg,type:'error'});}finally{btnExport.setAttribute('label',this.dict.t('btn_export'));btnExport.removeAttribute('disabled');}});}}
customElements.define('settings-export',SettingsExport);