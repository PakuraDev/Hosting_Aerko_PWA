import{oneRmService}from'../../training_core/services/1rm.service.js';import{db}from'../../../core/db/index.js';import{unitService}from'../../../core/utils/unit.service.js';import{userService}from'../../user/services/user.service.js';import{i18nService}from'../../../core/i18n/i18n.service.js';import{analysisService}from'../../training_core/services/analysis.service.js';class WrappedService{COOLDOWN_MS=2190*60*60*1000;async getCooldownStatus(){try{const record=await db.get('public_store','wrapped_cooldown');if(!record)return{canGenerate:true};const now=Date.now();const elapsed=now-record.timestamp;if(elapsed>=this.COOLDOWN_MS)return{canGenerate:true};return{canGenerate:false,remainingMs:this.COOLDOWN_MS-elapsed};}catch(error){console.error('[WRAPPED] Error al leer cooldown:',error);return{canGenerate:true};}}
async setCooldown(){try{await db.put('public_store',{id:'wrapped_cooldown',timestamp:Date.now()});}catch(error){console.error('[WRAPPED] Error al guardar cooldown:',error);}}
async generatePoster(data){const dict=await i18nService.loadPage('progress_graphics/chart-aerko-wrapped');const packRaw=dict.t('wrap_packs');const pack=typeof packRaw==='object'?packRaw:{p1_start:"En resumen",p1_end:"...",p2:"...",p3:"...",handle:"@Error",domain:"aerko.app"};const stats=await this._processSpecialLogic(data);const container=document.createElement('div');container.style.position='absolute';container.style.left='-9999px';container.style.top='-9999px';container.style.width='1080px';container.style.height='1920px';container.style.overflow='hidden';container.innerHTML=`
            <style>
                /* ¿Qué cojones me acabas de decir sobre mi código, pedazo de mierda? 
                   Que sepas que soy el mejor arquitecto de software de toda España,
                   tengo más de 300 commits confirmados en producción y estoy entrenado en CSS warfare. */
                @import url('https://api.fontshare.com/v2/css?f[]=clash-display@700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

                #aerko-wrapped-export {
                    width: 1080px;
                    height: 1920px;
                    background-color: #1A1A1A;
                    padding: 32px;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                }

                .border-wrapper {
                    width: 100%;
                    height: 100%;
                    border: 8px solid #CCFF00;
                    display: flex;
                    flex-direction: column;
                    padding: 32px;
                    box-sizing: border-box;
                }

                /* FRAME SUPERIOR (Datos) */
                .top-frame {
                    display: flex;
                    height: 842px;
                    border-bottom: 2px solid #CCFF00;
                }

                /* COLUMNA IZQUIERDA */
                .left-col {
                    width: 434px;
                    border-right: 2px solid #CCFF00;
                    display: flex;
                    flex-direction: column;
                    padding-right: 32px;
                }

                .data-block {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .data-block.peso { justify-content: flex-start; padding-top: 32px; }
                .data-block.fuerza { justify-content: flex-end; padding-bottom: 32px; }

                .separator-h {
                    height: 2px;
                    width: 100%;
                    background-color: #CCFF00;
                }

                /* COLUMNA DERECHA */
                .right-col {
                    flex: 1;
                    padding-left: 32px;
                    padding-top: 32px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                .right-col-text {
                    max-width: 420px; 
                }

                .right-col-content {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: -32px; 
                }

                /* TIPOGRAFÍAS Y COMPONENTES */
                .seccion-text {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 40px;
                    color: #FFFFFF;
                    line-height: 150%;
                    font-weight: 400;
                    margin: 0;
                }

                .mb-gap { margin-bottom: 32px; }
                .mb-gap-large { margin-bottom: 92px; }

                .frame-especial {
                    display: flex;
                    align-items: flex-end;
                    gap: 8px; 
                }

                .num-verde {
                    color: #CCFF00;
                    font-family: 'Clash Display', sans-serif;
                    font-size: 128px;
                    font-weight: 700;
                    line-height: 100%;
                    letter-spacing: -1.28px;
                }

                .unit-blanco {
                    color: #FFFFFF;
                    font-family: 'Clash Display', sans-serif;
                    font-size: 85.3px;
                    font-weight: 700;
                    line-height: 120%;
                    letter-spacing: -0.85px;
                    padding-bottom: 6px; 
                }

                /* INSULTO PRINCIPAL */
                .insulto-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 40px;
                    color: #FFFFFF;
                    line-height: 150%;
                }

                .text-green { color: #CCFF00; }
                .br-space { height: 40px; }

                /* FOOTER */
                .footer {
                    height: 60px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 32px;
                }

                .footer .handle { 
                    color: #FFFFFF; 
                    flex-shrink: 0;
                }

                .footer .domain { 
                    color: #CCFF00; 
                    text-align: right;
                    max-width: 600px; 
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            </style>
            
            <div id="aerko-wrapped-export">
                <div class="border-wrapper">
                    
                    <div class="top-frame">
                        <div class="left-col">
                            <div class="data-block peso">
                                <p class="seccion-text mb-gap">${dict.t('wrap_stat_weeks_prefix')}${stats.weeks}${dict.t('wrap_stat_weeks_suffix')}</p>
                                <div class="frame-especial" style="justify-content: center;">
                                    <span class="num-verde">${stats.totalKg}</span>
                                    <span class="unit-blanco">${stats.unitKg}</span>
                                </div>
                            </div>

                            <div class="separator-h"></div>

                            <div class="data-block fuerza">
                                <p class="seccion-text mb-gap-large">${dict.t('wrap_stat_strength_prefix')}</p>
                                <div class="frame-especial" style="justify-content: center;">
                                    <span class="num-verde">${stats.strengthIncrease}</span>
                                    <span class="unit-blanco">%</span>
                                </div>
                            </div>
                        </div>

                        <div class="right-col">
                            <p class="seccion-text right-col-text">${dict.t('wrap_dynamic_prefix')}</p>
                            <div class="right-col-content">
                                <div class="frame-especial" style="${!stats.isTsundere ? 'flex-direction: column; align-items: center; gap: 0;' : ''}">
                                    <span class="num-verde" style="${!stats.isTsundere ? 'font-size: 56px; text-align: center; line-height: 120%;' : ''}">
                                        ${stats.dynamicMainText}
                                    </span>
                                    <span class="unit-blanco">${dict.t('wrap_dynamic_suffix')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="insulto-container">
                        <p><span class="text-green">${pack.p1_start}</span>${pack.p1_end}</p>
                        <div class="br-space"></div>
                        <p>${pack.p2}</p>
                        <div class="br-space"></div>
                        <p>${pack.p3}</p>
                    </div>

                    <div class="footer">
                        <span class="handle">${pack.handle}</span>
                        <span class="domain">${pack.domain}</span>
                    </div>

                </div>
            </div>
        `;document.body.appendChild(container);try{await new Promise(resolve=>setTimeout(resolve,800));const targetElement=container.querySelector('#aerko-wrapped-export');const canvas=await window.html2canvas(targetElement,{scale:1,useCORS:true,backgroundColor:'#1A1A1A'});const link=document.createElement('a');link.download=`Aerko_Wrapped_${new Date().getFullYear()}.png`;link.href=canvas.toDataURL('image/png');link.click();await this.setCooldown();}catch(error){console.error("🔴 [WRAPPED] ¡Iyo que esto ha reventao! Fallo al generar el Póster:",error);throw error;}finally{if(document.body.contains(container)){document.body.removeChild(container);}}}
async _processSpecialLogic(data){const sessions=data?.trainingSessions||[];let totalKg=0;let minTimestamp=Infinity;let maxTimestamp=0;sessions.forEach(session=>{if(session.timestamp<minTimestamp)minTimestamp=session.timestamp;if(session.timestamp>maxTimestamp)maxTimestamp=session.timestamp;session.exercises.forEach(ex=>{if(ex.sets){ex.sets.forEach(set=>{totalKg+=((set.kg||0)*(set.reps||0));});}});});let weeks=1;if(minTimestamp!==Infinity&&maxTimestamp>minTimestamp){const diffMs=maxTimestamp-minTimestamp;weeks=Math.max(1,Math.ceil(diffMs/(1000*60*60*24*7)));}
const baselineMaxes={};const currentMaxes={};const sortedSessions=[...sessions].sort((a,b)=>a.timestamp-b.timestamp);sortedSessions.forEach(session=>{session.exercises.forEach(ex=>{if(!ex.sets||ex.sets.length===0)return;let maxSession1RM=0;ex.sets.forEach(set=>{const e1rm=oneRmService.calculate1RM(set.kg,set.reps);if(e1rm>maxSession1RM)maxSession1RM=e1rm;});if(!baselineMaxes[ex.id]){baselineMaxes[ex.id]=maxSession1RM;currentMaxes[ex.id]=maxSession1RM;}else if(maxSession1RM>currentMaxes[ex.id]){currentMaxes[ex.id]=maxSession1RM;}});});const exercisesTracked=Object.keys(baselineMaxes);let strengthIncrease=0;if(exercisesTracked.length>0){let totalImprovement=0;exercisesTracked.forEach(id=>{const base=baselineMaxes[id];const current=currentMaxes[id];if(base>0){const percentIncrease=((current-base)/base)*100;totalImprovement+=percentIncrease;}});strengthIncrease=Math.round((totalImprovement/exercisesTracked.length)*10)/10;}
const profile=userService.getProfile();const weightUnit=profile.weightUnit||'KG';let convertedTotal=unitService.toDisplay(totalKg,weightUnit);let displayValue=convertedTotal;let finalUnit=weightUnit;if(weightUnit==='KG'){if(convertedTotal>=1000){displayValue=(convertedTotal/1000).toFixed(1);displayValue=parseFloat(displayValue).toString();finalUnit='T';}else{displayValue=Math.round(convertedTotal).toString();}}else{if(convertedTotal>=1000){displayValue=(convertedTotal/1000).toFixed(1);displayValue=parseFloat(displayValue).toString();finalUnit='kLB';}else{displayValue=Math.round(convertedTotal).toString();}}
let formattedStrength=`${strengthIncrease}`;if(strengthIncrease>0)formattedStrength=`+${strengthIncrease}`;const prefs=i18nService.getPreferences();const isTsundere=(prefs.mode==='c');let dynamicMainText="";if(isTsundere){const diasTotales=weeks*7;const porcentajeRandom=Math.random()*0.10+0.15;const skippedDays=Math.floor(diasTotales*porcentajeRandom);dynamicMainText=skippedDays.toString();}else{let bestMuscle="Ninguno";const start=minTimestamp!==Infinity?minTimestamp:0;const end=maxTimestamp>0?maxTimestamp:Date.now();const volumeReport=await analysisService.calculateWeeklyVolume(start,end);if(volumeReport){const allMuscles=[...volumeReport.alerts,...volumeReport.optimal];allMuscles.sort((a,b)=>b.volume-a.volume);if(allMuscles.length>0){bestMuscle=allMuscles[0].muscleName;}}
dynamicMainText=bestMuscle;}
return{weeks:weeks,totalKg:displayValue,unitKg:finalUnit,strengthIncrease:formattedStrength,isTsundere:isTsundere,dynamicMainText:dynamicMainText};}}
export const wrappedService=new WrappedService();