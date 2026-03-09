import{nutritionStore}from'../../nutrition_core/store/index.js';import{nutritionService}from'../../nutrition_core/services/nutrition.service.js';import{pantryService}from'../../nutrition_core/services/pantry.service.js';import{i18nService}from'../../../core/i18n/i18n.service.js';import{ICONS}from'../../../core/theme/icons.js';import{db}from'../../../core/db/index.js';import'../../system/components/btn.js';import'../../system/components/navbar.js';import'../../system/components/input-card.js';import'../../system/components/keypad-modal.js';export class NutritionFoodMacrosEdit extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'});this.state={id:null,name:'',k:0,p:0,c:0,f:0};this.targetMeal='default';this.dict=null;}
async connectedCallback(){this.dict=await i18nService.loadPage('nutrition_diet/nutrition-food-macros-edit');await nutritionService.init();const hash=window.location.hash;const parts=hash.split('/');const idAndQuery=parts[3]||'';const[id,queryString]=idAndQuery.split('?');const params=new URLSearchParams(queryString);this.state.id=id;this.targetMeal=params.get('meal')||'default';const food=pantryService.getFoodById(id);if(!food){alert(this.dict.t('macros_edit_err_not_found'));window.history.back();return;}
const prefs=i18nService.getPreferences();this.state.name=pantryService.getFoodName(food,prefs.lang);this.state.k=food.k;this.state.p=food.p;this.state.c=food.c;this.state.f=food.f;this.render();this.setupListeners();this.updateUI();}
render(){this.shadowRoot.innerHTML=`
        <style>
            @import url('/src/core/theme/variables.css');
            @import url('/src/modules/system/components/btn.css');
            @import url('/src/modules/system/components/keypad.css'); 
            @import url('/src/modules/system/components/keypad-modal.css');
            
            * { box-sizing: border-box; margin: 0; padding: 0; }

            :host {
                display: flex;
                flex-direction: column;
                width: 100%;
                min-height: 100dvh;
                background: var(--Negro-suave);
                padding-top: 8px;
                padding-bottom: 0px;
                gap: 24px;
            }

            /* HEADER */
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
            }
            .icon-back svg { width: 24px; height: 24px; fill: var(--Blanco); }

            /* CONTENIDO */
            .content {
                display: flex;
                flex-direction: column;
                padding: 0 24px;
                gap: 16px;
                flex: 1;
            }

            .input-box {
                display: flex;
                width: 100%;
                padding: 12px;
                justify-content: space-between;
                align-items: center;
                border: 1px solid var(--Blanco);
                background: transparent;
                color: var(--Blanco);
                font-family: 'JetBrains Mono', monospace;
                font-size: 16px;
                outline: none;
                cursor: pointer;
                transition: border-color 0.2s;
            }
            
            .input-box:focus, .input-box:active { border-color: var(--Verde-acido); }
            .input-placeholder { color: var(--Blanco); } /* Aquí ya tendrá valor, así que blanco */
            .unit-tag { color: var(--Verde-acido); font-weight: 700; margin-left: 8px; }

            input.input-box { border-radius: 0; appearance: none; }

            /* FOOTER */
            .action-section {
                padding: 0 24px 24px 24px;
                margin-top: auto;
            }
            
            app-btn { width: 100%; display: block; }
            .nav-container { position: fixed; bottom: 0; left: 0; width: 100%; z-index: 100; }
        </style>

        <div class="header" id="btn-back">
            <div class="icon-back">${ICONS.ARROW_LEFT}</div>
            <span class="title-text">${this.dict.t('macros_edit_header')}</span>
        </div>

        <main class="content">
            <app-input-card label="${this.dict.t('macros_edit_label_name')}">
                <input type="text" class="input-box" id="input-name" placeholder="${this.dict.t('macros_edit_placeholder_name')}" autocomplete="off">
            </app-input-card>

            <app-input-card label="${this.dict.t('macros_edit_label_kcal')}">
                <div class="input-box" id="btn-kcal">
                    <span id="val-kcal" class="input-placeholder">0</span>
                </div>
            </app-input-card>

            <app-input-card label="${this.dict.t('macros_edit_label_p')}">
                <div class="input-box" id="btn-p">
                    <span id="val-p" class="input-placeholder">0</span>
                    <span class="unit-tag">[ G ]</span>
                </div>
            </app-input-card>

            <app-input-card label="${this.dict.t('macros_edit_label_c')}">
                <div class="input-box" id="btn-c">
                    <span id="val-c" class="input-placeholder">0</span>
                    <span class="unit-tag">[ G ]</span>
                </div>
            </app-input-card>

            <app-input-card label="${this.dict.t('macros_edit_label_f')}">
                <div class="input-box" id="btn-f">
                    <span id="val-f" class="input-placeholder">0</span>
                    <span class="unit-tag">[ G ]</span>
                </div>
            </app-input-card>
        </main>

        <div class="action-section">
            <app-btn variant="primary" label="${this.dict.t('macros_edit_btn_save')}" id="btn-save"></app-btn>
        </div>
        
        <app-keypad-modal id="modal-keypad"></app-keypad-modal>
        `;}
updateUI(){this.shadowRoot.getElementById('input-name').value=this.state.name;this.shadowRoot.getElementById('val-kcal').innerText=this.state.k;this.shadowRoot.getElementById('val-p').innerText=this.state.p;this.shadowRoot.getElementById('val-c').innerText=this.state.c;this.shadowRoot.getElementById('val-f').innerText=this.state.f;}
setupListeners(){this.shadowRoot.getElementById('btn-back').addEventListener('click',()=>window.history.back());const nameInput=this.shadowRoot.getElementById('input-name');nameInput.addEventListener('input',(e)=>{this.state.name=e.target.value;});const modal=this.shadowRoot.getElementById('modal-keypad');const setupMacroInput=(btnId,valId,label,key)=>{this.shadowRoot.getElementById(btnId).addEventListener('click',async()=>{const res=await modal.open(label,this.state[key],'numeric');if(res!==null){const num=parseFloat(res.value)||0;this.state[key]=num;this.shadowRoot.getElementById(valId).innerText=num;}});};setupMacroInput('btn-kcal','val-kcal',this.dict.t('macros_edit_modal_kcal'),'k');setupMacroInput('btn-p','val-p',this.dict.t('macros_edit_modal_p'),'p');setupMacroInput('btn-c','val-c',this.dict.t('macros_edit_modal_c'),'c');setupMacroInput('btn-f','val-f',this.dict.t('macros_edit_modal_f'),'f');this.shadowRoot.getElementById('btn-save').addEventListener('click',()=>{this.handleSave();});}
async handleSave(){if(!this.state.name.trim())return alert(this.dict.t('macros_edit_alert_name_req'));const updatedFood={id:this.state.id,name:{es:this.state.name,en:this.state.name},category:"Created",type:"Aliment",k:this.state.k,p:this.state.p,c:this.state.c,f:this.state.f,};try{await pantryService.saveCustomFood(updatedFood);window.location.hash=`#/nutrition/add-food?meal=${this.targetMeal}`;}catch(error){console.error(error);alert(this.dict.t('macros_edit_alert_save_error'));}}}
customElements.define('nutrition-food-macros-edit',NutritionFoodMacrosEdit);