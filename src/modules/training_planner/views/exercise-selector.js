import{router}from'../../../core/router/index.js';import{trainingStore}from'../../training_core/store/index.js';import{trainingService}from'../../training_core/services/training.service.js';import{ICONS}from'../../../core/theme/icons.js';import{i18nService}from'../../../core/i18n/i18n.service.js';import'../components/exercise-card.js';import'../components/filter-modal.js';export class TrainingExerciseSelector extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'});this.searchTerm='';this.routineId=null;this.exercises=[];this.activeFilters={type:'none',values:[]};this.dict=null;}
async connectedCallback(){await trainingService.init();this.dict=await i18nService.loadPage('training_planner/exercise-selector');this.exercises=trainingStore.getAllExercises();this.render();this._attachListeners();this._updateList();}
getFilteredExercises(){let result=this.exercises;if(this.searchTerm){const term=this.searchTerm.toLowerCase();result=result.filter(ex=>{const name=(ex.name&&ex.name.es)?ex.name.es.toLowerCase():(ex.name||'').toLowerCase();return name.includes(term);});}
if(this.activeFilters.type==='category'){result=result.filter(ex=>this.activeFilters.values.includes(ex.category));}
else if(this.activeFilters.type==='muscle'){result=result.filter(ex=>{if(!ex.impact||!ex.impact.targets)return false;return ex.impact.targets.some(target=>this.activeFilters.values.includes(target));});}
return result;}
render(){this.shadowRoot.innerHTML=`
            <style>
                @import url('/src/core/theme/variables.css');

                :host {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100dvh;
                    background: var(--Negro-suave);
                    box-sizing: border-box;
                    
                    /* AJUSTE SOLICITADO: Padding top 8px y Gap 24px entre bloques */
                    padding-top: 8px; 
                    gap: 24px;
                    overflow: hidden;
                }

                /* --- MENÚ SUPERIOR (Estilo Nutrition Add View) --- */
                .menu-superior {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    width: 100%;
                    flex-shrink: 0;
                }

                /* Parte 1: Título y Atrás */
                .parte-superior {
                    display: flex;
                    padding: 8px 24px;
                    align-items: center;
                    gap: 16px;
                    align-self: stretch;
                    border-bottom: 1px solid var(--Blanco);
                    cursor: pointer;
                }

                .title-text {
                    color: var(--Blanco);
                    font-family: "JetBrains Mono";
                    font-size: 16px;
                    font-weight: 400;
                    line-height: 150%;
                }

                .icon-back svg {
                    width: 24px; height: 24px; fill: var(--Blanco);
                }

                /* Parte 2: Buscador + Acciones */
                .parte-inferior {
                    display: flex;
                    align-items: center;
                    align-self: stretch;
                    gap: 0; /* Bordes compartidos */
                }

                /* Input Buscador */
                .buscador-frame {
                    display: flex;
                    flex: 1; /* Ocupa todo el espacio disponible */
                    padding: 8px 8px 8px 24px;
                    align-items: center;
                    justify-content: space-between;
                    
                    border-right: 1px solid var(--Blanco);
                    border-bottom: 1px solid var(--Blanco);
                }

                .search-input {
                    background: transparent;
                    border: none;
                    color: var(--Blanco);
                    font-family: "JetBrains Mono";
                    font-size: 16px;
                    width: 100%;
                    outline: none;
                }
                .search-input::placeholder {
                    color: var(--gris-hover);
                }

                /* 1. El contenedor (div) */
                .icon-search {
                    display: flex;       /* Crucial: elimina el espacio extra de "texto" */
                    align-items: center; /* Centra verticalmente */
                    justify-content: center;
                    height: 24px;        /* Forzamos la altura exacta */
                    width: auto;         /* El ancho se adapta al contenido */
                }

                /* 2. El icono (svg) dentro */
                .icon-search svg {
                    height: 100%;        /* Llena los 24px de alto del padre */
                    width: auto;         /* Mantiene la proporción (no se deforma) */
                    fill: var(--Blanco);
                }

                /* Botón Filtro (Usando estilo 'escanear-frame') */
                .escanear-frame {
                    display: flex;
                    /* Ajustamos el padding para que sea simétrico y bonito */
                    padding: 8px 12px; 
                    align-items: center;
                    justify-content: center;
    
                    border-right: 1px solid var(--Blanco);
                    border-bottom: 1px solid var(--Blanco);
                    cursor: pointer;
                    color: var(--Blanco);
                }

                /* Botón Crear (Usando estilo 'add-custom-frame') */
                .add-custom-frame {
                    display: flex;
                    padding: 8px 24px 8px 8px;
                    align-items: center;
                    justify-content: center;
                    
                    border-bottom: 1px solid var(--Blanco);
                    
                    cursor: pointer;
                    color: var(--Blanco);
                }
                
                .icon-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .icon-btn svg { 
                    width: 24px; 
                    height: 24px; 
                    fill: currentColor; /* IMPORTANTE: Para que el JS pueda cambiar el color al activar filtro */
                }
                
                /* Efectos Hover/Active */
                .escanear-frame:active, .add-custom-frame:active, .parte-superior:active {
                    background: rgba(255,255,255,0.1);
                }

                /* --- LISTA (Scrollable) --- */
                .list-container {
                    flex: 1;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;

                    padding: 0 24px;
                    gap: 8px;
                    
                    /* Scrollbar oculta */
                    scrollbar-width: none; 
                }
                .list-container::-webkit-scrollbar { display: none; }

                /* Mensaje Vacío */
                .empty-state {
                    padding: 40px;
                    text-align: center;
                    color: var(--gris-hover);
                    font-family: "JetBrains Mono";
                    font-size: 14px;
                    opacity: 0.7;
                }
                
                /* --- MODAL CONTAINER (Placeholder) --- */
                #filter-modal-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 9999;
                }
            </style>

            <div class="menu-superior">
                <div class="parte-superior" id="btn-back">
                    <div class="icon-back">${ICONS.ARROW_LEFT}</div>
                    <span class="title-text">${this.dict.t('header_title')}</span>
                </div>

                <div class="parte-inferior">
                    <div class="buscador-frame">
                        <input type="text" class="search-input" id="input-search" placeholder="${this.dict.t('placeholder_search')}">
                        <div class="icon-search">${ICONS.SEARCH}</div>
                    </div>
                    
                    <div class="escanear-frame" id="btn-filter" aria-label="${this.dict.t('aria_filter')}">
                        <div class="icon-btn">${ICONS.FUNNEL || ''}</div>
                    </div>
                    
                    <div class="add-custom-frame" id="btn-create" aria-label="${this.dict.t('aria_create')}">
                        <div class="icon-btn">${ICONS.PLUS}</div>
                    </div>
                </div>
            </div>

            <div class="list-container" id="list-container">
            </div>

            <training-filter-modal id="filter-modal"></training-filter-modal>
        `;}
