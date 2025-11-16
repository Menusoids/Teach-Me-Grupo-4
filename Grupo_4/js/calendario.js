// Função para carregar eventos do localStorage
function carregarEventos() {
  const eventosSalvos = localStorage.getItem('eventosCalendario');
  if (eventosSalvos) {
    return JSON.parse(eventosSalvos);
  }
  // Eventos padrão iniciais
  return [
    {
      dia: 26,
      mes: new Date().getMonth(),
      ano: new Date().getFullYear(),
      tipo: 'aula',
      titulo: 'Matemática',
      horario: '14:00',
      professor: 'Prof. Maria',
      materia: 'Matemática',
      descricao: ''
    },
    {
      dia: 27,
      mes: new Date().getMonth(),
      ano: new Date().getFullYear(),
      tipo: 'entrega',
      titulo: 'Redação',
      prazo: '23:59',
      atividade: 'Redação',
      professor: 'Prof. João',
      descricao: ''
    },
    {
      dia: 28,
      mes: new Date().getMonth(),
      ano: new Date().getFullYear(),
      tipo: 'aula',
      titulo: 'Física',
      horario: '10:00',
      professor: 'Prof. João',
      materia: 'Física',
      descricao: ''
    },
    {
      dia: 29,
      mes: new Date().getMonth(),
      ano: new Date().getFullYear(),
      tipo: 'entrega',
      titulo: 'Lista de exercícios',
      prazo: '23:59',
      atividade: 'Lista de exercícios',
      professor: 'Prof. Maria',
      descricao: ''
    },
    {
      dia: 30,
      mes: new Date().getMonth(),
      ano: new Date().getFullYear(),
      tipo: 'aula',
      titulo: 'Programação',
      horario: '16:00',
      professor: 'Prof. Maria',
      materia: 'Programação',
      descricao: ''
    }
  ];
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
        ${evento.descricao ? `<p><strong>Descrição:</strong> ${evento.descricao}</p>` : ''}
      </div>
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

// Função para gerar o calendário
function gerarCalendario() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = agora.getMonth();
  const nomeMes = obterNomeMes(mes);
  
  // Atualizar título
  const titulo = document.querySelector('.titulo-secao');
  if (titulo) {
    titulo.textContent = `Calendário - ${nomeMes} ${ano}`;
  }
  
  // Obter informações do mês
  const primeiroDia = obterPrimeiroDiaSemana(ano, mes);
  const diasNoMes = obterDiasNoMes(ano, mes);
  
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
    const eventosDoDia = obterEventosDoDia(dia, mes, ano);
    
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
        abrirModal(eventosDoDia[0], dia, mes, ano);
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

// Executar quando a página carregar
window.addEventListener('DOMContentLoaded', function() {
  gerarCalendario();
  
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

