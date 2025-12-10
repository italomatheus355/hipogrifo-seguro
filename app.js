// app.js - Lógica COMPLETA FINAL e OTIMIZADA com Download de Arquivo TXT

// --- Configurações Fixas ---
const EMAIL_DESTINATARIO = 'italo.medeiros@marinha.mil.br'; 
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

// --- 2. FUNÇÃO DE ENVIO/DOWNLOAD (Global, chamada pelo botão) ---
window.enviarChecklist = function() {
    
    const checklistArea = document.getElementById('checklist-area');

    if (!checklistArea) {
        // Se a área do checklist não for encontrada, algo está errado no HTML
        alert('Erro: Componente de checklist não encontrado.');
        return; 
    }

    let todasRespondidas = true;
    let conteudoArquivo = "--- RELATÓRIO " + NOME_DO_APLICATIVO.toUpperCase() + " ---\n\n";

    // Coleta das Respostas e Verificação
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
        alert('Por favor, responda a todas as 11 perguntas do checklist antes de finalizar.');
        return;
    }

    // Montagem do Conteúdo Final do Arquivo TXT
    
    // a) Identificação (Lê diretamente do localStorage)
    conteudoArquivo += "DADOS DO MILITAR:\n";
    conteudoArquivo += `Nome: ${localStorage.getItem('sis_nome') || 'Não fornecido'}\n`;
    conteudoArquivo += `Graduação: ${localStorage.getItem('sis_grad') || 'Não fornecido'}\n`;
    conteudoArquivo += `E-mail: ${localStorage.getItem('sis_email') || 'Não fornecido'}\n`;
    conteudoArquivo += `Data/Hora do Preenchimento: ${new Date().toLocaleString('pt-BR')}\n\n`;
    
    // b) Checklist
    conteudoArquivo += "RESPOSTAS DO CHECKLIST:\n";
    respostas.forEach((item) => {
        conteudoArquivo += `${item.pergunta} -> ${item.resposta}\n`;
    });
    
    conteudoArquivo += "\n--------------------------------------------------------------";

    // 3. Geração e Disparo do Download do Arquivo .txt
    
    const nomeMilitar = localStorage.getItem('sis_nome') || 'Militar';
    const nomeArquivo = `CHECKLIST_${nomeMilitar.toUpperCase().replace(/\s/g, '_')}_${new Date().getFullYear()}.txt`;
    
    const blob = new Blob([conteudoArquivo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 4. Feedback e Redirecionamento
    alert(`Download concluído! Por favor, anexe o arquivo "${nomeArquivo}" em um novo e-mail para ${EMAIL_DESTINATARIO}.`);
    
    setTimeout(() => {
        window.location.href = 'thankyou.html';
    }, 100); 

};
