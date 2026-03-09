import{router}from'../../../core/router/index.js';import{pantryService}from'../../nutrition_core/services/pantry.service.js';import{journalService}from'../../nutrition_core/services/journal.service.js';import{ICONS}from'../../../core/theme/icons.js';import{i18nService}from'../../../core/i18n/i18n.service.js';import'../../system/components/btn.js';import'../../system/components/navbar.js';import'../components/adjuster-card.js';import'../../nutrition_core/components/food-card.js';export class NutritionFoodConfig extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'});this.mealId='default';this.currentFoodId=null;this.currentFood=null;this.activeState={grams:100,mode:'fixed',calculated:{}};this.groupBuffer=[];}
async connectedCallback(){await pantryService.init();await journalService.init();this.dict=await i18nService.loadPage('nutrition_diet/food-config');const hash=window.location.hash;const[path,query]=hash.split('?');const params=new URLSearchParams(query);this.mealId=params.get('meal')||'default';this.isAuto=params.get('autoComplete')==='true';const parts=path.split('/');this.currentFoodId=parts[parts.length-1];this.currentFood=pantryService.getFoodById(this.currentFoodId);if(!this.currentFood){console.error('Alimento no encontrado:',this.currentFoodId);window.history.back();return;}
this._loadBuffer();this.activeState.grams=100;this.activeState.calculated={k:this.currentFood.k,p:this.currentFood.p,c:this.currentFood.c,f:this.currentFood.f};this.render();this.setupListeners();}
_loadBuffer(){try{const stored=sessionStorage.getItem('aerko_group_buffer');if(stored){this.groupBuffer=JSON.parse(stored);}}catch(e){console.error('Error loading buffer',e);}}
_getCurrentItemFormatted(){if(this.activeState.mode==='fixed'&&this.activeState.grams<=0){alert(this.dict.t('config_alert_grams_req'));return null;}
const isFixed=this.activeState.mode==='fixed';const currentK=this.currentFood.k;const ratio=isFixed?(this.activeState.grams/100):0;return{id:this.currentFood.id,name:pantryService.getFoodName(this.currentFood,'es'),mode:this.activeState.mode,grams:isFixed?this.activeState.grams:null,base:{k:this.currentFood.k,p:this.currentFood.p,c:this.currentFood.c,f:this.currentFood.f},calculated:{k:isFixed?Math.round(currentK*ratio):0,p:isFixed?parseFloat((this.currentFood.p*ratio).toFixed(1)):0,c:isFixed?parseFloat((this.currentFood.c*ratio).toFixed(1)):0,f:isFixed?parseFloat((this.currentFood.f*ratio).toFixed(1)):0}};}
_pushCurrentToBuffer(){const item=this._getCurrentItemFormatted();if(!item)return false;this.groupBuffer.push(item);sessionStorage.setItem('aerko_group_buffer',JSON.stringify(this.groupBuffer));return true;}
render(){const baseK=this.currentFood.k;const baseP=this.currentFood.p;const baseC=this.currentFood.c;const baseF=this.currentFood.f;const hasGroup=this.groupBuffer.length>0;const foodName=pantryService.getFoodName(this.currentFood,'es');const btnLabel=hasGroup?this.dict.t('config_btn_create_group'):this.dict.t('config_btn_add_single',{foodName:foodName.split(' ')[0]});this.shadowRoot.innerHTML=`
        <style>
            @import url('/src/core/theme/variables.css');
            @import url('/src/modules/system/components/btn.css');
            
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

            .group-list {
                display: flex;
                flex-direction: column;
                padding: 0 24px;
                gap: 8px;
            }
            .group-label {
                color: var(--gris-hover);
                font-family: "JetBrains Mono";
                font-size: 12px;
                opacity: 0.7;
                margin-bottom: 4px;
            }

            .content {
                display: flex;
                flex-direction: column;
                padding: 0 24px;
                gap: 32px; 
            }

            .add-more-box {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 24px;
                gap: 12px;
                border: 1px solid var(--Blanco);
                background: transparent;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .add-more-box:active {
                background: rgba(255, 255, 255, 0.05);
                border-color: var(--Verde-acido);
            }

            .upload-icon svg { width: 32px; height: 32px; fill: var(--Blanco); }
            
            .add-more-text {
                color: var(--Blanco);
                font-family: 'Clash Display', sans-serif;
                font-size: 18px;
                font-weight: 600;
            }

            .info-text {
                color: var(--Blanco);
                font-family: "JetBrains Mono";
                font-size: 14px;
                opacity: 0.8;
                line-height: 140%;
            }

            .action-section {
                padding: 0 24px 24px 24px; 
                display: flex;
                flex-direction: column;
                margin-top: auto;
            }
            app-btn { width: 100%; display: block; }
            app-btn .btn { width: 100% !important; justify-content: center; }
        </style>

        <div class="header" id="btn-back">
            <div class="icon-back">${ICONS.ARROW_LEFT}</div>
            <span class="title-text">${this.dict.t('config_header_title')}</span>
        </div>

        ${hasGroup ? `<div class="group-list"><span class="group-label">{this.dict.t('config_group_label')}(${this.groupBuffer.length})</span>${this.groupBuffer.map(item=>`
                    <app-food-card 
                        label="${item.name}" 
                        p="-" c="-" f="-" 
                        style="opacity: 0.6; pointer-events: none;">
                    </app-food-card>
                `).join('')}</div>` : ''}

        <main class="content">
            <nutrition-adjuster-card
                id="adjuster"
                label="${foodName}"
                grams="100"
                k="${baseK}"
                p="${baseP}"
                c="${baseC}"
                f="${baseF}"
                mode="fixed" 
                step="1"
            ></nutrition-adjuster-card>

            <div style="display: flex; flex-direction: column; gap: 8px;">
                <p class="info-text">${this.dict.t('config_info_text')}</p>
                
                <div class="add-more-box" id="btn-add-more">
                    <div class="upload-icon">
                        <svg viewBox="0 0 24 24" fill="none"><path d="M11 16V7.85l-2.6 2.6L7 9l5-5 5 5-1.4 1.45-2.6-2.6V16h-2Zm-7 4v-5h2v3h12v-3h2v5H4Z" fill="white"/></svg>
                    </div>
                    <span class="add-more-text">${this.dict.t('config_btn_add_more')}</span>
                </div>
            </div>
        </main>

        <div class="action-section">
            <app-btn variant="primary" label="${btnLabel}" id="btn-finish"></app-btn>
        </div>
        `;}
