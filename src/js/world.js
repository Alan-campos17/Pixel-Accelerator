const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Carrega o personagem e o mapa
const playerImg = new Image();
playerImg.src = '../imagens/Attack/knight.png';

const mapImg = new Image();
mapImg.src = '../imagens/mapas/mapa1.png';

// Posição inicial
let player = { x: 100, y: 300, size: 64 };

// Funções de movimento
function mover(direcao) {
  const passo = 50;
  switch (direcao) {
    case 'direita':
      player.x += passo;
      break;
    case 'esquerda':
      player.x -= passo;
      break;
    case 'cima':
      player.y -= passo;
      break;
    case 'baixo':
      player.y += passo;
      break;
    default:
      alert("Comando inválido! Use 'direita', 'esquerda', 'cima' ou 'baixo'.");
  }
  desenhar();
}

// Função para redesenhar o mapa e o personagem
function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(mapImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);
}

// Executar código
document.getElementById('runButton').addEventListener('click', () => {
  const code = document.getElementById('codeInput').value;
  try {
    eval(code);
    document.getElementById('feedback').textContent = '✅ Código executado com sucesso!';
  } catch (error) {
    document.getElementById('feedback').textContent = '❌ Erro: ' + error.message;
  }
});

mapImg.onload = desenhar;
