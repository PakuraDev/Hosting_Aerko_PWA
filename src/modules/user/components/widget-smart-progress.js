import'../../system/components/widget.js';import{router}from'../../../core/router/index.js';import{progressService}from'../../progress_core/services/progress.service.js';import{i18nService}from'../../../core/i18n/i18n.service.js';export class WidgetSmartProgress extends HTMLElement{constructor(){super();this.dict=null;}
async connectedCallback(){this.dict=await i18nService.loadPage('user/smart_progress');this.render();this.addListeners();this.loadData();}
render(){if(!this.dict)return;this.innerHTML=`
      <app-widget
        variant="highlight"
        title="${this.dict.t('sp_title')}"
        text="${this.dict.t('sp_loading')}"
      ></app-widget>
    `;}
addListeners(){const widgetBase=this.querySelector('app-widget');if(widgetBase){widgetBase.addEventListener('click',()=>{router.navigate('/progress/add');});}}
async loadData(){if(!this.dict)return;try{await progressService.init();const canAdd=progressService.canAddRecord();const widgetBase=this.querySelector('app-widget');if(widgetBase){if(canAdd){widgetBase.setAttribute('text',this.dict.t('sp_can_add'));}else{widgetBase.setAttribute('text',this.dict.t('sp_cannot_add'));}}}catch(error){console.error('[WIDGET SMART PROGRESS] Error leyendo el candado:',error);const widgetBase=this.querySelector('app-widget');if(widgetBase){widgetBase.setAttribute('text',this.dict.t('sp_error'));}}}}
customElements.define('widget-smart-progress',WidgetSmartProgress);