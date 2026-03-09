import'../../system/components/widget.js';import{router}from'../../../core/router/index.js';import{db}from'../../../core/db/index.js';import{i18nService}from'../../../core/i18n/i18n.service.js';export class WidgetSmartTraining extends HTMLElement{constructor(){super();this.dict=null;}
async connectedCallback(){this.dict=await i18nService.loadPage('user/smart_training');this.render();this.addListeners();this.loadData();}
render(){if(!this.dict)return;this.innerHTML=`
      <app-widget
        variant="highlight"
        title="${this.dict.t('st_title')}"
        text="${this.dict.t('st_loading')}"
      ></app-widget>
    `;}
addListeners(){const widgetBase=this.querySelector('app-widget');if(widgetBase){widgetBase.addEventListener('click',()=>{router.navigate('/training');});}}
async loadData(){if(!this.dict)return;try{const record=await db.get('training_vault','training_sessions');const sessions=record&&record.data?record.data:[];const now=new Date();const startOfDay=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();const hasTrainedToday=sessions.some(session=>session.timestamp>=startOfDay);const widgetBase=this.querySelector('app-widget');if(widgetBase){if(hasTrainedToday){widgetBase.setAttribute('text',this.dict.t('st_training_today'));}else{widgetBase.setAttribute('text',this.dict.t('st_not_trained'));}}}catch(error){console.error('[WIDGET SMART TRAINING] Error leyendo historial:',error);const widgetBase=this.querySelector('app-widget');if(widgetBase){widgetBase.setAttribute('text',this.dict.t('st_error'));}}}}
customElements.define('widget-smart-training',WidgetSmartTraining);