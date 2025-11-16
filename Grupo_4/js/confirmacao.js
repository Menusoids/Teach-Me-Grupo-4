// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da página de confirmação
    const confProfessor = document.getElementById('conf-professor');
    const confData = document.getElementById('conf-data');
    const confHorario = document.getElementById('conf-horario');
    const confDuracao = document.getElementById('conf-duracao');
    const confNomeAluno = document.getElementById('conf-nome-aluno');
    const confObservacoes = document.getElementById('conf-observacoes');

    // Função para formatar data
    function formatarData(data) {
        if (!data) return '-';
        const date = new Date(data + 'T00:00:00');
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    // Carrega dados do localStorage
    function carregarDadosAgendamento() {
        const dadosSalvos = localStorage.getItem('agendamentoAtual');
        
        if (dadosSalvos) {
            try {
                const dados = JSON.parse(dadosSalvos);
                
                // Preenche os campos com os dados salvos
                confProfessor.textContent = dados.professor || '-';
                confData.textContent = formatarData(dados.data) || '-';
                confHorario.textContent = dados.horario || '-';
                confDuracao.textContent = dados.duracao || '-';
                confNomeAluno.textContent = dados.nomeAluno || '-';
                confObservacoes.textContent = dados.observacoes || 'Nenhuma observação';
            } catch (error) {
                console.error('Erro ao carregar dados do agendamento:', error);
                // Se houver erro, mostra valores padrão
                confProfessor.textContent = '-';
                confData.textContent = '-';
                confHorario.textContent = '-';
                confDuracao.textContent = '-';
                confNomeAluno.textContent = '-';
                confObservacoes.textContent = '-';
            }
        } else {
            // Se não houver dados salvos, mostra valores padrão
            confProfessor.textContent = '-';
            confData.textContent = '-';
            confHorario.textContent = '-';
            confDuracao.textContent = '-';
            confNomeAluno.textContent = '-';
            confObservacoes.textContent = '-';
        }
    }

    // Carrega os dados ao carregar a página
    carregarDadosAgendamento();
});

