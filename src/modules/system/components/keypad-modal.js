import'./keypad.js';import{unitService}from'../../../core/utils/unit.service.js';export class AppKeypadModal extends HTMLElement{constructor(){super();this._handlePopState=this._handlePopState.bind(this);this.resolvePromise=null;this.onUnitChangeCallback=null;this.currentString="";this.currentUnit="";this.unitOptions="";}
connectedCallback(){this.render();this.dialog=this.querySelector('.modal-backdrop');this.keypad=this.querySelector('app-keypad');this.preview=this.querySelector('#modal-preview');this.label=this.querySelector('#modal-label');}
render(){this.innerHTML=`
            <div class="modal-backdrop">
                <div class="modal-sheet">
                    <div class="modal-header">
                        <span class="modal-label" id="modal-label">EDITAR</span>
                        <div class="modal-value-preview" id="modal-preview"></div>
                    </div>
                    <app-keypad></app-keypad>
                </div>
            </div>
        `;}
open(label,currentValue,mode='numeric',currentUnit='',unitOptions='',onUnitChange=null){return new Promise((resolve)=>{this.resolvePromise=resolve;this.onUnitChangeCallback=onUnitChange;this.label.innerText=`// ${label}`;this.currentString=(currentValue||"").toString();this.currentUnit=currentUnit;this.unitOptions=unitOptions;this.updatePreview();this.keypad.setAttribute('mode',mode);if(mode==='dynamic'){this.keypad.setAttribute('unit-value',currentUnit);this.keypad.setAttribute('unit-options',unitOptions);}
this.dialog.classList.add('visible');history.pushState({modalOpen:true},'',window.location.hash);window.addEventListener('popstate',this._handlePopState);this.attachKeypadListeners();});}
updatePreview(){this.preview.innerText=this.currentString;}
close(returnValue=null){this.dialog.classList.remove('visible');window.removeEventListener('popstate',this._handlePopState);this.detachKeypadListeners();if(this.resolvePromise){this.resolvePromise(returnValue);this.resolvePromise=null;this.onUnitChangeCallback=null;}}
attachKeypadListeners(){this.onInput=(e)=>{const char=e.detail;if(char==='.'&&this.currentString.includes('.'))return;const isZero=['0','0.00','00.0','--'].includes(this.currentString);if(isZero&&char!=='.'){this.currentString=char;}
else{this.currentString+=char;}
this.updatePreview();};this.onDelete=()=>{this.currentString=this.currentString.slice(0,-1);if(this.currentString===''||this.currentString==='-'){this.currentString='0';}
this.updatePreview();};this.onOk=()=>{history.back();};this.onUnitCycle=()=>{const units=this.unitOptions.split(',').map(u=>u.trim());const nextIndex=(units.indexOf(this.currentUnit)+1)%units.length;const newUnit=units[nextIndex];if(this.currentString!==""&&this.currentString!=="0"){const baseValue=unitService.toBase(this.currentString,this.currentUnit);const displayValue=unitService.toDisplay(baseValue,newUnit);this.currentString=displayValue.toString();}
this.currentUnit=newUnit;this.keypad.setAttribute('unit-value',newUnit);this.updatePreview();if(this.onUnitChangeCallback){this.onUnitChangeCallback(newUnit);}};this.keypad.addEventListener('input',this.onInput);this.keypad.addEventListener('delete',this.onDelete);this.keypad.addEventListener('ok',this.onOk);this.keypad.addEventListener('unit-cycle',this.onUnitCycle);}
detachKeypadListeners(){if(this.onInput){this.keypad.removeEventListener('input',this.onInput);this.keypad.removeEventListener('delete',this.onDelete);this.keypad.removeEventListener('ok',this.onOk);this.keypad.removeEventListener('unit-cycle',this.onUnitCycle);}}
_handlePopState(e){this.close({value:this.currentString,unit:this.currentUnit});}}
customElements.define('app-keypad-modal',AppKeypadModal);