_attachListeners(){this.shadowRoot.getElementById('btn-back').addEventListener('click',()=>{window.history.back();});const input=this.shadowRoot.getElementById('input-search');input.addEventListener('input',(e)=>{this.searchTerm=e.target.value;this._updateList();});this.shadowRoot.getElementById('btn-create').addEventListener('click',()=>{router.navigate('/training/planner/exercise/create');});const modal=this.shadowRoot.getElementById('filter-modal');this.shadowRoot.getElementById('btn-filter').addEventListener('click',()=>{modal.open(this.activeFilters);});modal.addEventListener('filter-change',(e)=>{this.activeFilters=e.detail;const btnFilter=this.shadowRoot.getElementById('btn-filter');const svgPaths=btnFilter.querySelectorAll('svg path');if(this.activeFilters.type!=='none'){btnFilter.style.color='var(--Verde-acido)';svgPaths.forEach(path=>{path.style.stroke='var(--Verde-acido)';});}else{btnFilter.style.color='var(--Blanco)';svgPaths.forEach(path=>{path.style.stroke='var(--Blanco)';});}
this._updateList();});const list=this.shadowRoot.getElementById('list-container');list.addEventListener('click',(e)=>{const card=e.target.closest('training-exercise-card');if(card){this._handleSelection(card.id);}});list.addEventListener('delete',async(e)=>{const exerciseId=e.detail.id;if(confirm(this.dict.t('alert_delete_exercise'))){await trainingService.deleteExercise(exerciseId);this.exercises=trainingStore.getAllExercises();this._updateList();}});}
_updateList(){const container=this.shadowRoot.getElementById('list-container');const filtered=this.getFilteredExercises();container.innerHTML='';if(filtered.length===0){container.innerHTML=`<div class="empty-state">${this.dict.t('empty_search')}</div>`;return;}
const fragment=document.createDocumentFragment();filtered.forEach(ex=>{const card=document.createElement('training-exercise-card');card.data=ex;fragment.appendChild(card);});container.appendChild(fragment);}
async _handleSelection(exerciseId){console.log(`[SELECTOR] Selected: ${exerciseId}`);trainingStore.addExerciseToDraft(exerciseId);window.history.back();}}
customElements.define('training-exercise-selector',TrainingExerciseSelector);