// Selecionar todos os personagens
const personagens = document.querySelectorAll('.character');
var exportCharacterCont = 0;
let auxSelecterCharacter = false;

// Card de descrição
let sectionCard = document.querySelector('#card__description');
let card = document.querySelector('.card');

// Player 2 placeholder (será substituído na seleção)
let jogador02 = null;

// Vai percorrer todos os li de personagens
personagens.forEach((personagem) => {

    personagem.addEventListener('mouseenter', () => {
        if (!auxSelecterCharacter) {
            // Remove a seleção azul anterior e aplica no novo personagem
            const personagemSelecionado = document.querySelector('.selected');
            if (personagemSelecionado) personagemSelecionado.classList.remove('selected');
            personagem.classList.add('selected');
        } else {
            const personagemSelecionado = document.querySelector('.second-player_seleted');
            if (personagemSelecionado) personagemSelecionado.classList.remove('second-player_seleted');
            personagem.classList.add('second-player_seleted');
        }

        // Trocar imagem grande
        const idSelecionado = personagem.id;
        const imagemJg = document.getElementById('selected__character');
        imagemJg.src = `src/imagens/${idSelecionado}.png`;

        // Trocar nome embaixo
        const nomeSelecionado = document.getElementById('nome-jogador-01');
        nomeSelecionado.innerText = personagem.dataset.name;
    });

    // Clique para abrir card
    personagem.addEventListener('click', () => {
        let nameCaracterCard = document.querySelector('#title__name');
        let thumbnail = document.querySelector('#title_thumbanail');
        let description = document.querySelector('#box__descrition');

        thumbnail.src = 'src/imagens/preview-image.png';
        thumbnail.classList.add('card-img-y', 'rounded', 'color-change-2x');
        description.classList.add('text-center');
        description.innerHTML =
            `
        <span class="placeholder col-6"></span>
        <span class="placeholder col-8"></span>
        <span class="placeholder w-75"></span>
        <span class="placeholder" style="width: 25%;"></span>
        `;

        // Abrir card
        sectionCard.style.display = 'block';
        nameCaracterCard.innerHTML = personagem.dataset.name;
    });
});

// Bounce card animation
window.onmousedown = function (event) {
    if (event.target == sectionCard) {
        card.classList.add('bounce_card');
    }
};
window.onmouseup = function (event) {
    if (event.target == sectionCard) {
        card.classList.remove('bounce_card');
    }
};

// Sair do card
let btnCancel = document.querySelector('#canc');
if (btnCancel) {
    btnCancel.addEventListener('click', () => {
        sectionCard.style.display = 'none';
    });
}

let btnConf = document.querySelector('#conf');
if (btnConf) {
    btnConf.addEventListener('click', () => {
        sectionCard.style.display = 'none';

        // Seleciona o personagem confirmado
        const personagemSelecionado = document.querySelector('.selected');
        personagemSelecionado.childNodes[1].innerHTML = 'seletecplayer';

        auxSelecterCharacter = true;

        // Trocar tag 1P / 2P
        const tagPlayer = document.querySelectorAll('.character > .tag');
        tagPlayer.forEach((tag) => {
            tag.innerHTML === 'seletecplayer' ? tag.innerHTML = '1P' : tag.innerHTML = '2P';
        });

        // Trocar imagens grandes
        const imagemJg1 = document.getElementById('selected__character');
        if (imagemJg1) imagemJg1.removeAttribute('id');

        const imagemJg2 = document.querySelector('.big__character.player__number-2 > img');
        if (imagemJg2) imagemJg2.setAttribute('id', 'selected__character');

        // Trocar nome
        const nomeSelecionado = document.getElementById('nome-jogador-01');
        if (nomeSelecionado) nomeSelecionado.removeAttribute('id');

        const nameJg2 = document.querySelector('.big__character.player__number-2 > .name__character > h2');
        if (nameJg2) nameJg2.setAttribute('id', 'nome-jogador-01');

        exportCharacterCont++;

        if (exportCharacterCont === 2) {
            var seletedPlayerOne = document.querySelector('.selected');
            var seletedPlayerTwo = document.querySelector('.second-player_seleted');

            seletedPlayerOne = seletedPlayerOne.dataset.name;
            seletedPlayerTwo = seletedPlayerTwo.dataset.name;

            // Salvar no localStorage
            if (typeof (Storage) === 'function') {
                localStorage.setItem('PlayerOne', seletedPlayerOne);
                localStorage.setItem('PlayerTwo', seletedPlayerTwo);
            } else {
                alert('Infelizmente o seu navegador não suporta localStorage, por favor tente usar outro!');
            }

            // Redirecionar para a página do jogo
            window.location.href = "src/pages/game.html";
        }
    });
}
