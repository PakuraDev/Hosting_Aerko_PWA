import{router}from'../../../core/router/index.js';import{journalService}from'../../nutrition_core/services/journal.service.js';import{pantryService}from'../../nutrition_core/services/pantry.service.js';import{nutritionService}from'../../nutrition_core/services/nutrition.service.js';import{i18nService}from'../../../core/i18n/i18n.service.js';import{ICONS}from'../../../core/theme/icons.js';import'../../system/components/btn.js';import'../../system/components/navbar.js';import'../../nutrition_core/components/food-card.js';export class NutritionMealFoodsEdit extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'});this.mealId=null;this.mealPlan=null;this.dict=null;}
async connectedCallback(){this.dict=await i18nService.loadPage('nutrition_diet/nutrition-meal-foods-edit');await nutritionService.init();await Promise.all([journalService.init(),pantryService.init()]);const hashParts=window.location.hash.split('?');if(hashParts.length>1){const params=new URLSearchParams(hashParts[1]);this.mealId=params.get('id');}
if(!this.mealId){alert(this.dict.t('meal_foods_err_no_meal'));window.history.back();return;}
this.mealPlan=await journalService.getMealPlan(this.mealId);if(!this.mealPlan){alert(this.dict.t('meal_foods_err_not_found'));window.history.back();return;}
this.renderStructure();this.setupStructureListeners();this.updateList();}
_getHydratedFoods(){if(!this.mealPlan||!this.mealPlan.items)return[];return this.mealPlan.items.map(planItem=>{const foodData=pantryService.getFoodById(planItem.refId);if(!foodData)return null;const ratio=(planItem.mode==='fixed'&&planItem.grams)?planItem.grams/100:0;return{...foodData,...planItem,displayName:pantryService.getFoodName(foodData,i18nService.getPreferences().lang),calculated:{k:Math.round(foodData.k*ratio),p:parseFloat((foodData.p*ratio).toFixed(1)),c:parseFloat((foodData.c*ratio).toFixed(1)),f:parseFloat((foodData.f*ratio).toFixed(1))}};}).filter(Boolean);}
renderStructure(){const label=this.mealPlan.label||'Comida';this.shadowRoot.innerHTML=`
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
                line-height: 150%;
            }
            .icon-back svg { width: 24px; height: 24px; fill: var(--Blanco); }

            /* LISTA CONTENEDOR */
            .food-list {
                display: flex;
                flex-direction: column;
                padding: 0 24px;
                gap: 16px;
                flex: 1; 
                overflow-y: auto;
            }

            .empty-state {
                color: var(--gris-hover);
                font-family: "JetBrains Mono";
                font-size: 14px;
                text-align: center;
                opacity: 0.5;
                margin-top: 40px;
            }

            /* FOOTER */
            .action-section {
                padding: 0 24px 24px 24px; 
                display: flex;
                flex-direction: column;
                margin-top: auto;
            }
            app-btn { width: 100%; display: block; }
            app-btn .btn { width: 100% !important; justify-content: center; }

            .nav-container {
                position: fixed;
                bottom: 0; left: 0; width: 100%; z-index: 100;
            }
        </style>

        <div class="header" id="btn-back">
            <div class="icon-back">${ICONS.ARROW_LEFT}</div>
            <span class="title-text">${this.dict.t('meal_foods_header')} [${label}]</span>
        </div>

        <main class="food-list" id="list-container"></main>

        <div class="action-section">
            <app-btn variant="primary" label="${this.dict.t('meal_foods_btn_finish')}" id="btn-finish"></app-btn>
        </div>
        `;}
setupStructureListeners(){const goBack=()=>{router.navigate(`/nutrition/meal-config?id=${this.mealId}`);};this.shadowRoot.getElementById('btn-back').addEventListener('click',goBack);this.shadowRoot.getElementById('btn-finish').addEventListener('click',goBack);}
updateList(){const container=this.shadowRoot.getElementById('list-container');container.innerHTML='';const foods=this._getHydratedFoods();if(foods.length===0){container.innerHTML=`<div class="empty-state">${this.dict.t('meal_foods_empty_state')}</div>`;return;}
foods.forEach(food=>{const card=document.createElement('app-food-card');const isVariable=food.mode==='variable';card.setAttribute('label',`${food.displayName} ${isVariable ? `(${this.dict.t('meal_foods_var_badge')})` : ''}`);card.setAttribute('p',food.calculated.p);card.setAttribute('c',food.calculated.c);card.setAttribute('f',food.calculated.f);card.addEventListener('edit',()=>{if(food.type==='group'){router.navigate(`/nutrition/edit-group?id=${food.refId}&meal=${this.mealId}`);}else{router.navigate(`/nutrition/edit-food?id=${food.refId}&meal=${this.mealId}`);}});card.addEventListener('delete',async()=>{if(confirm(this.dict.t('meal_foods_confirm_del',{foodName:food.displayName}))){await this.handleDelete(food.refId);}});container.appendChild(card);});}
async handleDelete(refId){try{this.mealPlan.items=this.mealPlan.items.filter(i=>i.refId!==refId);await journalService.saveMealPlan(this.mealPlan.id,this.mealPlan.order,this.mealPlan.label,this.mealPlan.time,this.mealPlan.notification||false,this.mealPlan.items,this.mealPlan.isVisible);this.updateList();}catch(error){console.error("Error al borrar item:",error);alert(this.dict.t('meal_foods_err_del'));}}}
customElements.define('nutrition-meal-foods-edit',NutritionMealFoodsEdit);