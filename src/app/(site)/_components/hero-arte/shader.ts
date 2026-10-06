/**
 * Shaders da arte "Tecido de bytes".
 *
 * Um triângulo cobre a tela; todo o desenho acontece no fragment shader.
 * Ideia: uma grade de bytes (quadrados em células), ordenada e calma atrás
 * do título, que se dissolve em um campo de fluxo líquido conforme se
 * afasta do `;` — o byte virando criativo. O `;` é o ponto de onde a
 * energia emana (u_ancora). O ponteiro curva o fluxo de leve (u_ponteiro,
 * já amortecido no JS).
 *
 * Compatibilidade: GLSL ES 1.00 (WebGL1), sem derivadas nem laços. Duas
 * oitavas de ruído por camada, no máximo. A precisão é highp onde o
 * fragment shader a suporta: o hash e o `permute` do ruído produzem valores
 * além do alcance de fp16, e em GPUs de celular `mediump` costuma ser fp16
 * de verdade.
 *
 * Os comentários ficam AQUI, fora das strings: o minificador não remove
 * comentários dentro de template literal, e cada byte conta no orçamento de
 * JS da home.
 *
 * Mapa do fragment shader:
 * - uniforms: resolução, ângulo de tempo cíclico (0..2π por período),
 *   semente da visita, ponteiro e âncora em coordenadas corrigidas pelo
 *   aspecto, revelação (0..1), os seis parâmetros do preset e as seis cores
 *   em OKLab (resolvidas no cliente a partir das variáveis CSS);
 * - `snoise`: ruído simplex 2D (Ashima Arts, licença MIT);
 * - `hash`: ruído branco para o grão e a identidade de cada célula;
 * - `oklabParaSrgb`: conversão única por pixel, no fim;
 * - `main`:
 *   1. tempo cíclico: um ponto que anda num círculo no espaço do ruído, para
 *      o campo voltar ao início sem reinício visível;
 *   2. zona calma: caixa do título que termina no `;` (âncora no canto
 *      inferior direito); a energia cresce com a distância à caixa;
 *   3. ponteiro: bolha suave que empurra o campo;
 *   4. campo de fluxo com deformação de domínio (duas oitavas);
 *   5. dissolução: perto do título os bytes ficam inteiros; longe, esticam
 *      ao longo do fluxo e viram líquido;
 *   6. cor em OKLab: lavagem base → tinta, líquido tinta → azul contido,
 *      veias para profundidade, bytes em pedra com fio de azul; os bytes
 *      mais próximos do `;` carregam o laranja dele (único laranja da peça).
 *      A zona calma é clareada em direção à base e um halo de base pura
 *      (sem grão) fica atrás do `;`: o laranja do glifo precisa dos 3:1 do
 *      par aprovado "accent sobre bg" em qualquer quadro;
 *   7. revelação em círculo a partir do `;`; u_rolagem (quanto do hero já
 *      rolou para fora) adianta o tempo e dissolve os bytes, para a arte
 *      responder ao scroll também no toque;
 *   8. grão de filme + dithering para eliminar faixas.
 */

