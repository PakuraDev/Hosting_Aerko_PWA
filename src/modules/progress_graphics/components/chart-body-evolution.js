import{unitService}from'../../../core/utils/unit.service.js';import{userService}from'../../user/services/user.service.js';import{i18nService}from'../../../core/i18n/i18n.service.js';export class ChartBodyEvolution extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'});this.chartInstance=null;this._data=null;}
set data(val){this._data=val;if(this.isConnected){this.renderChart();}}
async connectedCallback(){this.dict=await i18nService.loadPage('progress_graphics/chart-body-evolution');this.render();setTimeout(()=>{if(this._data)this.renderChart();},0);}
disconnectedCallback(){if(this.chartInstance){this.chartInstance.destroy();}}
render(){this.shadowRoot.innerHTML=`
            <style>
                :host {
                    display: block;
                    width: 100%;
                    /* Ocupa todo el espacio que le deje el dashboard */
                    height: 100%; 
                    min-height: 300px; 
                    position: relative;
                }
                .chart-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                /* Forzamos al canvas a ser responsive dentro del contenedor */
                canvas {
                    width: 100% !important;
                    height: 100% !important;
                }
            </style>
            <div class="chart-container">
                <canvas id="evolutionChart"></canvas>
            </div>
        `;}
renderChart(){if(typeof Chart==='undefined'){console.error('[Aerko] Chart.js no encontrado. ¿Revisaste el index.html?');return;}
const canvas=this.shadowRoot.querySelector('#evolutionChart');if(!canvas)return;const ctx=canvas.getContext('2d');if(this.chartInstance){this.chartInstance.destroy();}
const records=this._data?.progressRecords||[];const sortedRecords=[...records].reverse();const labels=sortedRecords.map(r=>{const date=new Date(r.timestamp);return`${date.getDate()}/${date.getMonth() + 1}`;});const profile=userService.getProfile();const weightUnit=profile.weightUnit||'KG';const weightData=sortedRecords.map(r=>{if(!r.weight)return null;return unitService.toDisplay(r.weight,weightUnit);});const fatData=sortedRecords.map(r=>r.bodyFat||null);const verdeAcido='#CCFF00';const azulCyan='#00E5FF';const fontMono='"JetBrains Mono", monospace';const gridSutil='rgba(255, 255, 255, 0.05)';this.chartInstance=new Chart(ctx,{type:'line',data:{labels:labels,datasets:[{label:this.dict.t('chart_body_lbl_weight'),data:weightData,borderColor:verdeAcido,yAxisID:'y',tension:0.4,borderWidth:3,pointRadius:0,pointHoverRadius:6,pointHoverBackgroundColor:'#1A1A1A',pointHoverBorderColor:verdeAcido,pointHoverBorderWidth:2},{label:this.dict.t('chart_body_lbl_fat'),data:fatData,borderColor:azulCyan,yAxisID:'y1',tension:0.4,borderWidth:2,pointRadius:0,pointHoverRadius:6,pointHoverBackgroundColor:'#1A1A1A',pointHoverBorderColor:azulCyan,pointHoverBorderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false,},plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(26, 26, 26, 0.95)',titleFont:{family:fontMono,size:12},bodyFont:{family:fontMono,size:14,weight:'bold'},padding:12,borderColor:'rgba(255,255,255,0.1)',borderWidth:1,displayColors:true,boxPadding:6,cornerRadius:4}},scales:{x:{grid:{display:false},ticks:{color:'rgba(255, 255, 255, 0.5)',font:{family:fontMono,size:11}}},y:{type:'linear',display:true,position:'left',grid:{color:gridSutil,drawBorder:false,},ticks:{color:verdeAcido,font:{family:fontMono,size:11},callback:function(value){return value+' '+weightUnit;}}},y1:{type:'linear',display:true,position:'right',grid:{display:false},ticks:{color:azulCyan,font:{family:fontMono,size:11},callback:function(value){return value+'%';}}}}}});}}
customElements.define('chart-body-evolution',ChartBodyEvolution);