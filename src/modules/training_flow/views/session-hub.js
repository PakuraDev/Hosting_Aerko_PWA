import{trainingStore}from'../../training_core/store/index.js';import{sessionService}from'../../training_core/services/session.service.js';import{router}from'../../../core/router/index.js';import{ICONS}from'../../../core/theme/icons.js';import{i18nService}from'../../../core/i18n/i18n.service.js';import'../components/exercise-check.js';export class TrainingSessionHub extends HTMLElement{constructor(){super();}
async connectedCallback(){this.session=trainingStore.getActiveSession();if(!this.session){router.navigate('/training');return;}
this.i18n=await i18nService.loadPage('training_flow/session-hub');this.render();this._attachListeners();}
render(){const routineName=this.session.routineName||this.i18n.t('hub_fallback_routine');const exercises=this.session.exercises||[];const exercisesHtml=exercises.map(ex=>{const isCompleted=ex.sets&&ex.sets.length>0;const status=isCompleted?'completed':'pending';const nombreAMostrar=ex.name||this.i18n.t(ex.nameKey);return`
                <app-exercise-check 
                    name="${ex.name}" 
                    status="${status}"
                    data-id="${ex.id}">
                </app-exercise-check>
            `;}).join('');this.innerHTML=`
            <style>
                @import url('/src/core/theme/variables.css');

                training-session-hub {
                    display: block;
                    width: 100%;
                    height: 100dvh;
                    background-color: var(--Negro-suave);
                    overflow: hidden;
                }

                .hub-container {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    margin: 0 auto;
                }

                /* 1. HEADER (Fijo) */
                .header-bar {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: calc(env(safe-area-inset-top) + 16px) 24px 16px 24px;
                    border-bottom: 1px solid var(--Blanco);
                    background: var(--Negro-suave);
                    flex-shrink: 0;
                    z-index: 10;
                }

                .back-btn {
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    color: var(--Blanco);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                }
                
                .back-btn svg {
                    width: 100%;
                    height: 100%;
                    fill: currentColor;
                }

                .screen-title {
                    font-family: "JetBrains Mono", monospace;
                    font-size: 16px; /* Ajuste visual según captura */
                    font-weight: 500;
                    color: var(--Blanco);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* 2. CONTENIDO (Lista Scrollable) */
                .scroll-content {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding: 24px;
                    flex: 1;
                    overflow-y: auto;
                    scrollbar-width: none;
                }
                .scroll-content::-webkit-scrollbar { display: none; }

                /* Espaciador final para que el botón no tape el último item al hacer scroll */
                .spacer-bottom {
                    height: 80px; 
                    flex-shrink: 0;
                }

                /* 3. BOTÓN FLOTANTE / FIJO (Según captura está abajo del todo) */
                .footer-action {
                    padding: 0 24px calc(env(safe-area-inset-bottom) + 24px) 24px;
                    background: var(--Negro-suave);
                    /* Si quieres que flote sobre el contenido con gradiente: */
                    /* background: linear-gradient(to top, var(--Negro-suave) 80%, transparent); */
                    z-index: 20;
                    flex-shrink: 0;
                }

                .btn-finish {
                    display: flex;
                    width: 100%;
                    height: 56px;
                    justify-content: center;
                    align-items: center;
                    background: var(--Verde-acido);
                    color: var(--Negro-suave);
                    font-family: "JetBrains Mono", monospace;
                    font-size: 16px;
                    font-weight: 500;
                    border: none;
                    cursor: pointer;
                    /* Sin bordes redondeados según captura, o muy sutiles */
                    transition: background 0.2s;
                }
                
                .btn-finish:active {
                    background: var(--verde-lima-hover);
                }

            </style>

            <div class="hub-container">
                
                <header class="header-bar">
                    <button class="back-btn" id="btn-back">
                        ${ICONS.ARROW_LEFT}
                    </button>
                    <span class="screen-title">${routineName}</span>
                </header>

                <main class="scroll-content">
                    ${exercisesHtml}
                    <div class="spacer-bottom"></div>
                </main>

                <footer class="footer-action">
                    <button class="btn-finish" id="btn-finish">
                        ${this.i18n.t('hub_btn_finish')}
                    </button>
                </footer>

            </div>
        `;}
_attachListeners(){const items=this.querySelectorAll('app-exercise-check');items.forEach(item=>{item.addEventListener('click',()=>{const exerciseId=item.dataset.id;router.navigate(`/training/runner/${exerciseId}`);});});const btnBack=this.querySelector('#btn-back');if(btnBack){btnBack.addEventListener('click',()=>{router.navigate('/training');});}
const btnFinish=this.querySelector('#btn-finish');if(btnFinish){btnFinish.addEventListener('click',async()=>{try{await sessionService.finishSession();router.navigate('/training');}catch(e){alert(this.i18n.t('hub_err_save')+e.message);}});}}}
customElements.define('training-session-hub',TrainingSessionHub);