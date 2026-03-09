class EventBus{constructor(){this.events={};this.debug=true;}
on(eventName,callback){if(!this.events[eventName]){this.events[eventName]=[];}
this.events[eventName].push(callback);}
off(eventName,callback){if(!this.events[eventName])return;this.events[eventName]=this.events[eventName].filter(cb=>cb!==callback);}
emit(eventName,data=null){if(this.debug){console.log(`%c[BUS] Event: ${eventName}`,'color: #00bcd4',data);}
if(this.events[eventName]){this.events[eventName].forEach(callback=>{try{callback(data);}catch(error){console.error(`Error handling event ${eventName}:`,error);}});}}}
export const bus=new EventBus();