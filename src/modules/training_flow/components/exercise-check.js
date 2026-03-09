import{ICONS}from'../../../core/theme/icons.js';import{i18nService}from'../../../core/i18n/i18n.service.js';export class AppExerciseCheck extends HTMLElement{static get observedAttributes(){return['name','status'];}
constructor(){super();this.attachShadow({mode:'open'});}
async connectedCallback(){const dict=await i18nService.loadPage('training_flow/exercise-check');this.t=dict.t;this.render();}
attributeChangedCallback(name,oldValue,newValue){if(oldValue!==newValue&&this.t){this.render();}}
render(){if(!this.t)return;const name=this.getAttribute('name')||this.t('check_fallback_name');const status=this.getAttribute('status')||'pending';const iconSVG=status==='completed'?ICONS.CHECK:ICONS.CIRCLE_EMPTY;this.shadowRoot.innerHTML=`
            <style>
                @import url('/src/core/theme/variables.css'); /* [cite: 96] */
                @import url('/src/modules/training_flow/components/exercise-check.css');
                
                /* Forzamos que el SVG herede el color del texto/contenedor */
                svg path { fill: currentColor !important; }
            </style>

            <div class="exercise-card ${status}">
                <span class="exercise-name">${name}</span>
                <div class="icon-wrapper">
                    ${iconSVG}
                </div>
            </div>
        `;}}
customElements.define('app-exercise-check',AppExerciseCheck);