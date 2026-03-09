export class AppBtn extends HTMLElement{static get observedAttributes(){return['variant','label'];}
constructor(){super();}
connectedCallback(){this.render();}
attributeChangedCallback(name,oldValue,newValue){if(oldValue!==newValue){if(name==='label'){const btn=this.querySelector('button.btn');if(btn){btn.innerText=newValue;return;}}
this.render();}}
render(){const variant=this.getAttribute('variant')||'primary';const type=this.getAttribute('type')||'button';const label=this.getAttribute('label');let btn=this.querySelector('button.btn');if(!btn){const content=label?label:this.innerHTML;this.innerHTML=`
                <button class="btn btn--${variant}" type="${type}">
                    ${content}
                </button>
            `;}else{btn.className=`btn btn--${variant}`;btn.setAttribute('type',type);if(label){btn.innerText=label;}}}}
customElements.define('app-btn',AppBtn);