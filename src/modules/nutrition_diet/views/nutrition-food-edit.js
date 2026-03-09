import{router}from'../../../core/router/index.js';import{nutritionService}from'../../nutrition_core/services/nutrition.service.js';import{journalService}from'../../nutrition_core/services/journal.service.js';import{pantryService}from'../../nutrition_core/services/pantry.service.js';import{i18nService}from'../../../core/i18n/i18n.service.js';import{ICONS}from'../../../core/theme/icons.js';import'../../system/components/btn.js';import'../../system/components/navbar.js';import'../components/adjuster-card.js';export class NutritionFoodEdit extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'});this.mealId=null;this.foodId=null;this.food=null;this.tempState={grams:0,mode:'fixed',calculated:{}};this.dict=null;}
async connectedCallback(){this.dict=await i18nService.loadPage('nutrition_diet/nutrition-food-edit');await nutritionService.init();await Promise.all([journalService.init(),pantryService.init()]);const params=new URLSearchParams(window.location.hash.split('?')[1]);this.mealId=params.get('meal');this.foodId=params.get('id');const plan=await journalService.getMealPlan(this.mealId);if(!plan||!plan.items){alert(this.dict.t('edit_food_err_plan_not_found'));window.history.back();return;}
const planItem=plan.items.find(i=>i.refId===this.foodId);if(!planItem){alert(this.dict.t('edit_food_err_item_not_found'));window.history.back();return;}
const pantryData=pantryService.getFoodById(this.foodId);if(!pantryData){alert(this.dict.t('edit_food_err_pantry_missing'));window.history.back();return;}
this.food={...pantryData,grams:planItem.grams,mode:planItem.mode||'fixed'};this.tempState.grams=this.food.grams;this.tempState.mode=this.food.mode;this._recalculateTemp(this.food.grams,this.food.mode);this.render();this.setupListeners();}
_recalculateTemp(grams,mode){if(mode==='variable'){this.tempState.calculated={k:0,p:0,c:0,f:0};return;}
const ratio=grams/100;this.tempState.calculated={k:Math.round(this.food.k*ratio),p:Math.round(this.food.p*ratio),c:Math.round(this.food.c*ratio),f:Math.round(this.food.f*ratio)};}
render(){const baseK=this.food.k;const baseP=this.food.p;const baseC=this.food.c;const baseF=this.food.f;const prefs=i18nService.getPreferences();const foodName=pantryService.getFoodName(this.food,prefs.lang);this.shadowRoot.innerHTML=`
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
                flex: 1;
                justify-content: center;
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

            .nav-container { position: fixed; bottom: 0; left: 0; width: 100%; z-index: 100; }
        </style>

        <div class="header" id="btn-back">
            <div class="icon-back">${ICONS.ARROW_LEFT}</div>
            <span class="title-text">${this.dict.t('edit_food_header')}</span>
        </div>

        <main class="content">
            <nutrition-adjuster-card
                id="adjuster"
                label="${foodName}"
                grams="${this.tempState.grams}"
                k="${baseK}"
                p="${baseP}"
                c="${baseC}"
                f="${baseF}"
                mode="${this.tempState.mode}" 
                step="5"
            ></nutrition-adjuster-card>
        </main>

        <div class="action-section">
            <app-btn variant="primary" label="${this.dict.t('edit_food_btn_save')}" id="btn-save"></app-btn>
        </div>
        `;}
setupListeners(){this.shadowRoot.getElementById('btn-back').addEventListener('click',()=>window.history.back());const adjuster=this.shadowRoot.getElementById('adjuster');adjuster.addEventListener('change',(e)=>{this.tempState.grams=e.detail.grams;this.tempState.mode=e.detail.mode;this.tempState.calculated=e.detail.calculated;});this.shadowRoot.getElementById('btn-save').addEventListener('click',async()=>{if(this.tempState.mode==='fixed'&&(this.tempState.grams<=0||!this.tempState.grams)){return alert(this.dict.t('edit_food_alert_grams_req'));}
try{const plan=await journalService.getMealPlan(this.mealId);const itemIndex=plan.items.findIndex(i=>i.refId===this.foodId);if(itemIndex!==-1){plan.items[itemIndex].grams=this.tempState.mode==='variable'?0:this.tempState.grams;plan.items[itemIndex].mode=this.tempState.mode;await journalService.saveMealPlan(plan.id,plan.order,plan.label,plan.time,plan.notification||false,plan.items,plan.isVisible);window.history.back();}else{alert(this.dict.t('edit_food_err_sync'));}}catch(error){console.error(error);alert(this.dict.t('edit_food_err_save'));}});}}
customElements.define('nutrition-food-edit',NutritionFoodEdit);