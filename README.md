# Shadow Scroll Runner

Shadow Scroll Runner é um MVP de jogo 2D estilo endless runner com elementos de quiz, pensado para celular e futura publicação Android.

O tema é inspirado em anime ninja de forma original. O projeto não usa Naruto, personagens, vilas, nomes, símbolos, músicas ou técnicas protegidas por direitos autorais.

## O que foi migrado

Este repositório antes tinha uma base de site/sistema chamada TechStore/SETI. A migração iniciou a troca para um jogo mobile:

- `package.json`: renomeado para Shadow Scroll Runner e simplificado.
- `server.js`: backend antigo substituído por servidor estático Express.
- `public/styles.css`: substituído por estilos de jogo mobile.
- `public/script.js`: substituído pela lógica jogável do MVP.
- `public/data/questions.js`: criado com perguntas iniciais do quiz.
- `src/GameManager.js`: criado como módulo inicial para futura organização do código.
- `docs/MIGRATION.md`: criado com resumo da migração.

## Mecânicas atuais

- Personagem corre automaticamente.
- Jogador pode pular ou abaixar.
- Obstáculos aparecem de forma progressiva.
- Pergaminhos e cristais podem ser coletados.
- Pontuação aumenta com o tempo.
- Quiz aparece durante a corrida.
- Acertos dão bônus como escudo, energia ou pergaminhos.
- Erros aumentam levemente a dificuldade.
- Existe tela inicial, pausa e fim de partida.

## Como rodar

```bash
npm install
npm start
```

Depois abra:

```text
http://localhost:3000
```

## Controles

- Espaço: pular.
- Seta para baixo: abaixar.
- Botões na tela: controle mobile.
- Escape: pausar ou continuar.

## Estrutura sugerida para evolução

```text
public/
  index.html
  styles.css
  script.js
  data/questions.js
src/
  GameManager.js
docs/
  MIGRATION.md
```

## Próximos passos

1. Separar o jogo em módulos reais: PlayerController, ObstacleSpawner, CoinSystem, ScoreSystem, QuizSystem, DifficultyManager e UIManager.
2. Criar artes originais para personagem, cenários, obstáculos, pergaminhos e cristais.
3. Adicionar sons próprios ou livres de direitos autorais.
4. Criar sistema de fases, skins e progresso salvo.
5. Testar em celulares Android.
6. Empacotar com Capacitor, Cordova ou transformar em projeto Godot/Unity no futuro.

## Futuro Android e Play Store

Para publicar futuramente na Play Store, será necessário:

- criar ícone e splash screen originais;
- gerar APK/AAB;
- testar em dispositivos reais;
- criar política de privacidade se houver anúncios, analytics ou coleta de dados;
- evitar qualquer conteúdo protegido por direitos autorais;
- seguir as regras atuais do Google Play Console.
