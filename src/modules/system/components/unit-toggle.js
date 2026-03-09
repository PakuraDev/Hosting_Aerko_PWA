export class AppUnitToggle extends HTMLElement{static get observedAttributes(){return['options','value'];}
constructor(){super();this.attachShadow({mode:'open'});}
connectedCallback(){this.render();}
attributeChangedCallback(name,oldValue,newValue){if(oldValue!==newValue){this.render();}}
render(){const optionsRaw=this.getAttribute('options')||'';const activeValue=this.getAttribute('value')||'';const units=optionsRaw.split(',').map(u=>u.trim()).filter(u=>u);const unitsHtml=units.map((unit,index)=>{const isActive=(unit===activeValue);const color=isActive?'var(--Verde-acido)':'inherit';let html=`<span style="color: ${color}">${unit}</span>`;if(index<units.length-1){html+=` <span class="separator">/</span> `;}
return html;}).join('');this.shadowRoot.innerHTML=`
            <style>
                @import url('/src/core/theme/variables.css');
                
                :host {
                    display: inline-flex;
                    align-items: center;
                    font-family: "JetBrains Mono", monospace;
                    font-size: 16px; /* Ajustable si hereda */
                    font-weight: 500;
                    color: var(--Blanco);
                    user-select: none; /* Para que no se seleccione el texto al hacer click */
                }

                .bracket {
                    margin: 0 4px; /* Aire para los corchetes */
                }

                .separator {
                    color: var(--Blanco);
                    opacity: 0.6; /* Un poco más sutil */
                    margin: 0 4px;
                }
            </style>
            
            <span class="bracket">[</span>
            ${unitsHtml}
            <span class="bracket">]</span>
        `;}}
customElements.define('app-unit-toggle',AppUnitToggle);