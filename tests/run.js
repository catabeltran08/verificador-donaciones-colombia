#!/usr/bin/env node
/*
 * Corre los casos de tests/casos.json contra la lógica embebida en
 * verificador-donaciones-colombia.html — sin build, sin dependencias.
 * Uso: node tests/run.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.join(__dirname, '..');
const HTML_PATH = path.join(RAIZ, 'verificador-donaciones-colombia.html');

function fakeEl(){
  return {
    innerHTML: '', value: '', textContent: '',
    addEventListener(){}, removeEventListener(){},
    setAttribute(){}, focus(){},
    querySelector(){ return fakeEl(); },
  };
}

function cargarLogica(){
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  const start = html.indexOf('<script>') + '<script>'.length;
  const end = html.lastIndexOf('</script>');
  if(start < 8 || end < 0) throw new Error('No se encontró el <script> embebido en el HTML.');
  const code = html.slice(start, end);

  const contexto = {
    document: { querySelector: () => fakeEl() },
    fetch: () => Promise.reject(new Error('sin red en las pruebas — se usa el respaldo embebido')),
    console, URL,
  };
  vm.createContext(contexto);
  vm.runInContext(code, contexto, { filename: 'verificador-donaciones-colombia.html' });
  return contexto; // analyze, veredicto, nitOk, lev, digits, norm quedan disponibles aquí
}

function main(){
  const ctx = cargarLogica();
  const casos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));

  let ok = 0, fail = 0;

  for(const caso of casos){
    const r = ctx.analyze(caso.input);
    if(!r){
      console.log(`✗ FALLÓ  ${caso.nombre}\n   analyze() devolvió null/vacío, se esperaba tone="${caso.tone}"`);
      fail++; continue;
    }
    const v = ctx.veredicto(r);
    const toneOk = v.tone === caso.tone;
    const nearOk = caso.near ? !!v.near : true;
    if(toneOk && nearOk){
      ok++;
    } else {
      fail++;
      console.log(`✗ FALLÓ  ${caso.nombre}`);
      console.log(`   input: ${JSON.stringify(caso.input)}`);
      console.log(`   esperado: tone=${caso.tone}${caso.near?' (con diff visible)':''}`);
      console.log(`   obtenido: tone=${v.tone}${v.near?' (con diff visible)':''}`);
    }
  }
  console.log(`\nCasos fijos: ${ok}/${casos.length} OK`);

  /* --- robustez: nunca debe reventar --- */
  const robustos = [
    ['texto vacío', ''],
    ['solo espacios', '   '],
    ['solo emojis', '🙏🙏🙏❤️❤️😢'],
    ['texto de 50.000 caracteres', 'ayuda a las víctimas del terremoto '.repeat(1430)],
    ['pdf pegado (binario simulado)', '%PDF-1.4\n%âãÏÓ\n1 0 obj<< /Type /Catalog >>\nstream\n' + '\x00\x01\x02'.repeat(500)],
    ['solo un número corto', '123'],
    ['NIT mal formado', 'NIT: abc-def'],
  ];
  let robOk = 0;
  for(const [nombre, texto] of robustos){
    try{
      const r = ctx.analyze(texto);
      if(r) ctx.veredicto(r);
      robOk++;
    }catch(e){
      fail++;
      console.log(`✗ FALLÓ (reventó)  robustez: ${nombre}\n   ${e.message}`);
    }
  }
  console.log(`Robustez: ${robOk}/${robustos.length} OK (no reventaron)`);

  /* --- dígito de verificación del NIT: caso documentado en CLAUDE.md --- */
  if(ctx.nitOk('900326456-1') === true){ ok++; console.log('✓ nitOk("900326456-1") === true'); }
  else { fail++; console.log('✗ FALLÓ  nitOk("900326456-1") debería ser true (caso ABACO documentado en CLAUDE.md)'); }

  /* --- prueba estadística: falsas alarmas con números al azar --- */
  /* Ver CLAUDE.md sección 3: umbral documentado es <0,05% en 20.000 números. */
  const N = 20000;
  let falsasAlarmas = 0;
  for(let i=0;i<N;i++){
    const len = 10 + Math.floor(Math.random()*2); // 10 u 11 dígitos, como cuentas reales
    let n = '';
    for(let j=0;j<len;j++) n += Math.floor(Math.random()*10);
    const r = ctx.analyze(n);
    if(r){
      const v = ctx.veredicto(r);
      if(v.tone !== 'amarillo') falsasAlarmas++; // cualquier azul o rojo sobre ruido puro es una falsa alarma
    }
  }
  const tasa = (falsasAlarmas / N) * 100;
  console.log(`Fuzz de ${N} números aleatorios: ${falsasAlarmas} falsas alarmas (${tasa.toFixed(3)}%)`);
  if(tasa < 0.05){ console.log('✓ Tasa de falsas alarmas dentro del umbral documentado (<0,05%)'); ok++; }
  else { console.log('✗ FALLÓ  Tasa de falsas alarmas por encima del umbral documentado — revisa los umbrales de Levenshtein'); fail++; }

  console.log(`\n${fail===0 ? '✓ TODO OK' : `✗ ${fail} prueba(s) fallaron`}`);
  process.exit(fail===0 ? 0 : 1);
}

main();
