import{router}from'../../../core/router/index.js';import{nutritionStore}from'../../nutrition_core/store/index.js';import{nutritionService}from'../../nutrition_core/services/nutrition.service.js';import{journalService}from'../../nutrition_core/services/journal.service.js';import{i18nService}from'../../../core/i18n/i18n.service.js';import{ICONS}from'../../../core/theme/icons.js';import'../../system/components/input-card.js';import'../../system/components/segment-select.js';import'../../system/components/btn.js';import'../../system/components/navbar.js';export class NutritionMealCreate extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'});this.dict=null;this.state={label:'',time:'14:00',notification:false};}
async connectedCallback(){await nutritionService.init();this.dict=await i18nService.loadPage('nutrition_diet/nutrition-meal-create');this.render();this.setupListeners();this._toggleTimeInput(this.state.notification);}
render(){this.shadowRoot.innerHTML=`
        <style>
            @import url('/src/core/theme/variables.css');
            /* 👇👇 AQUÍ ESTÁ EL ARREGLO 👇👇 */
            @import url('/src/modules/system/components/btn.css');    /* Importamos estilos del botón */
            @import url('/src/modules/system/components/navbar.css'); /* Importamos estilos del nav */
            
            * { box-sizing: border-box; margin: 0; padding: 0; }

            :host {
                display: flex;
                flex-direction: column;
                width: 100%;
                min-height: 100dvh;
                background: var(--Negro-suave);
                
                /* FRAME PRINCIPAL */
                padding-top: 8px;
                padding-bottom: 0px;
                gap: 24px;
            }

            /* --- 1. HEADER --- */
            .header {
                display: flex;
                padding: 8px 24px;
                align-items: center;
                gap: 16px;
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
                width: 24px;
                height: 24px; 
                fill: var(--Blanco);
            }

            /* --- 2. CONTENIDO PRINCIPAL --- */
            .main-content {
                display: flex;
                padding: 0 24px;
                flex-direction: column;
                align-items: flex-start;
                gap: 16px;
                flex: 1 0 0; 
                align-self: stretch;
            }

            /* Estilos de Inputs (Línea inferior) */
            .input-line {
                width: 100%;
                background: transparent;
                border: none;
                border: 1px solid var(--Blanco); 
                padding: 12px;
                
                color: var(--Blanco);
                font-family: 'JetBrains Mono', monospace; 
                font-size: 16px;
                outline: none;
                border-radius: 0; 
            }
            
            .input-line::placeholder {
                color: var(--gris-hover);
                opacity: 0.5;
            }

            input[type="time"]::-webkit-calendar-picker-indicator {
                filter: invert(1);
                cursor: pointer;
            }

            .disabled-block {
                opacity: 0.5;
                pointer-events: none;
            }

            /* --- BOTÓN --- */
            .action-section {
                padding: 0 24px; 
                display: flex;
                flex-direction: column;
            }
            
            /* Estilo del wrapper */
            app-btn {
                width: 100%;
                display: block;
            }

            /* 🔥 EL FIX DEL BOTÓN 🔥 
               Esto obliga al botón HTML nativo (que está dentro de app-btn)
               a ocupar todo el espacio que le da su padre. */
            app-btn .btn {
                width: 100% !important; 
                justify-content: center;
            }

            /* --- 4. NAV --- */
            .nav-container {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                z-index: 100;
            }
        </style>

        <div class="header" id="btn-back">
            <div class="icon-back">${ICONS.ARROW_LEFT}</div>
            <span class="title-text">${this.dict.t('meal_create_header')}</span>
        </div>

        <main class="main-content">
            <app-input-card label="${this.dict.t('meal_create_label_name')}">
    <input type="text" class="input-line" id="input-name" 
           placeholder="${this.dict.t('meal_create_placeholder_name')}" autocomplete="off">
</app-input-card>

            <app-input-card label="${this.dict.t('meal_create_label_notif')}">
                <app-segment-select id="notification-toggle"></app-segment-select>
            </app-input-card>

            <div id="group-time" style="width: 100%">
               <app-input-card label="${this.dict.t('meal_create_label_time')}">
                    <input type="time" class="input-line" id="input-time" 
                           value="${this.state.time}">
                </app-input-card>
            </div>
        </main>

        <div class="action-section">
            <app-btn 
                variant="primary" 
                label="${this.dict.t('meal_create_btn_create')}"
                id="btn-create">
            </app-btn>
        </div>
        `;const toggle=this.shadowRoot.getElementById('notification-toggle');toggle.setOptions([{value:'off',label:this.dict.t('meal_create_toggle_off')},{value:'on',label:this.dict.t('meal_create_toggle_on')}]);toggle.setAttribute('value','off');}
setupListeners(){this.shadowRoot.getElementById('btn-back').addEventListener('click',()=>{window.history.back();});this.shadowRoot.getElementById('input-name').addEventListener('input',(e)=>{this.state.label=e.target.value;});const toggle=this.shadowRoot.getElementById('notification-toggle');toggle.addEventListener('change',async(e)=>{const wantsOn=e.detail.value==='on';if(wantsOn){const hasPermission=await this._requestNotificationPermission();if(!hasPermission){toggle.setAttribute('value','off');this.state.notification=false;this._toggleTimeInput(false);return;}}
this.state.notification=wantsOn;this._toggleTimeInput(wantsOn);});this.shadowRoot.getElementById('input-time').addEventListener('change',(e)=>{this.state.time=e.target.value;});this.shadowRoot.getElementById('btn-create').addEventListener('click',()=>{this.handleCreate();});}
_toggleTimeInput(isEnabled){const group=this.shadowRoot.getElementById('group-time');if(isEnabled){group.classList.remove('disabled-block');}else{group.classList.add('disabled-block');}}
async _requestNotificationPermission(){if(!('Notification'in window)){alert('Tu navegador no soporta notificaciones locales.');return false;}
if(Notification.permission==='granted'){return true;}
if(Notification.permission==='denied'){alert('Las notificaciones están bloqueadas. Actívalas en los ajustes de tu navegador o móvil.');return false;}
const permission=await Notification.requestPermission();return permission==='granted';}
async handleCreate(){if(!this.state.label.trim()){alert(this.dict.t('meal_create_alert_name_req'));return;}
try{const currentIds=nutritionStore.getMealPlanIds()||[];const nextId=`plan_meal_${Date.now()}`;const orderIndex=currentIds.length;await journalService.saveMealPlan(nextId,orderIndex,this.state.label,this.state.time,this.state.notification);nutritionStore.setMealPlanIds([...currentIds,nextId]);router.navigate('/nutrition');}catch(e){console.error(e);alert(this.dict.t('meal_create_err_save'));}}}
customElements.define('nutrition-meal-create',NutritionMealCreate);