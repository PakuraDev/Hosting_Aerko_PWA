import{trainingStore}from'../../training_core/store/index.js';import{sessionService}from'../../training_core/services/session.service.js';import{trainingService}from'../../training_core/services/training.service.js';import{router}from'../../../core/router/index.js';import{analysisService}from'../../training_core/services/analysis.service.js';import{ICONS}from'../../../core/theme/icons.js';import{i18nService}from'../../../core/i18n/i18n.service.js';import'../components/routine-row.js';import'../../system/components/navbar.js';export class TrainingSessionSelector extends HTMLElement{constructor(){super();}
async connectedCallback(){await trainingService.init();const dict=await i18nService.loadPage('training_flow/session-selector');this.t=dict.t;this.render();this._attachListeners();}
_getMesocycleHTML(){const mesocycle=trainingStore.state.mesocycle||null;if(!mesocycle){return`
                <div class="weekly-card empty-state" id="btn-config-meso">
                    <span class="action-link">${this.t('selector_btn_config_meso')}</span>
                </div>
            `;}
const currentWeek=mesocycle.currentWeek||1;const totalWeeks=mesocycle.totalWeeks||4;let linesHtml='';for(let i=0;i<4;i++){const weekIndex=currentWeek+i;if(weekIndex>totalWeeks){linesHtml+=`<div class="meso-line empty-line"></div>`;continue;}
const rir=analysisService.getTargetRIR(weekIndex,totalWeeks);let phase=this.t('selector_meso_phase_load');if(rir===4)phase=this.t('selector_meso_phase_deload');if(rir===0)phase=this.t('selector_meso_phase_peak');const isCurrent=(i===0);const activeClass=isCurrent?'current':'';const prefix=isCurrent?'> ':'&nbsp;&nbsp;';const weekInfo=this.t('selector_meso_week_info',{week:weekIndex,phase:phase,rir:rir});linesHtml+=`<div class="meso-line ${activeClass}">${prefix}${weekInfo}</div>`;}
return`
            <div class="weekly-card">
                <div class="weekly-text">
                    ${linesHtml}
                </div>
                <div class="edit-icon-wrapper" id="btn-edit-meso">
                    ${ICONS.EDIT}
                </div>
            </div>
        `;}
render(){const routines=trainingStore.getRoutines();const mesocycleCard=this._getMesocycleHTML();const routinesHtml=routines.length>0?routines.map(r=>`
                <app-routine-row 
                    name="${r.name}" 
                    data-id="${r.id}">
                </app-routine-row>
              `).join(''):`<div class="no-routines">${this.t('selector_empty_routines')}</div>`;this.innerHTML=`
            <style>
                @import url('/src/core/theme/variables.css');

                /* ESTRUCTURA PRINCIPAL (Igual que Planner) */
                training-session-selector {
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
                    height: 100%;
                    margin: 0 auto;
                }

                /* 1. HEADER (Fijo) */
                .header-section {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding: calc(env(safe-area-inset-top) + 16px) 24px 24px 24px;
                    border-bottom: 1px solid var(--Blanco);
                    background: var(--Negro-suave);
                    flex-shrink: 0;
                    z-index: 10;
                }

                .main-title {
                    color: var(--Verde-acido);
                    font-family: "Clash Display", sans-serif;
                    font-size: 40px;
                    font-weight: 700;
                    line-height: 110%;
                    letter-spacing: -0.4px;
                    margin: 0;
                }

                /* TARJETA MESOCICLO (Flexbox Responsive) */
                .weekly-card {
                    display: flex;
                    padding: 12px;
                    justify-content: space-between; /* Texto a la izq, Lápiz a la der */
                    align-items: center; /* Centrado vertical */
                    border: 1px solid var(--Blanco);
                    min-height: 104px; /* Asegura altura mínima para 4 líneas */
                    gap: 16px; /* Separación fluida entre texto y lápiz */
                }

                .weekly-card.empty-state {
                    justify-content: center;
                    cursor: pointer;
                    opacity: 0.8;
                }

                .weekly-text {
                    display: flex;
                    flex-direction: column;
                    gap: 8px; /* El gap nativo en vez de los 131px absolutos */
                    flex: 1; /* Ocupa todo el espacio disponible empujando al lápiz */
                }

                .meso-line {
                    color: var(--Blanco);
                    font-family: "JetBrains Mono", monospace;
                    font-size: 14px;
                    line-height: 100%;
                    text-align: left;
                }

                .meso-line.current {
                    color: var(--Verde-acido);
                }

                .meso-line.empty-line {
                    height: 14px; /* Ocupa el mismo alto que una línea de texto para que no colapse */
                }

                /* Contenedor del Lápiz */
                .edit-icon-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    flex-shrink: 0; /* Evita que el texto lo aplaste */
                }

                .edit-icon-wrapper svg {
                    width: 18px;
                    height: 18px;
                    fill: var(--Blanco);
                    transition: fill 0.2s ease;
                }

                .edit-icon-wrapper:active svg {
                    fill: var(--Verde-acido);
                }

                .action-link {
                    text-decoration: underline;
                    text-decoration-color: var(--Verde-acido);
                    text-underline-offset: 4px;
                    font-family: "JetBrains Mono", monospace;
                    font-size: 14px;
                    color: var(--Blanco);
                }
                .empty-state:hover .action-link { color: var(--Verde-acido); }

                /* 2. CONTENIDO (Scrollable) */
                .main-content {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding: 24px;
                    flex: 1; 
                    overflow-y: auto;
                    scrollbar-width: none;
                    
                    /* Táctica "Dedo Gordo": Alineamos al fondo si hay pocas */
                    justify-content: flex-end; 
                }
                .main-content::-webkit-scrollbar { display: none; }

                .no-routines {
                    color: var(--Blanco);
                    text-align: center;
                    opacity: 0.5;
                    margin-bottom: auto; 
                    margin-top: 24px;
                    font-family: "JetBrains Mono";
                }

                /* 3. FOOTER (Navbar Fijo) */
                .footer-section {
                    flex-shrink: 0;
                    width: 100%;
                    z-index: 100;
                }
            </style>

            <div class="main-container">
                
                <header class="header-section">
                    <h1 class="main-title">${this.t('selector_title')}</h1>
                    ${mesocycleCard} 
                </header>

                <main class="main-content">
                    ${routinesHtml}
                </main>

                <footer class="footer-section">
                    <app-nav></app-nav>
                </footer>

            </div>
        `;}
_attachListeners(){const rows=this.querySelectorAll('app-routine-row');rows.forEach(row=>{row.addEventListener('click',async()=>{const routineId=row.getAttribute('data-id');row.style.opacity='0.5';try{await sessionService.startSession(routineId);router.navigate('/training/session');}catch(error){console.error("Error al iniciar sesión:",error);row.style.opacity='1';alert(this.t('selector_err_start'));}});});const btnConfig=this.querySelector('#btn-config-meso');const btnEdit=this.querySelector('#btn-edit-meso');const goConfig=()=>{router.navigate('/training/analysis/mesocycle');};if(btnConfig){btnConfig.addEventListener('click',goConfig);}
if(btnEdit){btnEdit.addEventListener('click',goConfig);}}}
customElements.define('training-session-selector',TrainingSessionSelector);