import{router}from'../../../core/router/index.js';import{ICONS}from'../../../core/theme/icons.js';import{i18nService}from'../../../core/i18n/i18n.service.js';import'../../system/components/navbar.js';export class SettingsDashboard extends HTMLElement{constructor(){super();this.dict=null;this.menuOptions=[{labelKey:'menu_basic',path:'/settings/basic'},{labelKey:'menu_lang',path:'/settings/language'},{labelKey:'menu_mode',path:'/settings/mode'},{labelKey:'menu_pin',path:'/settings/pin'},{labelKey:'menu_install_android',action:'install-android'},{labelKey:'menu_install_ios',path:'/settings/install-ios'},{labelKey:'menu_export',path:'/settings/export'},{labelKey:'menu_easter_egg',action:'easter-egg'}];}
async connectedCallback(){this.dict=await i18nService.loadPage('settings/dashboard');const prefs=i18nService.getPreferences();const hasColeccion=this.menuOptions.some(opt=>opt.path==='/settings/collection');if(prefs.mode==='c'&&!hasColeccion){this.menuOptions.push({labelKey:'menu_tsundere_collection',path:'/settings/collection'});}
else if(prefs.mode!=='c'&&hasColeccion){this.menuOptions=this.menuOptions.filter(opt=>opt.path!=='/settings/collection');}
this.render();this._attachListeners();}
render(){if(!this.dict)return;this.innerHTML=`
            <style>
                @import url('/src/core/theme/variables.css');

                :host {
                    display: block;
                    width: 100%;
                    height: 100dvh;
                    background-color: var(--Negro-suave);
                    color: var(--Blanco);
                    overflow: hidden;
                }

                .screen-container {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100dvh;
                    max-width: 480px;
                    margin: 0 auto;
                }

                /* HEADER FIJO */
                .header-section {
                    display: flex;
                    flex-direction: column;
                    padding: calc(env(safe-area-inset-top) + 24px) 24px 24px 24px;
                    background: var(--Negro-suave);
                    flex-shrink: 0;
                    z-index: 10;
                }

                .screen-title {
                    color: var(--Verde-acido);
                    font-family: "Clash Display", sans-serif;
                    font-size: 48px;
                    font-weight: 700;
                    line-height: 100%;
                    letter-spacing: -0.48px;
                    margin: 0;
                }

                /* SCROLL PRINCIPAL */
                .content-scroll {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                    scrollbar-width: none; /* Oculta barra en Firefox */
                }
                .content-scroll::-webkit-scrollbar { display: none; /* Oculta barra en Chrome/Safari */ }

                /* LISTA DE AJUSTES */
                .settings-list {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    /* Borde superior que enmarca la primera opción */
                    border-top: 1px solid var(--Blanco); 
                }

                .setting-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px;
                    background: transparent;
                    border-bottom: 1px solid var(--Blanco);
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .setting-item:active {
                    background: rgba(255, 255, 255, 0.05);
                }

                .setting-label {
                    color: var(--Blanco);
                    font-family: "JetBrains Mono", monospace;
                    font-size: 16px;
                    font-weight: 400;
                    line-height: 150%;
                }

                .setting-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    color: var(--Blanco);
                }

                /* FOOTER */
                .footer-section {
                    flex-shrink: 0;
                    background: var(--Negro-suave);
                }
            </style>

            <div class="screen-container">
                <header class="header-section">
                    <h1 class="screen-title">${this.dict.t('menu_title_settings')}</h1>
                </header>

                <main class="content-scroll">
                    <div class="settings-list">
                        ${this.menuOptions.map(opt => `<div class="setting-item"data-path="${opt.path || ''}"data-action="${opt.action || ''}"><span class="setting-label">${this.dict.t(opt.labelKey)}</span><div class="setting-icon">${ICONS.ARROW_RIGHT_CIRCLE}</div></div>`).join('')}
                    </div>
                </main>
                
                <footer class="footer-section">
                    <app-nav></app-nav>
                </footer>
            </div>
        `;}
_attachListeners(){this.querySelectorAll('.setting-item').forEach(item=>{item.addEventListener('click',async()=>{const path=item.getAttribute('data-path');const action=item.getAttribute('data-action');if(path){router.navigate(path);}else if(action==='install-android'){if(window.deferredPrompt){window.deferredPrompt.prompt();const{outcome}=await window.deferredPrompt.userChoice;console.log(`[PWA] El usuario ha ${outcome === 'accepted' ? 'aceptado' : 'rechazado'} la instalación.`);window.deferredPrompt=null;}else{alert(this.dict.t('alert_pwa_installed'));}}else if(action==='easter-egg'){const rand=Math.random();let url='';if(rand<0.50){url='https://youtu.be/xMHJGd3wwZk?si=WMk3EFM1hry10uf0';}else if(rand<0.75){url='https://youtu.be/VoQ1q41iJS0?si=fPy_jswtSU6pMv78';}else{url='https://youtu.be/7areAUZq9qI?si=eQiogelKmo-Lk7Hw';}
window.open(url,'_blank');}});});}}
if(!customElements.get('settings-dashboard')){customElements.define('settings-dashboard',SettingsDashboard);}