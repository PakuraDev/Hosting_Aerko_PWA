export class AppBox extends HTMLElement{static get observedAttributes(){return['active','clickable'];}
constructor(){super();this.attachShadow({mode:'open'});}
connectedCallback(){this.render();}
render(){this.shadowRoot.innerHTML=`
            <style>
                @import url('/src/core/theme/variables.css');
                @import url('/src/modules/system/components/box.css');
            </style>
            <div class="box">
                <slot></slot>
            </div>
        `;}}
customElements.define('app-box',AppBox);