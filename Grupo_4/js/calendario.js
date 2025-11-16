// Base de dados de eventos (aulas e entregas)
const eventos = [
  {
    dia: 26,
    tipo: 'aula',
    titulo: 'Matemática',
    horario: '14:00',
    professor: 'Prof. Maria',
    materia: 'Matemática'
  },
  {
    dia: 27,
    tipo: 'entrega',
    titulo: 'Redação',
    prazo: '23:59',
    atividade: 'Redação',
    professor: 'Prof. João'
  },
  {
    dia: 28,
    tipo: 'aula',
    titulo: 'Física',
    horario: '10:00',
    professor: 'Prof. João',
    materia: 'Física'
  },
  {
    dia: 29,
    tipo: 'entrega',
    titulo: 'Lista de exercícios',
    prazo: '23:59',
    atividade: 'Lista de exercícios',
    professor: 'Prof. Maria'
  },
  {
    dia: 30,
    tipo: 'aula',
    titulo: 'Programação',
    horario: '16:00',
    professor: 'Prof. Maria',
    materia: 'Programação'
  }
];

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
function obterEventosDoDia(dia) {
  return eventos.filter(evento => evento.dia === dia);
}

// Função para criar modal de evento
function criarModal(evento, dia, mes, ano) {
  const modalId = `modal-dia-${dia}`;
  const nomeMes = obterNomeMes(mes);
  
  let conteudoModal = '';
  
  if (evento.tipo === 'aula') {
    conteudoModal = `
      <div class="cabecalho-modal">
        <h3 class="titulo-modal">${dia} de ${nomeMes} - ${evento.titulo}</h3>
        <a href="#" class="fechar-modal">×</a>
      </div>
      <div class="texto-modal">
        <p><strong>Horário:</strong> ${evento.horario}</p>
        <p><strong>Tipo:</strong> Aula</p>
        <p><strong>Matéria:</strong> ${evento.materia}</p>
        <p><strong>Professor:</strong> ${evento.professor}</p>
      </div>
    `;
  } else {
    conteudoModal = `
      <div class="cabecalho-modal">
        <h3 class="titulo-modal">${dia} de ${nomeMes} - ${evento.titulo}</h3>
        <a href="#" class="fechar-modal">×</a>
      </div>
      <div class="texto-modal">
        <p><strong>Prazo:</strong> ${evento.prazo}</p>
        <p><strong>Tipo:</strong> Entrega</p>
        <p><strong>Atividade:</strong> ${evento.atividade}</p>
        <p><strong>Professor:</strong> ${evento.professor}</p>
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
    const eventosDoDia = obterEventosDoDia(dia);
    
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
  const modalExistente = document.getElementById('modal-dia-' + dia);
  if (modalExistente) {
    modalExistente.remove();
  }
  
  // Criar novo modal
  const modalHTML = criarModal(evento, dia, mes, ano);
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Abrir modal
  const modal = document.getElementById('modal-dia-' + dia);
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

// Executar quando a página carregar
window.addEventListener('DOMContentLoaded', function() {
  gerarCalendario();
});

