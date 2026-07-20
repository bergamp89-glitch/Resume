const fs = require('fs');
async function test() {
  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbwD3STgUcxPIEfHw9iZVUiEJCk2QRRnxK7FqFP5jLHEVaYJOwj33lpNTECNefmZMDKnhQ/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ pdfBase64: 'data:application/pdf;base64,JVBERi0xLg==', fileName: 'test.pdf' })
    });
    console.log(res.status);
    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error(e);
  }
}
test();
