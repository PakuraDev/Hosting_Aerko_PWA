import{authService}from'../../modules/auth/services/auth.service.js';import{i18nService}from'../i18n/i18n.service.js';class Router{constructor(){this.routes={};this.appContainer=null;this.publicRoutes=['/auth/login','/onboarding/welcome','/onboarding/wizard','/onboarding/import','/onboarding/import-action'];}
init(){this.appContainer=document.getElementById('app');window.addEventListener('hashchange',()=>this.handleRoute());window.addEventListener('load',()=>this.handleRoute());}
on(path,renderFunction){this.routes[path]=renderFunction;}
navigate(path){window.location.hash=path;}
_matchRoute(definedPath,realPath){const defParts=definedPath.split('/');const realParts=realPath.split('/');if(defParts.length!==realParts.length)return false;return defParts.every((part,i)=>{return part.startsWith(':')||part===realParts[i];});}
async handleRoute(){const rawHash=window.location.hash.slice(1)||'/';const[cleanPath]=rawHash.split('?');const isPublic=this.publicRoutes.some(publicPath=>cleanPath.startsWith(publicPath));if(!isPublic){const hasPin=await authService.hasPin();if(hasPin&&!authService.isSessionActive()){console.warn(`[ROUTER] 🛑 Acceso denegado a ${cleanPath}. Sesión cerrada.`);this.navigate('/auth/login');return;}else if(!hasPin){const onboardingDone=await authService.isOnboardingComplete();if(!onboardingDone&&!cleanPath.startsWith('/onboarding')){this.navigate('/onboarding/welcome');return;}}}
let renderFn=this.routes[cleanPath];if(!renderFn){for(const[routeDef,renderer]of Object.entries(this.routes)){if(this._matchRoute(routeDef,cleanPath)){renderFn=renderer;break;}}}
if(renderFn){try{const content=await renderFn();if(content instanceof HTMLElement){this.appContainer.replaceChildren(content);}else if(typeof content==='string'){this.appContainer.innerHTML=content;}}catch(error){console.error(`Error loading route ${cleanPath}:`,error);const dict=await i18nService.loadPage('system/router');this.appContainer.innerHTML=`
                    <div style="padding: 24px; text-align: center; margin-top: 20vh;">
                        <h2 class="text-h2" style="color:red">${dict.t('system_failure')}</h2>
                        <br>
                        <p class="text-body-base" style="color: var(--Blanco); opacity: 0.7;">${error.message}</p>
                    </div>`;}}else{await this.render404();}}
async render404(){const dict=await i18nService.loadPage('system/router');this.appContainer.innerHTML=`
            <div style="padding: 24px; text-align: center; margin-top: 20vh;">
                <h1 class="text-h1" style="color: var(--color-primary)">${dict.t('error_404_title')}</h1>
                <p class="text-body-large">${dict.t('error_404_desc')}</p>
                <br>
                <button onclick="window.location.hash = '#/'" class="btn-text" style="color: var(--color-primary); border: 1px solid var(--color-primary); padding: 12px; background: transparent;">
                    > ${dict.t('error_404_btn')}
                </button>
            </div>
        `;}}
export const router=new Router();