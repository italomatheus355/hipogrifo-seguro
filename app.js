// app.js - Lógica FINAL para o fluxo de 3 telas
document.addEventListener('DOMContentLoaded', function(){
  const identForm = document.getElementById('ident-form');
  const nomeInput = document.getElementById('nome');
  const graduacaoInput = document.getElementById('graduacao');
  const emailInput = document.getElementById('email');

  // --- Lógica da Tela 1: Identificação ---
  if(identForm) {
      identForm.addEventListener('submit', function(e){
          e.preventDefault();
          
          // Salva os dados de identificação localmente
          localStorage.setItem('sis_nome', nomeInput.value);
          localStorage.setItem('sis_grad', graduacaoInput.value);
          localStorage.setItem('sis_email', emailInput.value);
          
          // Redireciona para a página de instruções
          window.location.href = 'instrucoes.html'; 
      });

      // Opcional: lembrar usuário para preencher mais rápido na próxima vez
      if(localStorage.getItem('sis_nome')){
          nomeInput.value = localStorage.getItem('sis_nome');
          graduacaoInput.value = localStorage.getItem('sis_grad');
          emailInput.value = localStorage.getItem('sis_email');
      }
  }

  // --- Lógica da Tela 3: Checklist (Pré-envio) ---
  const checklistForm = document.getElementById('checklist-form');
  if (checklistForm) {
    const formNome = document.getElementById('form-nome');
    const formGrad = document.getElementById('form-graduacao');
    const formEmail = document.getElementById('form-email');

    // Carrega dados de identificação do localStorage para os campos ocultos do formulário FormSubmit
    if(localStorage.getItem('sis_nome')){
        formNome.value = localStorage.getItem('sis_nome');
        formGrad.value = localStorage.getItem('sis_grad');
        formEmail.value = localStorage.getItem('sis_email');
    }

    checklistForm.addEventListener('submit', function(){
      // marca como enviado localmente
      localStorage.setItem('sis_last_sent', new Date().toISOString());
      // Nota: o FormSubmit abrirá uma nova aba para confirmação, e depois redirecionará para thankyou.html
    });
  }

  // --- Lógica de Registro do Service Worker para PWA (para todas as páginas) ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then(reg => {
          console.log('Service Worker registrado com sucesso:', reg);
        })
        .catch(err => {
          console.log('Falha no registro do Service Worker:', err);
        });
    });
  }
});