// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Obtém parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const nomeProfessorURL = urlParams.get('professor');
    const materiaURL = urlParams.get('materia');
    
    // Elementos do formulário
    const inputData = document.getElementById('input-data');
    const selectDuracao = document.getElementById('select-duracao');
    const inputNomeAluno = document.getElementById('input-nome-aluno');
    const inputObservacoes = document.getElementById('input-observacoes');
    const botaoConfirmar = document.getElementById('botao-confirmar');
    const mensagemErro = document.getElementById('mensagem-erro');
    const modalProfessor = document.getElementById('modal-professor');
    const modalData = document.getElementById('modal-data');
    const modalHorario = document.getElementById('modal-horario');
    const modalDuracao = document.getElementById('modal-duracao');
    const fundoModal = document.getElementById('confirmar');
    const fecharModal = document.querySelector('.fechar-modal');
    const botaoCancelar = document.querySelector('.acoes-modal .botao-secundario');
    
    // Elementos da página para atualizar com dados do professor
    const nomeProfessorElement = document.getElementById('nome-professor');
    const descricaoProfessorElement = document.getElementById('descricao-professor');
    const fotoProfessorElement = document.getElementById('foto-professor');
    
    // Horários disponíveis
    const horariosDisponiveis = document.querySelectorAll('.horario-disponivel');
    
    // Determina o nome do professor (da URL ou padrão)
    const nomeProfessor = nomeProfessorURL ? decodeURIComponent(nomeProfessorURL) : 'Ana Souza';
    const materiaProfessor = materiaURL ? decodeURIComponent(materiaURL) : 'Matemática';
    
    // Função para detectar gênero do nome (nomes comuns brasileiros)
    function detectarGenero(nome) {
        // Remove "Prof." ou "Prof" do início do nome
        const nomeLimpo = nome.replace(/^Prof\.?\s*/i, '').trim();
        
        // Extrai o primeiro nome
        const primeiroNome = nomeLimpo.split(' ')[0].toLowerCase();
        
        // Lista de nomes femininos comuns
        const nomesFemininos = [
            'ana', 'maria', 'juliana', 'fernanda', 'beatriz', 'mariana', 'sofia', 'camila',
            'carolina', 'patricia', 'cristina', 'elena', 'isabela', 'lucia', 'paula', 'renata',
            'vanessa', 'adriana', 'alessandra', 'amanda', 'bianca', 'bruna', 'carla', 'claudia',
            'daniela', 'debora', 'eliane', 'fabiana', 'gabriela', 'helena', 'ingrid', 'jessica',
            'karen', 'larissa', 'leticia', 'luciana', 'marcela', 'natalia', 'olivia', 'priscila',
            'raquel', 'rosangela', 'rosângela', 'sandra', 'tatiana', 'thais', 'valeria', 'vivian'
        ];
        
        // Se o primeiro nome está na lista de nomes femininos, retorna 'feminino'
        if (nomesFemininos.includes(primeiroNome)) {
            return 'feminino';
        }
        
        // Caso contrário, assume masculino
        return 'masculino';
    }
    
    // Função para gerar descrição do professor
    function gerarDescricao(nome, materia) {
        const nomeLimpo = nome.replace(/^Prof\.?\s*/i, '').trim();
        const genero = detectarGenero(nome);
        const formacao = genero === 'feminino' ? 'formada' : 'formado';
        const apaixonada = genero === 'feminino' ? 'apaixonada' : 'apaixonado';
        
        return `Sou ${nomeLimpo}, ${formacao} em ${materia} pela Universidade de São Paulo (USP) e ${apaixonada} por ensinar. Há mais de 5 anos, ajudo alunos a entenderem ${materia.toLowerCase()} de forma leve e prática, transformando dificuldades em curiosidade e confiança. Gosto de adaptar minhas aulas ao ritmo de cada estudante e mostrar como o conhecimento está presente em tudo ao nosso redor.`;
    }
    
    // Atualiza a página com informações do professor
    if (nomeProfessorElement) {
        nomeProfessorElement.textContent = `Professor(a): ${nomeProfessor} – ${materiaProfessor}`;
    }
    
    // Atualiza a descrição do professor
    if (descricaoProfessorElement) {
        descricaoProfessorElement.textContent = gerarDescricao(nomeProfessor, materiaProfessor);
    }
    
    // Atualiza a foto do professor baseado no gênero
    if (fotoProfessorElement) {
        const genero = detectarGenero(nomeProfessor);
        const foto = genero === 'feminino' ? 'img/mulher.png' : 'img/homem.png';
        fotoProfessorElement.src = foto;
        fotoProfessorElement.alt = `Foto de ${nomeProfessor}`;
    }
    
    // Variáveis para armazenar dados do agendamento
    let dadosAgendamento = {
        professor: nomeProfessor,
        materia: materiaProfessor,
        data: '',
        horario: '',
        duracao: '',
        nomeAluno: '',
        observacoes: ''
    };

    // Função para formatar data
    function formatarData(data) {
        if (!data) return '';
        const date = new Date(data + 'T00:00:00');
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    // Função para validar campos obrigatórios
    function validarCampos() {
        const nomeAlunoValido = inputNomeAluno.value.trim() !== '';
        return nomeAlunoValido;
    }

    // Função para atualizar estado do botão
    function atualizarEstadoBotao() {
        if (validarCampos()) {
            botaoConfirmar.classList.remove('botao-desabilitado');
            botaoConfirmar.disabled = false;
            botaoConfirmar.style.pointerEvents = 'auto';
            botaoConfirmar.style.cursor = 'pointer';
        } else {
            botaoConfirmar.classList.add('botao-desabilitado');
            botaoConfirmar.disabled = true;
            botaoConfirmar.style.pointerEvents = 'none';
            botaoConfirmar.style.cursor = 'not-allowed';
        }
    }

    // Função para ocultar mensagem de erro
    function ocultarMensagemErro() {
        mensagemErro.style.display = 'none';
        mensagemErro.textContent = '';
    }

    // Função para mostrar mensagem de erro
    function mostrarMensagemErro(mensagem) {
        mensagemErro.textContent = mensagem;
        mensagemErro.style.display = 'block';
    }

    // Event listener para quando um horário é clicado
    horariosDisponiveis.forEach(horario => {
        horario.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtém o horário selecionado
            const horarioSelecionado = this.getAttribute('data-horario');
            
            // Obtém data e duração do formulário
            const dataSelecionada = inputData.value;
            const duracaoSelecionada = selectDuracao.value;
            
            // Valida se data e duração foram preenchidos
            if (!dataSelecionada || !duracaoSelecionada) {
                mostrarMensagemErro('Por favor, preencha a data e a duração antes de selecionar um horário.');
                return;
            }
            
            // Atualiza dados do agendamento
            dadosAgendamento.data = dataSelecionada;
            dadosAgendamento.horario = horarioSelecionado;
            dadosAgendamento.duracao = duracaoSelecionada;
            
            // Atualiza o modal com as informações
            modalProfessor.textContent = dadosAgendamento.professor;
            modalData.textContent = formatarData(dataSelecionada);
            modalHorario.textContent = horarioSelecionado;
            modalDuracao.textContent = duracaoSelecionada;
            
            // Limpa campos do modal
            inputNomeAluno.value = '';
            inputObservacoes.value = '';
            
            // Desabilita o botão inicialmente
            atualizarEstadoBotao();
            
            // Ocultar mensagem de erro
            ocultarMensagemErro();
            
            // Abre o modal
            window.location.hash = 'confirmar';
        });
    });

    // Event listeners para validação em tempo real dos campos do modal
    inputNomeAluno.addEventListener('input', function() {
        atualizarEstadoBotao();
        ocultarMensagemErro();
    });

    inputObservacoes.addEventListener('input', function() {
        ocultarMensagemErro();
    });

    // Event listener para o botão de confirmar agendamento
    botaoConfirmar.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Valida campos obrigatórios
        if (!validarCampos()) {
            mostrarMensagemErro('Complete todas as respostas para agendar a aula');
            return;
        }
        
        // Atualiza dados do agendamento com informações do modal
        dadosAgendamento.nomeAluno = inputNomeAluno.value.trim();
        dadosAgendamento.observacoes = inputObservacoes.value.trim();
        
        // Salva no localStorage
        localStorage.setItem('agendamentoAtual', JSON.stringify(dadosAgendamento));
        
        // Redireciona para a página de confirmação
        window.location.href = 'confirmacao.html';
    });

    // Event listener para fechar modal
    fecharModal.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.hash = '';
        ocultarMensagemErro();
    });

    // Event listener para botão cancelar
    botaoCancelar.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.hash = '';
        ocultarMensagemErro();
    });

    // Fechar modal ao clicar fora dele
    fundoModal.addEventListener('click', function(e) {
        if (e.target === fundoModal) {
            window.location.hash = '';
            ocultarMensagemErro();
        }
    });

    // Inicializa o botão como desabilitado
    atualizarEstadoBotao();
});

