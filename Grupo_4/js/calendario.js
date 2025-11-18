// Função para carregar eventos do localStorage
function carregarEventos() {
  const eventosCalendario = [];
  
  // Carregar eventos criados pelo botão +
  const eventosSalvos = localStorage.getItem('eventosCalendario');
  if (eventosSalvos) {
    eventosCalendario.push(...JSON.parse(eventosSalvos));
  }
  
  // Carregar eventos de agendamentos
  const agendamentoAtual = localStorage.getItem('agendamentoAtual');
  if (agendamentoAtual) {
    try {
      const agendamento = JSON.parse(agendamentoAtual);
      if (agendamento.data && agendamento.horario) {
        // Converter data do formato YYYY-MM-DD para dia, mês, ano
        const dataAgendamento = new Date(agendamento.data + 'T00:00:00');
        const dia = dataAgendamento.getDate();
        const mes = dataAgendamento.getMonth();
        const ano = dataAgendamento.getFullYear();
        
        // Criar evento de aula
        const eventoAula = {
          dia: dia,
          mes: mes,
          ano: ano,
          tipo: 'aula',
          titulo: agendamento.materia || 'Aula',
          horario: agendamento.horario,
          materia: agendamento.materia || '',
          professor: agendamento.professor || '',
          descricao: agendamento.observacoes || '',
          nomeAluno: agendamento.nomeAluno || '',
          duracao: agendamento.duracao || '',
          id: agendamento.id || null
        };
        
        eventosCalendario.push(eventoAula);
      }
    } catch (e) {
      console.error('Erro ao carregar agendamento:', e);
    }
  }
  
  // Carregar todos os agendamentos salvos (se houver múltiplos)
  const todosAgendamentos = localStorage.getItem('todosAgendamentos');
  if (todosAgendamentos) {
    try {
      const agendamentos = JSON.parse(todosAgendamentos);
      agendamentos.forEach(agendamento => {
        if (agendamento.data && agendamento.horario) {
          const dataAgendamento = new Date(agendamento.data + 'T00:00:00');
          const dia = dataAgendamento.getDate();
          const mes = dataAgendamento.getMonth();
          const ano = dataAgendamento.getFullYear();
          
          const eventoAula = {
            dia: dia,
            mes: mes,
            ano: ano,
            tipo: 'aula',
            titulo: agendamento.materia || 'Aula',
            horario: agendamento.horario,
            materia: agendamento.materia || '',
            professor: agendamento.professor || '',
            descricao: agendamento.observacoes || '',
            nomeAluno: agendamento.nomeAluno || '',
            duracao: agendamento.duracao || '',
            id: agendamento.id || null
          };
          
          eventosCalendario.push(eventoAula);
        }
      });
    } catch (e) {
      console.error('Erro ao carregar agendamentos:', e);
    }
  }
  
  return eventosCalendario;
}

// Função para salvar eventos no localStorage
function salvarEventos(eventos) {
  localStorage.setItem('eventosCalendario', JSON.stringify(eventos));
}

// Carregar eventos
let eventos = carregarEventos();

// Função para obter o primeiro dia da semana do mês
function obterPrimeiroDiaSemana(ano, mes) {
  return new Date(ano, mes, 1).getDay();
}

// Função para obter o número de dias no mês
function obterDiasNoMes(ano, mes) {
  return new Date(ano, mes + 1, 0).getDate();
}

// Função para obter nome do mês em português
function obterNomeMes(mes) {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return meses[mes];
}

// Função para obter eventos de um dia específico
function obterEventosDoDia(dia, mes, ano) {
  return eventos.filter(evento => 
    evento.dia === dia && 
    evento.mes === mes && 
    evento.ano === ano
  );
}

