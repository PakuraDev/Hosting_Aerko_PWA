import'../../system/components/widget.js';import{router}from'../../../core/router/index.js';import{i18nService}from'../../../core/i18n/i18n.service.js';import{nutritionService}from'../../nutrition_core/services/nutrition.service.js';import{journalService}from'../../nutrition_core/services/journal.service.js';import{nutritionStore}from'../../nutrition_core/store/index.js';export class WidgetSmartChecks extends HTMLElement{constructor(){super();this.dict=null;}
async connectedCallback(){this.dict=await i18nService.loadPage('user/smart_checks');this.render();this.addListeners();this.loadData();}
render(){if(!this.dict)return;this.innerHTML=`
      <app-widget
        variant="highlight"
        title="${this.dict.t('sc_title')}"
        text="${this.dict.t('sc_loading')}"
      ></app-widget>
    `;}
addListeners(){const widgetBase=this.querySelector('app-widget');if(widgetBase){widgetBase.addEventListener('click',()=>{router.navigate('/nutrition');});}}
async loadData(){if(!this.dict)return;try{await nutritionService.init();const activePlanIds=nutritionStore.getMealPlanIds();let pendingCount=0;const today=new Date();for(const planId of activePlanIds){const log=await journalService.getMealLog(today,planId);if(!log.timestamp){pendingCount++;}}
const widgetBase=this.querySelector('app-widget');if(widgetBase){let text='';if(activePlanIds.length===0){text=this.dict.t('sc_no_meals');}else if(pendingCount===0){text=this.dict.t('sc_all_done');}else if(pendingCount===1){text=this.dict.t('sc_one_left');}else{text=this.dict.t('sc_many_left',{count:pendingCount});}
widgetBase.setAttribute('text',text);}}catch(error){console.error('[WIDGET SMART CHECKS] Error calculando comidas:',error);const widgetBase=this.querySelector('app-widget');if(widgetBase){widgetBase.setAttribute('text',this.dict.t('sc_error'));}}}}
customElements.define('widget-smart-checks',WidgetSmartChecks);