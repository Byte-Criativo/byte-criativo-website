/** RC9: espera depois do `load` antes de concluir que a hidratação falhou. */
export const ESPERA_HIDRATACAO_MS = 4000

/**
 * Script inline do `<head>`, executado antes da primeira pintura (a CSP da
 * arquitetura 5.8 permite script inline). Grava `data-js` e, onde houver
 * Invoker Commands, `data-invoker`. Depois do `load`, espera
 * ESPERA_HIDRATACAO_MS: se a raiz não tiver `data-hidratado`, remove
 * `data-js` e a página volta ao estado sem JS. Se houver `dialog[open]`
 * (menu aberto nativamente antes da hidratação), espera o `close`.
 */
export const SCRIPT_MARCADOR_JS = `(function(){
var raiz=document.documentElement;
raiz.setAttribute("data-js","");
if("commandForElement" in HTMLButtonElement.prototype){raiz.setAttribute("data-invoker","")}
function decidir(){if(!raiz.hasAttribute("data-hidratado")){raiz.removeAttribute("data-js")}}
function agendar(){setTimeout(function(){
var aberto=document.querySelector("dialog[open]");
if(aberto){aberto.addEventListener("close",decidir,{once:true})}else{decidir()}
},${ESPERA_HIDRATACAO_MS})}
if(document.readyState==="complete"){agendar()}else{addEventListener("load",agendar)}
})()`