setupListeners(){this.shadowRoot.getElementById('btn-back').addEventListener('click',()=>{if(this.groupBuffer.length>0){if(confirm(this.dict.t('config_alert_cancel_group'))){sessionStorage.removeItem('aerko_group_buffer');window.history.back();}}else{window.history.back();}});const adjuster=this.shadowRoot.getElementById('adjuster');adjuster.addEventListener('change',(e)=>{this.activeState.grams=e.detail.grams;this.activeState.mode=e.detail.mode;this.activeState.calculated=e.detail.calculated;});this.shadowRoot.getElementById('btn-add-more').addEventListener('click',()=>{if(this._pushCurrentToBuffer()){router.navigate(`/nutrition/add-food?meal=${this.mealId}`);}});this.shadowRoot.getElementById('btn-finish').addEventListener('click',async()=>{const currentItem=this._getCurrentItemFormatted();if(!currentItem)return;if(this.groupBuffer.length===0){await this._saveSingleItem(currentItem);}
else{await this._saveGroupItem(currentItem);}});}
async _saveSingleItem(item){try{let mealPlan=await journalService.getMealPlan(this.mealId);if(!mealPlan){mealPlan=await journalService.saveMealPlan(this.mealId,0,'Comida','12:00',false,[],true);}
const newItem={refId:item.id,mode:item.mode,grams:item.grams};if(!mealPlan.items)mealPlan.items=[];mealPlan.items.push(newItem);await journalService.saveMealPlan(mealPlan.id,mealPlan.order,mealPlan.label,mealPlan.time,mealPlan.notification||false,mealPlan.items,mealPlan.isVisible);router.navigate('/nutrition');}catch(e){console.error('Error al guardar en el Meal Plan:',e);}}
async _saveGroupItem(currentItem){const allIngredients=[...this.groupBuffer,currentItem];let groupName=prompt(this.dict.t('config_prompt_group_name'));if(!groupName)groupName=this.dict.t('config_default_group_name');try{const groupToSave={type:'group',name:{es:groupName},category:"Created",items:allIngredients.map(ing=>({refId:ing.id,mode:ing.mode,grams:ing.grams}))};const savedGroup=await pantryService.saveCustomFood(groupToSave);await this._saveSingleItem({id:savedGroup.id,mode:'fixed',grams:100});sessionStorage.removeItem('aerko_group_buffer');}catch(e){console.error(e);alert(this.dict.t('config_alert_group_error'));}}}
customElements.define('nutrition-food-config',NutritionFoodConfig);