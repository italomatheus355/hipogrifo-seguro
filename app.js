// app.js - Lógica COMPLETA FINAL com Mailto OTIMIZADO

// --- Configurações Fixas ---
const EMAIL_DESTINATARIO = 'italo.medeiros@marinha.mil.br'; // MUDE ESTE PARA SEU EMAIL DE TESTE
const NOME_DO_APLICATIVO = 'Hipogrifo Seguro';

const PERGUNTAS = [
    "1. Usei todos os métodos, recursos e práticas padrão estabelecidas para a manutenção da aeronave (manuais, pesquisas, normas e procedimentos padrão) para realizar o meu trabalho?",
    "2. Consegui realizar minhas tarefas no tempo planejado?",
    "3. Percebo que realizei o meu trabalho com o melhor desempenho?",
    "4. Estou me sentindo bem com o meu desempenho no trabalho?",
    "5. Percebo que consegui realizar o meu trabalho com as minhas habilidades?",
    "6. Sinto-me em boas condições ao final da realização do meu trabalho?",
    "7. Realizei o meu trabalho com pressões negativas, estresse negativo e distrações?",
    "8. Estou seguro sobre o resultado do meu trabalho?",
    "9. Realizei checks após a conclusão do meu trabalho (como entrega de ferramentas e observação de materiais na estrutura ou interior da aeronave)?",
    "10. O meu trabalho foi supervisionado?",
    "11. Finalizei minhas tarefas com a mesma performance inicial?"
];

// --- 1. Lógica da Tela de Identificação (Executada ao carregar a página) ---
document.addEventListener('DOMContentLoaded', function(){
    const identForm = document.getElementById('ident-form');

    if(identForm) {
        const nomeInput = document.getElementById('nome');
        const graduacaoInput = document.getElementById('graduacao');
        const emailInput = document.getElementById('email');

        identForm.addEventListener('submit', function(e){
            e.preventDefault();
            // SALVA OS DADOS e REDIRECIONA
            localStorage.setItem('sis_nome', nomeInput.value);
            localStorage.setItem('sis_grad', graduacaoInput.value);
            localStorage.setItem('sis_email', emailInput.value);
            window.location.href = 'instrucoes.html'; 
        });

        // Preencher se houver dados salvos
        if(localStorage.getItem('sis_nome')){
            nomeInput.value = localStorage.getItem('sis_nome');
            graduacaoInput.value = localStorage.getItem('sis_grad');
            emailInput.value = localStorage.getItem('sis_email');
        }
    }

    // --- Lógica de Registro do Service Worker (para PWA) ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('service-worker.js')
            .then(reg => { console.log('Service Worker registrado com sucesso:', reg); })
            .catch(err => { console.log('Falha no registro do Service Worker:', err); });
        });
      }
});

// --- 2. FUNÇÃO DE ENVIO/MAILTO (Global, chamada pelo botão) ---
window.enviarChecklist = function() {
    
    const checklistArea = document.getElementById('checklist-area');

    if (!checklistArea) {
        alert('Erro: Componente de checklist não encontrado.');
        return; 
    }

    let todasRespondidas = true;
    
    // Usamos %0A para quebrar a linha e %20 para espaços no corpo do e-mail (URL Encoding)
    let corpoEmail = "---%0A*HIPOGRIFO%20SEGURO%20-%20CHECKLIST%20PÓS-MANUTENÇÃO*%0A---%0A%0A";

    // 1. Coleta das Respostas e Verificação

    const respostas = [];
    for (let i = 1; i <= PERGUNTAS.length; i++) {
        const selector = `input[name="p${i}"]:checked`;
        const respostaElement = checklistArea.querySelector(selector);
        
        if (!respostaElement) {
            todasRespondidas = false;
            break; 
        }
        
        respostas.push({
            pergunta: PERGUNTAS[i - 1].replace(/(\r\n|\n|\r)/gm, " "),
            resposta: respostaElement.value
        });
    }

    if (!todasRespondidas) {
        alert('Por favor, responda a todas as 11 perguntas do checklist antes de enviar.');
        return;
    }

    // 2. Montagem do Conteúdo do E-mail (com quebra de linha URL encoded)
    
    // a) Identificação
    corpoEmail += "*DADOS%20DO%20MILITAR*: %0A";
    corpoEmail += `Nome:%20${encodeURIComponent(localStorage.getItem('sis_nome') || 'Não fornecido')}%0A`;
    corpoEmail += `Graduação:%20${encodeURIComponent(localStorage.getItem('sis_grad') || 'Não fornecido')}%0A`;
    corpoEmail += `E-mail:%20${encodeURIComponent(localStorage.getItem('sis_email') || 'Não fornecido')}%0A`;
    corpoEmail += `Data/Hora%20do%20Preenchimento:%20${encodeURIComponent(new Date().toLocaleString('pt-BR'))}%0A%0A`;
    
    // b) Checklist
    corpoEmail += "*RESPOSTAS%20DO%20CHECKLIST*:%0A";
    respostas.forEach((item) => {
        corpoEmail += `${encodeURIComponent(item.pergunta)}%20->%20**${item.resposta}**%0A`;
    });
    
    corpoEmail += "%0A---";

    // 3. Criação e Execução do Link mailto
    
    const subject = encodeURIComponent(`${NOME_DO_APLICATIVO} - Checklist Pós-Manutenção - ${localStorage.getItem('sis_grad') || ''}`);
    
    const mailtoLink = `mailto:${EMAIL_DESTINATARIO}?subject=${subject}&body=${corpoEmail}`;

    // Abre o cliente de e-mail do usuário
    window.location.href = mailtoLink;
    
    // 4. Feedback e Redirecionamento (Simulação do Thank You)
    alert('Checklist concluído! Seu cliente de e-mail será aberto. Por favor, clique em ENVIAR no seu programa de e-mail.');
    
    setTimeout(() => {
        // Redireciona para o agradecimento
        window.location.href = 'thankyou.html';
    }, 100); 
};