// Função para criar modal de evento
function criarModal(evento, dia, mes, ano) {
  const modalId = `modal-dia-${dia}-${mes}-${ano}`;
  const nomeMes = obterNomeMes(mes);
  
  let conteudoModal = '';
  
  if (evento.tipo === 'aula') {
    const podeRemarcar = evento.professor || evento.materia;
    conteudoModal = `
      <div class="cabecalho-modal">
        <h3 class="titulo-modal">${dia} de ${nomeMes} - ${evento.titulo}</h3>
        <a href="#" class="fechar-modal">×</a>
      </div>
      <div class="texto-modal">
        <p><strong>Horário:</strong> ${evento.horario || 'Não especificado'}</p>
        <p><strong>Tipo:</strong> Aula</p>
        ${evento.materia ? `<p><strong>Matéria:</strong> ${evento.materia}</p>` : ''}
        ${evento.professor ? `<p><strong>Professor:</strong> ${evento.professor}</p>` : ''}
        ${evento.nomeAluno ? `<p><strong>Aluno:</strong> ${evento.nomeAluno}</p>` : ''}
        ${evento.duracao ? `<p><strong>Duração:</strong> ${evento.duracao}</p>` : ''}
        ${evento.descricao ? `<p><strong>Descrição:</strong> ${evento.descricao}</p>` : ''}
      </div>
      ${podeRemarcar ? `
        <div class="acoes-modal">
          <button class="botao botao-principal botao-remarcar">Remarcar aula</button>
        </div>
      ` : ''}
    `;
  } else {
    conteudoModal = `
      <div class="cabecalho-modal">
        <h3 class="titulo-modal">${dia} de ${nomeMes} - ${evento.titulo}</h3>
        <a href="#" class="fechar-modal">×</a>
      </div>
      <div class="texto-modal">
        <p><strong>Prazo:</strong> ${evento.prazo || 'Não especificado'}</p>
        <p><strong>Tipo:</strong> Entrega</p>
        ${evento.atividade ? `<p><strong>Atividade:</strong> ${evento.atividade}</p>` : ''}
        ${evento.professor ? `<p><strong>Professor:</strong> ${evento.professor}</p>` : ''}
        ${evento.descricao ? `<p><strong>Descrição:</strong> ${evento.descricao}</p>` : ''}
      </div>
    `;
  }
  
  return `
    <div class="fundo-modal" id="${modalId}">
      <div class="modal">
        ${conteudoModal}
      </div>
    </div>
  `;
}

// Função para preparar reagendamento
function prepararReagendamento(evento, dia, mes, ano) {
  const dataISO = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  const dados = {
    id: evento.id || null,
    professor: evento.professor || '',
    materia: evento.materia || evento.titulo || '',
    data: dataISO,
    horario: evento.horario || '',
    duracao: evento.duracao || '',
    nomeAluno: evento.nomeAluno || '',
    observacoes: evento.descricao || ''
  };
  
  localStorage.setItem('agendamentoParaReagendar', JSON.stringify(dados));
  window.location.href = 'agendamento.html?reagendar=1';
}

// Variáveis globais para mês e ano atual
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();

// Função para gerar o calendário
function gerarCalendario() {
  const nomeMes = obterNomeMes(mesAtual);
  
  // Atualizar título
  const titulo = document.getElementById('titulo-calendario');
  if (titulo) {
    titulo.textContent = nomeMes;
  }
  
  // Atualizar ano
  const anoDisplay = document.getElementById('ano-atual');
  if (anoDisplay) {
    anoDisplay.textContent = anoAtual;
  }
  
  // Obter informações do mês
  const primeiroDia = obterPrimeiroDiaSemana(anoAtual, mesAtual);
  const diasNoMes = obterDiasNoMes(anoAtual, mesAtual);
  
  // Container do calendário
  const gradeCalendario = document.getElementById('grade-calendario');
  if (!gradeCalendario) return;
  
  gradeCalendario.innerHTML = '';
  
  // Adicionar dias vazios no início
  for (let i = 0; i < primeiroDia; i++) {
    const diaVazio = document.createElement('div');
    diaVazio.className = 'dia-calendario vazio';
    gradeCalendario.appendChild(diaVazio);
  }
  
  // Adicionar dias do mês
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const diaElement = document.createElement('div');
    diaElement.className = 'dia-calendario';
    diaElement.setAttribute('data-dia', dia);
    
    const numeroDia = document.createElement('div');
    numeroDia.className = 'numero-dia';
    numeroDia.textContent = dia;
    diaElement.appendChild(numeroDia);
    
    // Verificar se há eventos neste dia
    const eventosDoDia = obterEventosDoDia(dia, mesAtual, anoAtual);
    
    if (eventosDoDia.length > 0) {
      // Adicionar classe para indicar que tem evento
      diaElement.classList.add('com-evento');
      
      // Adicionar ponto indicador de evento
      const pontoEvento = document.createElement('div');
      const primeiroEvento = eventosDoDia[0];
      pontoEvento.className = primeiroEvento.tipo === 'aula' 
        ? 'ponto-evento ponto-azul' 
        : 'ponto-evento ponto-amarelo';
      diaElement.appendChild(pontoEvento);
      
      // Adicionar evento de clique
      diaElement.addEventListener('click', function() {
        abrirModal(eventosDoDia[0], dia, mesAtual, anoAtual);
      });
    }
    
    gradeCalendario.appendChild(diaElement);
  }
  
  // Adicionar dias vazios no final para completar a grade
  const totalCelulas = primeiroDia + diasNoMes;
  const celulasRestantes = 42 - totalCelulas; // 6 semanas × 7 dias = 42
    
  for (let i = 0; i < celulasRestantes; i++) {
    const diaVazio = document.createElement('div');
    diaVazio.className = 'dia-calendario vazio';
    gradeCalendario.appendChild(diaVazio);
  }
}

