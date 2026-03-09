import{router}from'../../../core/router/index.js';import{nutritionService}from'../../nutrition_core/services/nutrition.service.js';import{pantryService}from'../../nutrition_core/services/pantry.service.js';import{journalService}from'../../nutrition_core/services/journal.service.js';import{ICONS}from'../../../core/theme/icons.js';import{i18nService}from'../../../core/i18n/i18n.service.js';import'../../system/components/btn.js';import'../../system/components/navbar.js';import'../components/adjuster-card.js';import'../../nutrition_core/components/food-card.js';export class NutritionGroupEdit extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'});this.mealId=null;this.groupId=null;this.groupDef=null;this.hydratedItems=[];this.editingIndex=-1;this.dict=null;}
async connectedCallback(){await nutritionService.init();await Promise.all([pantryService.init(),journalService.init()]);this.dict=await i18nService.loadPage('nutrition_diet/nutrition-group-edit');const params=new URLSearchParams(window.location.hash.split('?')[1]);this.mealId=params.get('meal');this.groupId=params.get('id');const groupData=pantryService.getFoodById(this.groupId);if(!groupData||groupData.type!=='group'){alert(this.dict.t('group_edit_err_not_found'));window.history.back();return;}
this.groupDef=JSON.parse(JSON.stringify(groupData));this._hydrateIngredients();this.render();this.setupListeners();}
_hydrateIngredients(){this.hydratedItems=this.groupDef.items.map(item=>{const baseFood=pantryService.getFoodById(item.refId);if(!baseFood)return null;const ratio=(item.grams||0)/100;return{...item,name:pantryService.getFoodName(baseFood,i18nService.getPreferences().lang),base:{k:baseFood.k,p:baseFood.p,c:baseFood.c,f:baseFood.f},calculated:{k:Math.round(baseFood.k*ratio),p:parseFloat((baseFood.p*ratio).toFixed(1)),c:parseFloat((baseFood.c*ratio).toFixed(1)),f:parseFloat((baseFood.f*ratio).toFixed(1))}};}).filter(Boolean);}
render(){let activeItem=null;let baseK=0,baseP=0,baseC=0,baseF=0;if(this.editingIndex!==-1&&this.hydratedItems[this.editingIndex]){activeItem=this.hydratedItems[this.editingIndex];baseK=activeItem.base.k;baseP=activeItem.base.p;baseC=activeItem.base.c;baseF=activeItem.base.f;}
const groupName=pantryService.getFoodName(this.groupDef,'es');this.shadowRoot.innerHTML=`
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

            .content {
                display: flex;
                flex-direction: column;
                padding: 0 24px;
                gap: 24px;
                flex: 1;
            }

            /* SECCIÓN LISTA DE INGREDIENTES */
            .ingredients-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .section-label {
                color: var(--gris-hover);
                font-family: "JetBrains Mono";
                font-size: 12px;
                opacity: 0.7;
            }

            /* Tarjeta de ingrediente seleccionable */
            .ingredient-row {
                opacity: 0.8;
                transition: all 0.2s;
                cursor: pointer;
                border: 1px solid transparent;
            }
            .ingredient-row.active {
                opacity: 1;
                border-color: var(--Verde-acido);
            }

            /* SECCIÓN EDITOR (Aparece al clicar un ingrediente) */
            .editor-area {
                display: flex;
                flex-direction: column;
                gap: 16px;
                padding-top: 16px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .action-section {
                padding: 0 24px 24px 24px; 
                display: flex;
                flex-direction: column;
                margin-top: auto;
                gap: 16px;
            }
            app-btn { width: 100%; display: block; }
            app-btn .btn { width: 100% !important; justify-content: center; }
        </style>

        <div class="header" id="btn-back">
            <div class="icon-back">${ICONS.ARROW_LEFT}</div>
            <span class="title-text">${this.dict.t('group_edit_header')} / ${groupName}</span>
        </div>

        <main class="content">
            <div class="ingredients-list">
                <span class="section-label">${this.dict.t('group_edit_label_ingredients')} (${this.hydratedItems.length})</span>
                
                ${this.hydratedItems.map((item, index) => {
                    const p = item.calculated ? item.calculated.p : '-';
                    const c = item.calculated ? item.calculated.c : '-';
                    const f = item.calculated ? item.calculated.f : '-';
                    const isActive = index === this.editingIndex;
                    
                    return `<div class="ingredient-row ${isActive ? 'active' : ''}"data-index="${index}"><app-food-card
label="${item.name} (${item.grams || 0}g)"
p="${p}"c="${c}"f="${f}"
style="pointer-events: none;"></app-food-card></div>`;
                }).join('')}
            </div>

            ${this.editingIndex !== -1 && activeItem ? `<div class="editor-area"><span class="section-label">${this.dict.t('group_edit_label_editing',{foodName:activeItem.name})}</span><nutrition-adjuster-card
id="adjuster"
label="${activeItem.name}"
grams="${activeItem.grams || 100}"
k="${baseK}"p="${baseP}"c="${baseC}"f="${baseF}"
mode="${activeItem.mode || 'fixed'}"
step="1"></nutrition-adjuster-card><app-btn variant="secondary"label="${this.dict.t('group_edit_btn_del_item')}"id="btn-delete-item"style="opacity:0.7; transform:scale(0.9)"></app-btn></div>` : `<div style="text-align:center; padding: 20px; opacity: 0.5; font-family:'JetBrains Mono'; color:white; font-size:14px;">${this.dict.t('group_edit_hint_empty')}</div>`}
        </main>

        <div class="action-section">
            <app-btn variant="primary" label="${this.dict.t('group_edit_btn_save')}" id="btn-save-group"></app-btn>
            <app-btn variant="secondary" label="${this.dict.t('group_edit_btn_del_group')}" id="btn-delete-group" style="color: #FF4444; border-color: #FF4444;"></app-btn>
        </div>
        `;}
