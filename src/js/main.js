const personagens = document.querySelectorAll('.character');
let auxSelecterCharacter = false;

// Trocar imagem e nome quando passar o mouse
personagens.forEach((personagem) => {
  personagem.addEventListener('mouseenter', () => {
    // Remove seleção antiga
    const personagemSelecionado = document.querySelector('.seleted');
    if (personagemSelecionado) {
      personagemSelecionado.classList.remove('seleted');
    }

    // Marca o novo
    personagem.classList.add('seleted');

    // Atualizar imagem grande
    const idSelecionado = personagem.getAttribute('id');
    const imagemJg1 = document.getElementById('selected__character');
    imagemJg1.src = `src/imagens/${idSelecionado}.png`;



    // Atualizar nome
    const nameJg1 = document.getElementById('nome-jogador-01');
    nameJg1.innerText = personagem.dataset.name;
  });

  // Confirmar personagem ao clicar
  personagem.addEventListener('click', () => {
    const personagemSelecionado = personagem.dataset.name;

    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('PlayerOne', personagemSelecionado);
    } else {
      alert('Infelizmente o seu navegador não suporta localStorage, tente outro!');
      return;
    }

    // Redirecionar para a página do jogo
    window.location.href = "src/pages/game.html";
  });
});
