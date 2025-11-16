// Base de dados de professores
const professores = [
  {
    nome: "Prof. Ana Souza",
    materia: "Matemática",
    idade: "9-10",
    preco: 80,
    link: "agendamento.html"
  },
  {
    nome: "Prof. João Lima",
    materia: "Português",
    idade: "7-8",
    preco: 60,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Maria Santos",
    materia: "Programação",
    idade: "11-12",
    preco: 100,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Carlos Silva",
    materia: "Matemática",
    idade: "11-12",
    preco: 50,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Juliana Costa",
    materia: "Português",
    idade: "9-10",
    preco: 70,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Pedro Alves",
    materia: "História",
    idade: "13-14",
    preco: 55,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Fernanda Lima",
    materia: "Ciências",
    idade: "5-6",
    preco: 45,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Roberto Santos",
    materia: "Geografia",
    idade: "11-12",
    preco: 65,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Beatriz Oliveira",
    materia: "Inglês",
    idade: "7-8",
    preco: 75,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Lucas Martins",
    materia: "Redação",
    idade: "13-14",
    preco: 90,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Mariana Rocha",
    materia: "Matemática",
    idade: "7-8",
    preco: 55,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Gabriel Ferreira",
    materia: "Física",
    idade: "13-14",
    preco: 85,
    link: "agendamento.html"
  }
];

// Função para obter parâmetros da URL
function obterParametrosURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    materia: params.get('materia'),
    idade: params.get('idade'),
    preco: params.get('preco')
  };
}

// Função para converter preço máximo em número
function converterPrecoMaximo(precoTexto) {
  if (!precoTexto) return Infinity;
  const match = precoTexto.match(/R\$ (\d+)/);
  return match ? parseInt(match[1]) : Infinity;
}

// Função para filtrar professores
function filtrarProfessores() {
  const filtros = obterParametrosURL();
  const precoMaximo = converterPrecoMaximo(filtros.preco);

  const professoresFiltrados = professores.filter(professor => {
    // Filtro por matéria
    if (filtros.materia && professor.materia !== filtros.materia) {
      return false;
    }

    // Filtro por idade
    if (filtros.idade && professor.idade !== filtros.idade) {
      return false;
    }

    // Filtro por preço
    if (filtros.preco && professor.preco > precoMaximo) {
      return false;
    }

    return true;
  });

  return professoresFiltrados;
}

// Função para renderizar professores
function renderizarProfessores(professoresFiltrados) {
  const container = document.getElementById('container-professores');
  
  if (!container) return;

  container.innerHTML = '';

  if (professoresFiltrados.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; width: 100%;">
        <p style="font-size: 16px; color: var(--azul-medio); margin-bottom: 20px;">
          Nenhum professor encontrado com os filtros selecionados.
        </p>
        <a href="filtros.html" class="botao botao-principal">Tentar outros filtros</a>
      </div>
    `;
  } else {
    professoresFiltrados.forEach(professor => {
      const card = document.createElement('article');
      card.className = 'card-professor';
      card.innerHTML = `
        <h3 class="titulo-card">${professor.nome}</h3>
        <p class="info-card">${professor.materia} • Idade: ${professor.idade} • R$ ${professor.preco}/h</p>
        <a href="${professor.link}" class="botao botao-principal">Agendar aula</a>
      `;
      container.appendChild(card);
    });
  }
}

// Executar quando a página carregar
window.addEventListener('DOMContentLoaded', function() {
  const professoresFiltrados = filtrarProfessores();
  renderizarProfessores(professoresFiltrados);
});

