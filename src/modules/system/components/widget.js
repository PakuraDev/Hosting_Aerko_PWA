import{ICONS}from'../../../core/theme/icons.js';export class AppWidget extends HTMLElement{static get observedAttributes(){return['title','text','variant'];}
constructor(){super();}
connectedCallback(){this.render();}
attributeChangedCallback(name,oldValue,newValue){if(oldValue!==newValue){if(this.isConnected){this.updateContent(name,newValue);}}}
updateContent(name,value){const titleEl=this.querySelector('.widget-title');const descEl=this.querySelector('.widget-desc');const simpleTextEl=this.querySelector('.widget-text');if(name==='title'&&titleEl)titleEl.innerText=value;if(name==='text'){if(descEl)descEl.innerText=value;if(simpleTextEl)simpleTextEl.innerText=value;}
if(name==='variant')this.render();}
render(){const variant=this.getAttribute('variant')||'simple';const title=this.getAttribute('title')||'';const text=this.getAttribute('text')||'';const hasArrow=this.hasAttribute('arrow');const isSmall=this.hasAttribute('small');let innerHTML='';if(variant==='highlight'){innerHTML=`
                <div class="widget-content">
                    <h3 class="widget-title">${title}</h3>
                    <p class="widget-desc">${text}</p>
                </div>
                <div class="widget-icon">${ICONS.ARROW_RIGHT_CIRCLE}</div>
            `;}else{innerHTML=`
                <span class="widget-text">${text}</span>
                ${hasArrow ? `<div class="widget-icon"style="margin-left:auto">${ICONS.ARROW_RIGHT_CIRCLE}</div>` : ''}
            `;}
const cssClass=`widget widget--${variant} ${isSmall ? 'small-text' : ''}`;this.innerHTML=`
            <div class="${cssClass}">
                ${innerHTML}
            </div>
        `;}}
if(!customElements.get('app-widget')){customElements.define('app-widget',AppWidget);}