// Base de dados de professores
const professores = [
  {
    nome: "Prof. Ana Souza",
    materia: "Matemática",
    idade: "5-8 anos",
    preco: 80,
    link: "agendamento.html"
  },
  {
    nome: "Prof. João Lima",
    materia: "Português",
    idade: "5-8 anos",
    preco: 60,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Maria Santos",
    materia: "Programação",
    idade: "13-16 anos",
    preco: 100,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Carlos Silva",
    materia: "Matemática",
    idade: "13-16 anos",
    preco: 50,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Juliana Costa",
    materia: "Português",
    idade: "13-16 anos",
    preco: 70,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Pedro Alves",
    materia: "História",
    idade: "Acima de 16 anos",
    preco: 55,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Fernanda Lima",
    materia: "Ciências",
    idade: "5-8 anos",
    preco: 45,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Roberto Santos",
    materia: "Geografia",
    idade: "13-16 anos",
    preco: 65,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Beatriz Oliveira",
    materia: "Inglês",
    idade: "Acima de 16 anos",
    preco: 75,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Lucas Martins",
    materia: "Redação",
    idade: "13-16 anos",
    preco: 90,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Mariana Rocha",
    materia: "Matemática",
    idade: "13-16 anos",
    preco: 55,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Gabriel Ferreira",
    materia: "Física",
    idade: "Acima de 16 anos",
    preco: 85,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Rafael Junior",
    materia: "Matemática",
    idade: "5-8 anos",
    preco: 95,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Daniel Santos",
    materia: "Matemática",
    idade: "5-8 anos",
    preco: 105,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Rodrigo Muniz",
    materia: "Português",
    idade: "9-12 anos",
    preco: 120,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Gabriel Toledo",
    materia: "Português",
    idade: "9-12 anos",
    preco: 105,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Felipe Santana",
    materia: "Português",
    idade: "9-12 anos",
    preco: 90,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Rosângela Siqueira",
    materia: "História",
    idade: "9-12 anos",
    preco: 100,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Sofia Mendes",
    materia: "Matemática",
    idade: "todas as idades",
    preco: 90,
    link: "agendamento.html"
  },
  {
    nome: "Prof. André Pereira",
    materia: "Português",
    idade: "todas as idades",
    preco: 85,
    link: "agendamento.html"
  },
  {
    nome: "Prof. Camila Rodrigues",
    materia: "Inglês",
    idade: "todas as idades",
    preco: 95,
    link: "agendamento.html"
  },
];

// Função para obter parâmetros da URL
function obterParametrosURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    materia: params.get('materia'),
    idade: params.get('idade'),
    preco: params.get('preco'),
    busca: params.get('busca')
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
    // Se houver busca por texto, filtra por matéria (case-insensitive)
    if (filtros.busca) {
      const termoBusca = filtros.busca.toLowerCase();
      const materiaProfessor = professor.materia.toLowerCase();
      if (!materiaProfessor.includes(termoBusca)) {
        return false;
      }
    }
    
    // Filtro por matéria (se não houver busca)
    if (!filtros.busca && filtros.materia && professor.materia !== filtros.materia) {
      return false;
    }

    // Filtro por idade (ignorado se houver busca)
    if (!filtros.busca && filtros.idade) {
      // Se o filtro selecionado é "todas as idades", mostra APENAS professores com "todas as idades"
      if (filtros.idade === "todas as idades") {
        if (professor.idade !== "todas as idades") {
          return false;
        }
      }
      // Se o professor tem "todas as idades", ele aparece em qualquer filtro de idade específica
      else if (professor.idade === "todas as idades") {
        // Professor com "todas as idades" sempre passa no filtro de idade específica
      }
      // Caso contrário, compara idade exata
      else if (professor.idade !== filtros.idade) {
        return false;
      }
    }

    // Filtro por preço (ignorado se houver busca)
    if (!filtros.busca && filtros.preco && professor.preco > precoMaximo) {
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
      // Codifica o nome do professor para a URL
      const nomeProfessorEncoded = encodeURIComponent(professor.nome);
      const materiaEncoded = encodeURIComponent(professor.materia);
      card.innerHTML = `
        <h3 class="titulo-card">${professor.nome}</h3>
        <p class="info-card">${professor.materia} • Idade: ${professor.idade} • R$ ${professor.preco}/h</p>
        <a href="agendamento.html?professor=${nomeProfessorEncoded}&materia=${materiaEncoded}" class="botao botao-principal">Agendar aula</a>
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