export const VERTEX_SHADER = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.0,1.0);}
`

export const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_angulo;
uniform float u_semente;
uniform vec2 u_ponteiro;
uniform vec2 u_ancora;
uniform float u_revelacao;
uniform float u_rolagem;
uniform float u_velocidade;
uniform float u_dobra;
uniform float u_azul;
uniform float u_grao;
uniform float u_forcaPonteiro;
uniform float u_grade;
uniform vec3 u_cBase;
uniform vec3 u_cTinta;
uniform vec3 u_cPedra;
uniform vec3 u_cAzul;
uniform vec3 u_cLaranja;
uniform vec3 u_cInk;
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
vec2 i=floor(v+dot(v,C.yy));
vec2 x0=v-i+dot(i,C.xx);
vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
vec4 x12=x0.xyxy+C.xxzz;
x12.xy-=i1;
i=mod289(i);
vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
m=m*m;m=m*m;
vec3 x=2.0*fract(p*C.www)-1.0;
vec3 h=abs(x)-0.5;
vec3 ox=floor(x+0.5);
vec3 a0=x-ox;
m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
vec3 g;
g.x=a0.x*x0.x+h.x*x0.y;
g.yz=a0.yz*x12.xz+h.yz*x12.yw;
return 130.0*dot(m,g);
}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float srgb(float c){return c<=0.0031308?12.92*c:1.055*pow(c,1.0/2.4)-0.055;}
vec3 oklabParaSrgb(vec3 c){
float l_=c.x+0.3963377774*c.y+0.2158037573*c.z;
float m_=c.x-0.1055613458*c.y-0.0638541728*c.z;
float s_=c.x-0.0894841775*c.y-1.2914855480*c.z;
float l=l_*l_*l_;float m=m_*m_*m_;float s=s_*s_*s_;
vec3 lin=vec3(
4.0767416621*l-3.3077115913*m+0.2309699292*s,
-1.2684380046*l+2.6097574011*m-0.3413193965*s,
-0.0041960863*l-0.7034186147*m+1.7076147010*s);
lin=clamp(lin,0.0,1.0);
return vec3(srgb(lin.r),srgb(lin.g),srgb(lin.b));
}
void main(){
float aspecto=u_res.x/u_res.y;
vec2 p=vec2(v_uv.x*aspecto,v_uv.y);
float ang=u_angulo+u_rolagem*1.2;
vec2 giro=vec2(cos(ang),sin(ang))*(1.2*u_velocidade);
vec2 semente=vec2(u_semente*7.31,u_semente*3.17)*10.0;
vec2 centroTitulo=u_ancora+vec2(-0.26,0.14);
vec2 meioTitulo=vec2(0.34,0.2);
vec2 foraCaixa=max(abs(p-centroTitulo)-meioTitulo,0.0);
float dCaixa=length(foraCaixa);
float energia=max(smoothstep(0.05,0.75,dCaixa),smoothstep(0.0,0.8,u_rolagem));
float d=length(p-u_ancora);
vec2 aoPonteiro=p-u_ponteiro;
float dp=length(aoPonteiro);
vec2 empurrao=(aoPonteiro/max(dp,0.001))*exp(-dp*dp*7.0)*0.1*u_forcaPonteiro;
vec2 q=p*1.5+semente;
float n1=snoise(q+giro*0.35);
float n2=snoise(q*1.9+vec2(4.7,-2.3)-giro*0.5);
vec2 dobra=vec2(n1,n2)*(0.12+0.4*u_dobra)*energia+empurrao;
vec2 pw=p+dobra;
float fluxo=snoise(pw*1.7+semente*0.5+giro*0.2);
float fluxo2=snoise(pw*3.6-semente+giro*0.45);
float campo=0.5+0.5*fluxo;
float faixas=smoothstep(0.15,1.15,campo+0.2*fluxo2);
float dissolve=smoothstep(0.0,1.0,energia+0.2*fluxo2);
vec2 g=pw*u_grade;
vec2 celula=fract(g)-0.5;
float idHash=hash(floor(g)+semente);
float respira=0.5+0.5*sin(u_angulo*4.0+idHash*6.2831853);
float lado=0.1+0.12*respira*(0.6+0.4*fluxo);
float aa=(u_grade/u_res.y)*1.4;
vec2 c=celula;
c.x/=1.0+3.0*dissolve;
float caixa=max(abs(c.x),abs(c.y));
float pixel=1.0-smoothstep(lado-aa,lado+aa,caixa);
float bytes=pixel*(1.0-dissolve*dissolve)*(0.45+0.55*idHash);
float liquido=faixas*dissolve;
float lav=smoothstep(-0.3,1.3,(1.0-v_uv.y)*0.55+v_uv.x*0.45+0.3*fluxo);
vec3 cor=mix(u_cBase,u_cTinta,lav);
vec3 corLiq=mix(u_cTinta,u_cAzul,0.09+0.14*u_azul*faixas);
cor=mix(cor,corLiq,liquido*0.9);
float veias=smoothstep(0.55,1.0,0.5+0.5*fluxo2)*dissolve;
cor=mix(cor,mix(u_cAzul,u_cInk,0.25),veias*0.045*u_azul);
vec3 corByte=mix(u_cPedra,u_cAzul,0.3*u_azul);
float doSemicolon=exp(-d*d*55.0);
corByte=mix(corByte,u_cLaranja,doSemicolon*0.9);
cor=mix(cor,corByte,bytes*(0.62+0.3*doSemicolon));
cor=mix(cor,u_cBase,0.22*(1.0-energia));
float halo=1.0-smoothstep(0.035,0.1,d);
cor=mix(cor,u_cBase,halo);
float raioRev=u_revelacao*2.6;
float rev=1.0-smoothstep(raioRev-0.35,raioRev,d);
cor=mix(u_cBase,cor,rev);
vec3 rgb=oklabParaSrgb(cor);
float grao=hash(gl_FragCoord.xy+vec2(fract(u_angulo*7.0)*61.0))-0.5;
rgb+=grao*u_grao*(1.0-halo);
gl_FragColor=vec4(rgb,1.0);
}
`
