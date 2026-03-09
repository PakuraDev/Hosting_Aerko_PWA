import{ICONS}from'../../../../core/theme/icons.js';import{ITEM_TYPES}from'./constants.js';import{i18nService}from'../../../../core/i18n/i18n.service.js';export class MealView{static getTemplate(title='Comida'){return`
            <div class="smart-container">

                <div class="drawer-header" id="mainHeader">
                    <span id="headerTitle">${title}</span>
                    <div class="icon-container" id="headerIcon">
                    </div>
                </div>

                <div class="drawer-content" id="mainContent">
                </div>

            </div>
        `;}
static renderActive(container,viewData,state,handlers){container.innerHTML='';const dict=i18nService.dictionaries['nutrition_smart/smart-meal-check-wit'];const t=(key)=>dict?dict.t(key):key;if(!viewData.isRoot){const prevName=viewData.breadcrumbs[viewData.breadcrumbs.length-1].name||t('btn_back');container.appendChild(this._createItem(`< ${prevName}`,handlers.onBack,''));}
viewData.items.forEach(item=>{const isGroup=item.type===ITEM_TYPES.GROUP;const isDone=!isGroup&&state.isItemDone(item.id);let meta='';let isAccent=false;if(isGroup){if(state.isGroupFinished(item)){meta=ICONS.CHECK||'OK';isAccent=true;}else{meta='>';}}else if(isDone){const logEntry=state.getLog()[item.id];const realQuantity=logEntry?logEntry.quantity:0;meta=`${realQuantity}g`;isAccent=true;}else{meta=(item.isVariable||item.mode==='variable')?'Var.':`${item.grams || item.defaultGrams || 0}g`;}
const row=this._createItem(item.name,()=>handlers.onItemClick(item),meta,isAccent,false,(!isGroup&&(item.isVariable||item.mode==='variable')));container.appendChild(row);});if(viewData.isRoot){container.appendChild(this._createItem(t('action_other'),handlers.onOther,'+'));container.appendChild(this._createItem(t('action_skip'),handlers.onSkip,'X'));}
const saveWrapper=document.createElement('div');saveWrapper.className='save-action-wrapper';const saveBtn=document.createElement('button');saveBtn.className='btn-save';saveBtn.innerText=t('btn_save').toUpperCase();saveBtn.onclick=(e)=>{e.stopPropagation();if(handlers.onSave)handlers.onSave();};saveWrapper.appendChild(saveBtn);container.appendChild(saveWrapper);}
static renderSummary(container,progressLog,status,handlers){container.innerHTML='';const dict=i18nService.dictionaries['nutrition_smart/smart-meal-check-wit'];const t=(key)=>dict?dict.t(key):key;const eatenItems=Object.values(progressLog).filter(p=>p.isDone);if(eatenItems.length===0&&status==='SKIPPED'){container.appendChild(this._createItem(t('lbl_skipped'),null,''));}else{eatenItems.forEach(p=>{const row=this._createItem(p.name,null,`${p.quantity}g`,true);row.style.cursor='default';container.appendChild(row);});}
const editBtn=this._createItem(t('btn_reset'),handlers.onReset,'',false,true);container.appendChild(editBtn);}
static _createItem(textHTML,onClick,meta='',isAccent=false,isBold=false,isUnderline=false){const div=document.createElement('div');div.className='content-item';if(isAccent)div.classList.add('selected-green');if(isBold)div.classList.add('accent-text');if(isUnderline)div.classList.add('is-variable');div.innerHTML=`
            <span>${textHTML}</span>
            <span class="meta-text">${meta}</span>
        `;if(onClick){div.onclick=(e)=>{e.stopPropagation();onClick();};}
return div;}
static updateHeaderIcon(iconContainer,isOpen,status){if(!isOpen){if(status==='DONE'){iconContainer.innerHTML=ICONS.CHECK||'✔';}else if(status==='SKIPPED'){iconContainer.innerHTML=ICONS.CROSS||'X';}else{iconContainer.innerHTML=ICONS.ARROW_DOWN||'▼';}}else{iconContainer.innerHTML=ICONS.ARROW_UP||'▲';}}}