// Função para abrir modal
function abrirModal(evento, dia, mes, ano) {
  // Remover modal existente se houver
  const modalId = `modal-dia-${dia}-${mes}-${ano}`;
  const modalExistente = document.getElementById(modalId);
  if (modalExistente) {
    modalExistente.remove();
  }
  
  // Criar novo modal
  const modalHTML = criarModal(evento, dia, mes, ano);
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Abrir modal
  const modal = document.getElementById(modalId);
  if (modal) {
    // Usar setTimeout para garantir que o DOM foi atualizado
    setTimeout(function() {
      modal.style.display = 'block';
      
      // Fechar ao clicar no X
      const fecharBtn = modal.querySelector('.fechar-modal');
      if (fecharBtn) {
        fecharBtn.addEventListener('click', function(e) {
          e.preventDefault();
          modal.style.display = 'none';
          setTimeout(function() {
            modal.remove();
          }, 300);
        });
      }
      
      // Fechar ao clicar fora do modal
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.style.display = 'none';
          setTimeout(function() {
            modal.remove();
          }, 300);
        }
      });

      // Reagendar aula diretamente
      const botaoRemarcar = modal.querySelector('.botao-remarcar');
      if (botaoRemarcar) {
        botaoRemarcar.addEventListener('click', function(e) {
          e.preventDefault();
          prepararReagendamento(evento, dia, mes, ano);
        });
      }
    }, 10);
  }
}

// Função para validar campos do formulário de evento
function validarFormularioEvento() {
  const dia = document.getElementById('input-dia').value;
  const mes = document.getElementById('select-mes').value;
  const ano = document.getElementById('input-ano').value;
  const titulo = document.getElementById('input-titulo').value.trim();
  const tipo = document.getElementById('select-tipo').value;
  
  return dia && mes !== '' && ano && titulo && tipo;
}

