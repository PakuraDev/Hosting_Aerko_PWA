import{router}from'../../../core/router/index.js';import{trainingStore}from'../../training_core/store/index.js';import{trainingService}from'../../training_core/services/training.service.js';import{ICONS}from'../../../core/theme/icons.js';import{i18nService}from'../../../core/i18n/i18n.service.js';import'../../system/components/input-card.js';import'../../system/components/btn.js';import'../../system/components/keypad-modal.js';export class TrainingExerciseCreate extends HTMLElement{constructor(){super();this.formData={id:null,name:'',category:'weights',muscles:[{id:null,heads:{}},{id:null,heads:{}},{id:null,heads:{}}]};this.availableMuscles=[];}
async connectedCallback(){await trainingService.init();this.availableMuscles=trainingStore.getMuscles();this.i18n=await i18nService.loadPage('training_planner/exercise-create');this.render();this._attachListeners();}
render(){this.innerHTML=`
        <style>
            @import url('/src/core/theme/variables.css');
            @import url('/src/modules/system/components/keypad-modal.css');

            training-exercise-create {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100dvh;
                background-color: var(--Negro-suave);
                color: var(--Blanco);
                font-family: 'JetBrains Mono', monospace;
            }

            .header {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px 24px;
                border-bottom: 1px solid var(--Blanco);
                flex-shrink: 0;
            }
            .btn-back { width: 24px; height: 24px; cursor: pointer; }
            .btn-back svg { fill: var(--Blanco); width: 100%; height: 100%; }
            .title { font-size: 16px; font-weight: 400; }

            .content {
                flex: 1;
                overflow-y: auto;
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 24px;
                padding-bottom: 40px;
            }

            /* Inputs Base */
            .input-box {
                background: transparent;
                border: 1px solid var(--Blanco);
                color: var(--Blanco);
                font-family: 'JetBrains Mono', monospace;
                font-size: 16px;
                padding: 12px;
                width: 100%;
                box-sizing: border-box;
                outline: none;
            }
            
            /* Select Custom */
            select.input-box {
                appearance: none;
                background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
                background-repeat: no-repeat;
                background-position: right 8px center;
                border-radius: 0;
                background-color: var(--Negro-suave);
            }

            /* Caja de Cabeza Muscular (Trigger del Keypad) */
            .head-box-trigger {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border: 1px solid rgba(255,255,255,0.5);
                padding: 12px;
                margin-top: 8px;
                cursor: pointer;
                transition: border-color 0.2s;
            }
            .head-box-trigger:active { background: rgba(255,255,255,0.05); }
            
            .head-label { font-size: 14px; opacity: 0.7; }
            .head-value { color: var(--Verde-acido); font-weight: bold; }

            .footer {
                padding: 24px;
                border-top: 1px solid rgba(255,255,255,0.1);
                background: var(--Negro-suave);
            }
        </style>

        <div class="header">
            <div class="btn-back" id="btn-back">${ICONS.ARROW_LEFT}</div>
            <span class="title">${this.i18n.t('header_title')}</span>
        </div>

        <div class="content">
            
            <div style="display:flex; flex-direction:column; gap:8px;">
                <span style="opacity:0.7">${this.i18n.t('lbl_name')}</span>
                <input type="text" class="input-box" id="input-name" 
                       value="${this.formData.name}" placeholder="${this.i18n.t('placeholder_name')}">
            </div>

            <div style="display:flex; flex-direction:column; gap:8px;">
                <span style="opacity:0.7">${this.i18n.t('lbl_category')}</span>
                <select class="input-box" id="input-category">
                    <option value="weights" ${this.formData.category === 'weights' ? 'selected' : ''}>${this.i18n.t('opt_cat_weights')}</option>
                    <option value="machine" ${this.formData.category === 'machine' ? 'selected' : ''}>${this.i18n.t('opt_cat_machine')}</option>
                    <option value="bodyweight" ${this.formData.category === 'bodyweight' ? 'selected' : ''}>${this.i18n.t('opt_cat_bodyweight')}</option>
                    <option value="cardio" ${this.formData.category === 'cardio' ? 'selected' : ''}>${this.i18n.t('opt_cat_cardio')}</option>
                </select>
            </div>

            <hr style="border:0; border-bottom:1px solid #333; width:100%;">

            ${this._renderMuscleBlock(0, this.i18n.t('lbl_muscle_main'))}
            ${this._renderMuscleBlock(1, this.i18n.t('lbl_muscle_sec'))}
            ${this._renderMuscleBlock(2, this.i18n.t('lbl_muscle_ter'))}

        </div>

        <div class="footer">
            <app-btn id="btn-save" label="${this.i18n.t('btn_save')}" variant="primary" style="width:100%"></app-btn>
        </div>

        <app-keypad-modal id="modal-keypad"></app-keypad-modal>
        `;this._restoreDOMValues();}
_renderMuscleBlock(index,label){const muscleData=this.formData.muscles[index];const selectedId=muscleData.id||'';const options=[`<option value="">${this.i18n.t('opt_select_default')}</option>`,...this.availableMuscles.map(m=>{const name=i18nService.tData(m.name);const isSelected=m.id===selectedId?'selected':'';return`<option value="${m.id}" ${isSelected}>${name}</option>`;})].join('');let headsHtml='';if(selectedId){const muscleObj=this.availableMuscles.find(m=>m.id===selectedId);const heads=(muscleObj&&muscleObj.heads&&muscleObj.heads.length>0)?muscleObj.heads:[{id:'general',name:{es:this.i18n.t('lbl_general_head')}}];headsHtml=heads.map(head=>{const headId=head.id;const headName=i18nService.tData(head.name)||this.i18n.t('lbl_general_head');const val=muscleData.heads[headId]||'0.00';return`
                    <div class="head-box-trigger" 
                         data-muscle-index="${index}" 
                         data-head-id="${headId}"
                         data-head-name="${headName}">
                        
                        <span class="head-label">// ${headName}</span>
                        <span class="head-value">${val}</span>
                    </div>
                `;}).join('');}
return`
            <div style="display:flex; flex-direction:column; gap:8px;">
                <span style="opacity:0.7">${label}</span>
                <select class="input-box muscle-select" data-index="${index}">
                    ${options}
                </select>
                
                ${headsHtml ? `<div style="padding-left:12px;">${headsHtml}</div>` : ''}
            </div>
        `;}
_restoreDOMValues(){}
_attachListeners(){const modal=this.querySelector('#modal-keypad');this.querySelector('#btn-back').addEventListener('click',()=>{if(this.formData.name||this.formData.muscles[0].id){if(confirm(this.i18n.t('alert_exit_unsaved')))window.history.back();}else{window.history.back();}});this.querySelector('#input-name').addEventListener('input',(e)=>{this.formData.name=e.target.value;});this.querySelector('#input-category').addEventListener('change',(e)=>{this.formData.category=e.target.value;});this.querySelectorAll('.muscle-select').forEach(select=>{select.addEventListener('change',(e)=>{const index=e.target.dataset.index;const newId=e.target.value;this.formData.muscles[index]={id:newId,heads:{}};this.render();this._attachListeners();});});this.querySelectorAll('.head-box-trigger').forEach(box=>{box.addEventListener('click',async()=>{const index=box.dataset.muscleIndex;const headId=box.dataset.headId;const headName=box.dataset.headName;const currentVal=this.formData.muscles[index].heads[headId]||'';box.style.borderColor='var(--Verde-acido)';try{const result=await modal.open(headName,currentVal,'numeric');if(result){this.formData.muscles[index].heads[headId]=result.value;const displaySpan=box.querySelector('.head-value');if(displaySpan)displaySpan.innerText=result.value;}}catch(err){console.log('Modal cerrado sin valor');}finally{box.style.borderColor='rgba(255,255,255,0.5)';}});});this.querySelector('#btn-save').addEventListener('click',async()=>{if(!this.formData.name.trim()){alert(this.i18n.t('alert_name_required'));return;}
const finalObj={id:`custom_${Date.now()}`,name:{es:this.formData.name,en:this.formData.name},category:this.formData.category,type:'strength',impact:{targets:[],activation:{}}};this.formData.muscles.forEach(m=>{if(!m.id)return;if(!finalObj.impact.targets.includes(m.id)){finalObj.impact.targets.push(m.id);}
Object.entries(m.heads).forEach(([headId,val])=>{const numVal=parseFloat(val);if(!isNaN(numVal)&&numVal>0){finalObj.impact.activation[headId]=numVal;}});});await trainingService.saveExercise(finalObj);window.history.back();});}}
customElements.define('training-exercise-create',TrainingExerciseCreate);