setupListeners(){this.shadowRoot.getElementById('btn-back').addEventListener('click',()=>window.history.back());const rows=this.shadowRoot.querySelectorAll('.ingredient-row');rows.forEach(row=>{row.addEventListener('click',()=>{const newIndex=parseInt(row.dataset.index);this.editingIndex=(this.editingIndex===newIndex)?-1:newIndex;this.render();this.setupListeners();});});const adjuster=this.shadowRoot.getElementById('adjuster');if(adjuster){adjuster.addEventListener('change',(e)=>{const item=this.hydratedItems[this.editingIndex];item.mode=e.detail.mode;item.grams=e.detail.grams;item.calculated=e.detail.calculated;this.groupDef.items[this.editingIndex].grams=item.grams;this.groupDef.items[this.editingIndex].mode=item.mode;});const btnDelItem=this.shadowRoot.getElementById('btn-delete-item');if(btnDelItem){btnDelItem.addEventListener('click',()=>{if(confirm(this.dict.t('group_edit_confirm_del_item'))){this.hydratedItems.splice(this.editingIndex,1);this.groupDef.items.splice(this.editingIndex,1);this.editingIndex=-1;this.render();this.setupListeners();}});}}
this.shadowRoot.getElementById('btn-save-group').addEventListener('click',async()=>{if(this.hydratedItems.length===0){return alert(this.dict.t('group_edit_alert_empty_group'));}
try{const newTotals=this.hydratedItems.reduce((acc,item)=>({k:acc.k+(item.calculated.k||0),p:acc.p+(item.calculated.p||0),c:acc.c+(item.calculated.c||0),f:acc.f+(item.calculated.f||0)}),{k:0,p:0,c:0,f:0});this.groupDef.k=Math.round(newTotals.k);this.groupDef.p=parseFloat(newTotals.p.toFixed(1));this.groupDef.c=parseFloat(newTotals.c.toFixed(1));this.groupDef.f=parseFloat(newTotals.f.toFixed(1));await pantryService.saveCustomFood(this.groupDef);window.history.back();}catch(e){console.error(e);alert(this.dict.t('group_edit_err_save'));}});this.shadowRoot.getElementById('btn-delete-group').addEventListener('click',async()=>{if(confirm(this.dict.t('group_edit_confirm_del_group'))){try{const plan=await journalService.getMealPlan(this.mealId);const originalLength=plan.items.length;plan.items=plan.items.filter(i=>i.refId!==this.groupId);if(plan.items.length===originalLength){console.warn("El grupo no estaba en el plan (¿Ya borrado?)");}
await journalService.saveMealPlan(plan.id,plan.order,plan.label,plan.time,plan.notification||false,plan.items,plan.isVisible);window.history.back();}catch(e){console.error(e);alert(this.dict.t('group_edit_err_del_group'));}}});}}
customElements.define('nutrition-group-edit',NutritionGroupEdit);