// Função para atualizar estado do botão confirmar
function atualizarEstadoBotaoConfirmar() {
  const botaoConfirmar = document.getElementById('botao-confirmar-evento');
  if (!botaoConfirmar) return;
  
  if (validarFormularioEvento()) {
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

// Função para criar novo evento
function criarNovoEvento() {
  const dia = parseInt(document.getElementById('input-dia').value);
  const mes = parseInt(document.getElementById('select-mes').value);
  const ano = parseInt(document.getElementById('input-ano').value);
  const titulo = document.getElementById('input-titulo').value.trim();
  const descricao = document.getElementById('input-descricao').value.trim();
  const tipo = document.getElementById('select-tipo').value;
  
  // Validar data
  const data = new Date(ano, mes, dia);
  if (data.getDate() !== dia || data.getMonth() !== mes || data.getFullYear() !== ano) {
    alert('Data inválida!');
    return;
  }
  
  // Criar objeto do evento
  const novoEvento = {
    dia: dia,
    mes: mes,
    ano: ano,
    tipo: tipo,
    titulo: titulo,
    descricao: descricao
  };
  
  // Adicionar campos específicos por tipo
  if (tipo === 'aula') {
    novoEvento.horario = 'Não especificado';
    novoEvento.materia = titulo;
  } else {
    novoEvento.prazo = '23:59';
    novoEvento.atividade = titulo;
  }
  
  // Adicionar evento à lista
  eventos.push(novoEvento);
  
  // Salvar no localStorage
  salvarEventos(eventos);
  
  // Fechar modal
  const modal = document.getElementById('modal-criar-evento');
  if (modal) {
    modal.style.display = 'none';
  }
  
  // Limpar formulário
  document.getElementById('form-criar-evento').reset();
  atualizarEstadoBotaoConfirmar();
  
  // Regenerar calendário
  gerarCalendario();
}

// Funções de navegação
function mesAnterior() {
  mesAtual--;
  if (mesAtual < 0) {
    mesAtual = 11;
    anoAtual--;
  }
  // Recarregar eventos para o novo mês
  eventos = carregarEventos();
  gerarCalendario();
}

function mesProximo() {
  mesAtual++;
  if (mesAtual > 11) {
    mesAtual = 0;
    anoAtual++;
  }
  // Recarregar eventos para o novo mês
  eventos = carregarEventos();
  gerarCalendario();
}

function anoAnterior() {
  anoAtual--;
  // Recarregar eventos para o novo ano
  eventos = carregarEventos();
  gerarCalendario();
}

function anoProximo() {
  anoAtual++;
  // Recarregar eventos para o novo ano
  eventos = carregarEventos();
  gerarCalendario();
}

// Executar quando a página carregar
window.addEventListener('DOMContentLoaded', function() {
  gerarCalendario();
  
  // Botões de navegação
  const botaoMesAnterior = document.getElementById('botao-mes-anterior');
  const botaoMesProximo = document.getElementById('botao-mes-proximo');
  const botaoAnoAnterior = document.getElementById('botao-ano-anterior');
  const botaoAnoProximo = document.getElementById('botao-ano-proximo');
  
  if (botaoMesAnterior) {
    botaoMesAnterior.addEventListener('click', mesAnterior);
  }
  
  if (botaoMesProximo) {
    botaoMesProximo.addEventListener('click', mesProximo);
  }
  
  if (botaoAnoAnterior) {
    botaoAnoAnterior.addEventListener('click', anoAnterior);
  }
  
  if (botaoAnoProximo) {
    botaoAnoProximo.addEventListener('click', anoProximo);
  }
  
  // Botão criar evento
  const botaoCriarEvento = document.getElementById('botao-criar-evento');
  const modalCriarEvento = document.getElementById('modal-criar-evento');
  const fecharModalCriar = document.getElementById('fechar-modal-criar');
  const cancelarCriarEvento = document.getElementById('cancelar-criar-evento');
  const botaoConfirmarEvento = document.getElementById('botao-confirmar-evento');
  
  // Abrir modal ao clicar no botão +
  if (botaoCriarEvento && modalCriarEvento) {
    botaoCriarEvento.addEventListener('click', function() {
      modalCriarEvento.style.display = 'block';
      atualizarEstadoBotaoConfirmar();
    });
  }
  
  // Fechar modal ao clicar no X
  if (fecharModalCriar && modalCriarEvento) {
    fecharModalCriar.addEventListener('click', function(e) {
      e.preventDefault();
      modalCriarEvento.style.display = 'none';
    });
  }
  
  // Fechar modal ao clicar em cancelar
  if (cancelarCriarEvento && modalCriarEvento) {
    cancelarCriarEvento.addEventListener('click', function(e) {
      e.preventDefault();
      modalCriarEvento.style.display = 'none';
    });
  }
  
  // Fechar modal ao clicar fora
  if (modalCriarEvento) {
    modalCriarEvento.addEventListener('click', function(e) {
      if (e.target === modalCriarEvento) {
        modalCriarEvento.style.display = 'none';
      }
    });
  }
  
  // Validar formulário em tempo real
  const camposFormulario = ['input-dia', 'select-mes', 'input-ano', 'input-titulo', 'select-tipo'];
  camposFormulario.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('input', atualizarEstadoBotaoConfirmar);
      campo.addEventListener('change', atualizarEstadoBotaoConfirmar);
    }
  });
  
  // Confirmar criação de evento
  if (botaoConfirmarEvento) {
    botaoConfirmarEvento.addEventListener('click', function(e) {
      e.preventDefault();
      if (validarFormularioEvento()) {
        criarNovoEvento();
      }
    });
  }
});

