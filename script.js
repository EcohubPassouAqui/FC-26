"use strict";
const BUTTON_MAP = {
    xbox: { A: "A", B: "B", X: "X", Y: "Y", LB: "LB", RB: "RB", LT: "LT", RT: "RT", LS: "LS", RS: "RS" },
    ps5: { A: "cross", B: "circle", X: "square", Y: "triangle", LB: "L1", RB: "R1", LT: "L2", RT: "R2", LS: "L3", RS: "R3" }
};
const STICK_LABEL = {
    xbox: { L: "LS", R: "RS" },
    ps5: { L: "L3", R: "R3" }
};
const FACE_BUTTONS = ["A", "B", "X", "Y", "cross", "circle", "square", "triangle"];
const BUTTON_SHAPES = {
    cross: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7l10 10M17 7L7 17"></path></svg>',
    circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"></circle></svg>',
    square: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="1.5"></rect></svg>',
    triangle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5l8 14H4z"></path></svg>'
};
const LETTER_BUTTONS = ["A", "B", "X", "Y"];
const CONTROLLER_LABELS = {
    xbox: "Xbox One",
    ps5: "PS5"
};
const CONTROLLER_IMAGES = {
    xbox: "xboxone.png",
    ps5: "ps5.png"
};
function arrowGlyph(rotateDeg) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><g transform="rotate(' + rotateDeg + ' 12 12)"><circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"></circle><path d="M12 9.6V3.4M8.8 6.4L12 3.2l3.2 3.2"></path></g></svg>';
}
function rotateGlyph(direction) {
    const path = direction === "cw"
        ? "M6.2 7.4A7.6 7.6 0 1 1 5 13.2"
        : "M17.8 7.4A7.6 7.6 0 1 0 19 13.2";
    const head = direction === "cw"
        ? '<path d="M5.6 4v3.6h3.6"></path>'
        : '<path d="M18.4 4v3.6h-3.6"></path>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="' + path + '"></path>' + head + '</svg>';
}
function clickGlyph() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="7.4"></circle><circle cx="12" cy="12" r="2.3" fill="currentColor" stroke="none"></circle></svg>';
}
function anyGlyph() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><circle cx="12" cy="12" r="1.9" fill="currentColor" stroke="none"></circle><path d="M12 4.6v4.2M12 15.2v4.2M4.6 12h4.2M15.2 12h4.2M7.2 7.2l3 3M16.8 7.2l-3 3M7.2 16.8l3-3M16.8 16.8l-3-3"></path></svg>';
}
const STICK_GLYPHS = {
    up: arrowGlyph(0),
    upright: arrowGlyph(45),
    right: arrowGlyph(90),
    downright: arrowGlyph(135),
    down: arrowGlyph(180),
    downleft: arrowGlyph(225),
    left: arrowGlyph(270),
    upleft: arrowGlyph(315),
    cw: rotateGlyph("cw"),
    ccw: rotateGlyph("ccw"),
    click: clickGlyph(),
    any: anyGlyph()
};
function stick(side, action, opts) {
    const o = opts || {};
    return { kind: "stick", side: side, action: action, count: o.count || 1, hold: !!o.hold };
}
const DATA = {
    chutes: {
        accent: "#ff7a3d",
        art: "chutes",
        items: [
            { nome: "Chute Normal", icon: "circle", desc: "Toque simples para finalizar a jogada. A base de qualquer chute, cabeceio ou voleio.", combo: ["B"], stars: 1 },
            { nome: "Chute de Bico Baixo", icon: "arrow-down-to-line", desc: "Toque o chute duas vezes seguidas após carregar a força. Sai rasteiro e colocado, um dos finais mais letais do jogo.", combo: ["B", "B"], stars: 3 },
            { nome: "Cavadinha (Chip Shot)", icon: "arrow-big-up", desc: "Segure LB e chute para levantar a bola por cima do goleiro adiantado.", combo: ["LB", "+", "B"], stars: 2 },
            { nome: "Chute Colocado (Finesse)", icon: "crosshair", desc: "Segure RB e aperte o chute para colocar a bola no canto com curva. Ideal em ângulo fechado.", combo: ["RB", "+", "B"], stars: 2 },
            { nome: "Chute Colocado Rasteiro", icon: "arrow-down-to-line", desc: "Segure RB e toque o chute duas vezes para um colocado baixo, rápido e difícil de defender.", combo: ["RB", "+", "B", "B"], stars: 4 },
            { nome: "Chute de Potência (Power Shot)", icon: "flame", desc: "Segure LB e RB junto com o chute para uma finalização muito mais forte, porém menos precisa.", combo: ["LB", "+", "RB", "+", "B"], stars: 4 },
            { nome: "Chute de Potência Rasteiro", icon: "flame", desc: "Segure LB, RB e toque o chute duas vezes para a versão rasteira do power shot. Altíssimo risco e recompensa.", combo: ["LB", "+", "RB", "+", "B", "B"], stars: 5 },
            { nome: "Chute Falso (Fake Shot)", icon: "shuffle", desc: "Toque o chute e em seguida o passe curto, movendo o analógico esquerdo para fintar o goleiro antes de finalizar.", combo: ["B", "A", "+", stick("L", "any")], stars: 3 },
            { nome: "Trivela", icon: "rotate-cw", desc: "Segure LT e chute para bater com a parte externa da chuteira, curvando para o lado contrário ao pé dominante.", combo: ["LT", "+", "B"], stars: 3 },
            { nome: "Cabeceio", icon: "circle-dot", desc: "Aperte o chute no momento do salto para cabecear cruzamentos e escanteios.", combo: ["B"], stars: 1 },
            { nome: "Voleio", icon: "wind", desc: "Chute de primeira em bolas ainda no ar, sem deixar cair. Difícil de cronometrar, mas rápido demais para o goleiro.", combo: ["B"], stars: 3 },
            { nome: "Pênalti", icon: "flag", desc: "Use o analógico esquerdo para mirar e segure o chute para controlar a força.", combo: ["LS", "+", "B"], stars: 2 },
            { nome: "Cobrança de Falta", icon: "flag", desc: "Mire com o analógico esquerdo, ajuste a curva com o direito e segure o chute para definir a potência.", combo: ["LS", "+", stick("R", "any"), "+", "B"], stars: 3 }
        ]
    },
    passes: {
        accent: "#3da9ff",
        art: "passes",
        items: [
            { nome: "Passe Curto", icon: "arrow-right", desc: "Toque rápido e direto para o companheiro mais perto. O passe mais seguro do jogo.", combo: ["A"], stars: 1 },
            { nome: "Passe Forte (Driven)", icon: "send", desc: "Segure RB e aperte o passe curto para um passe mais rápido e firme no chão.", combo: ["RB", "+", "A"], stars: 2 },
            { nome: "Cruzamento / Lançamento Alto", icon: "git-merge", desc: "Levanta a bola para dentro da área ou troca o lado do campo. Altura e alcance dependem do tempo segurado.", combo: ["X"], stars: 1 },
            { nome: "Cruzamento Alto (High Lob)", icon: "git-merge", desc: "Segure LB e cruze para uma bola bem mais alta, ideal para cabeceios na área.", combo: ["LB", "+", "X"], stars: 2 },
            { nome: "Cruzamento Forte (Driven)", icon: "git-merge", desc: "Segure LB e RB com o cruzamento para uma bola mais rasteira e veloz na área.", combo: ["LB", "+", "RB", "+", "X"], stars: 3 },
            { nome: "Passe em Profundidade (Through Ball)", icon: "arrow-up-right", desc: "Lança a bola nas costas da defesa para o atacante correr e receber em velocidade.", combo: ["Y"], stars: 2 },
            { nome: "Passe em Profundidade Forte", icon: "arrow-up-right", desc: "Segure LB e RB com o passe em profundidade para um lançamento rasteiro e muito mais rápido.", combo: ["LB", "+", "RB", "+", "Y"], stars: 4 },
            { nome: "Lance Lobado", icon: "compass", desc: "Segure LB e aperte profundidade para lançar a bola por cima da defesa adiantada.", combo: ["LB", "+", "Y"], stars: 3 },
            { nome: "Passe Falso", icon: "shuffle", desc: "Finge o passe curto e sai driblando movendo o analógico esquerdo para o lado oposto do marcador.", combo: ["X", "A", "+", stick("L", "any")], stars: 3 },
            { nome: "Passe Preciso (Precision Pass)", icon: "crosshair", desc: "Segure RB e aperte profundidade para um passe enfiado com direção totalmente manual.", combo: ["RB", "+", "Y"], stars: 3 },
            { nome: "Cruzamento Preciso", icon: "crosshair", desc: "Segure RB e cruze para mirar manualmente o ponto exato da área.", combo: ["RB", "+", "X"], stars: 3 },
            { nome: "Passe Driblado (Flair Pass)", icon: "wind", desc: "Segure LT e passe curto para um toque de efeito, mais estiloso e imprevisível.", combo: ["LT", "+", "A"], stars: 3 },
            { nome: "Pedir Apoio", icon: "users", desc: "Aperte RB para chamar um companheiro próximo para se movimentar em apoio.", combo: ["RB"], stars: 1 },
            { nome: "Apoio Duplo", icon: "users", desc: "Aperte RB duas vezes seguidas para pedir apoio de dois companheiros ao mesmo tempo.", combo: ["RB", "RB"], stars: 2 },
            { nome: "Passe e Vai (Pass and Go)", icon: "footprints", desc: "Segure LB e passe curto para o jogador já iniciar um movimento de apoio em seguida.", combo: ["LB", "+", "A"], stars: 2 },
            { nome: "Levantada (Flick Up)", icon: "arrow-big-up", desc: "Clique o analógico direito para levantar a bola para si mesmo, ótimo para sair de pressão.", combo: [stick("R", "click")], stars: 2 },
            { nome: "Primeiro Toque Disfarçado", icon: "eye-off", desc: "Segure RB e mova o analógico esquerdo em direção à bola para um primeiro toque que engana o marcador.", combo: ["RB", "+", stick("L", "any")], stars: 4 }
        ]
    },
    dribles: {
        accent: "#c6ff3d",
        art: "dribles",
        items: [
            { nome: "Drible Simplificado", icon: "sparkles", desc: "Um toque no analógico direito já executa um movimento contextual automático, ótimo para iniciantes.", combo: [stick("R", "any")], stars: 1 },
            { nome: "Caneta Direcional", icon: "zap", desc: "Segure LT e RT juntos e mova o analógico direito para tentar a caneta na direção escolhida.", combo: ["LT", "+", "RT", "+", stick("R", "any")], stars: 1 },
            { nome: "Embaixadinhas Parado", icon: "circle-dot", desc: "Segure LT e toque RB para dominar a bola no ar sem se mover.", combo: ["LT", "+", "RB"], stars: 1 },
            { nome: "Finta para Frente e Virada", icon: "redo-2", desc: "Toque o analógico direito para baixo duas vezes para fingir avançar e virar rápido para o lado contrário.", combo: [stick("R", "down", { count: 2 })], stars: 2 },
            { nome: "Finta de Corpo", icon: "move-horizontal", desc: "Toque o analógico direito para a esquerda ou direita para balançar o corpo e confundir o marcador.", combo: [stick("R", "left"), "/", stick("R", "right")], stars: 2 },
            { nome: "Passo sobre a Bola (Stepover)", icon: "footprints", desc: "Role o analógico direito de cima para o lado escolhido, passando a perna por cima da bola sem tocá-la.", combo: [stick("R", "upright"), "/", stick("R", "upleft")], stars: 2 },
            { nome: "Domínio de Bola", icon: "hand", desc: "Segure o analógico direito para um lado para proteger e dominar a bola com a sola do pé.", combo: [stick("R", "left", { hold: true }), "/", stick("R", "right", { hold: true })], stars: 2 },
            { nome: "Roleta", icon: "rotate-cw", desc: "Role o analógico direito a partir de baixo, em sentido horário ou anti-horário, girando o corpo com a bola.", combo: [stick("R", "cw"), "/", stick("R", "ccw")], stars: 3 },
            { nome: "Chapéu de Calcanhar", icon: "arrow-big-up", desc: "Mova o analógico direito para cima e depois para baixo para tocar a bola por cima da própria cabeça.", combo: [stick("R", "up"), "→", stick("R", "down")], stars: 3 },
            { nome: "Finta com Parada", icon: "circle-stop", desc: "Segure LT e alterne o analógico direito entre esquerda e direita em sequência para travar e sair pelo lado oposto.", combo: ["LT", "+", stick("R", "left"), "→", stick("R", "right")], stars: 3 },
            { nome: "Toque Duplo na Mudança de Direção", icon: "split", desc: "Segure LT e mova o analógico direito para o lado para dois toques rápidos que mudam a direção bruscamente.", combo: ["LT", "+", stick("R", "left"), "/", stick("R", "right")], stars: 4 },
            { nome: "Domínio + Arraste (Ball Roll)", icon: "hand", desc: "Segure LB e mova o analógico direito para arrastar a bola com a sola, mudando o ângulo do corpo.", combo: ["LB", "+", stick("R", "up")], stars: 4 },
            { nome: "Giro (Spin)", icon: "rotate-cw", desc: "Segure RB e role o analógico direito a partir de baixo em sentido horário para um giro rápido protegendo a bola.", combo: ["RB", "+", stick("R", "cw")], stars: 4 },
            { nome: "Arco-íris Simples", icon: "rainbow", desc: "Mova o analógico direito para baixo e depois duas vezes para cima, levantando a bola por cima da cabeça em arco.", combo: [stick("R", "down"), "→", stick("R", "up"), "→", stick("R", "up")], stars: 4 },
            { nome: "Domínio Rápido", icon: "gauge", desc: "Segure o analógico direito para baixo para um toque rápido que tira a bola na frente da marcação.", combo: [stick("R", "down", { hold: true })], stars: 4 },
            { nome: "Elástico", icon: "infinity", desc: "Role o analógico direito a partir da direita em sentido horário até a esquerda, um dos dribles mais clássicos do jogo.", combo: [stick("R", "cw")], stars: 5 },
            { nome: "Elástico Reverso", icon: "infinity", desc: "Role o analógico direito a partir da esquerda em sentido anti-horário até a direita.", combo: [stick("R", "ccw")], stars: 5 },
            { nome: "Arco-íris de Estilo", icon: "rainbow", desc: "Segure LB e mova o analógico direito para trás e depois para frente, um arco-íris alto e de altíssimo risco.", combo: ["LB", "+", stick("R", "down"), "→", stick("R", "up")], stars: 5 },
            { nome: "Hocus Pocus", icon: "infinity", desc: "Role o analógico direito de baixo em sentido horário até a esquerda, depois em sentido anti-horário até a direita.", combo: [stick("R", "cw"), "→", stick("R", "ccw")], stars: 5 },
            { nome: "Giro com Calcanhar", icon: "rotate-cw", desc: "Segure RB e mova o analógico direito para cima e depois para baixo para um giro de calcanhar estiloso.", combo: ["RB", "+", stick("R", "up"), "→", stick("R", "down")], stars: 5 },
            { nome: "Chapéu de Sombrero", icon: "arrow-big-up", desc: "Mova o analógico direito para cima duas vezes e depois para baixo, erguendo a bola por cima do marcador que se aproxima por trás.", combo: [stick("R", "up"), "→", stick("R", "up"), "→", stick("R", "down")], stars: 5 },
            { nome: "Rabona Falsa", icon: "shuffle", desc: "Segure LB e Quadrado/Círculo, toque X/Y e mova o analógico esquerdo para baixo para fingir uma rabona e sair driblando.", combo: ["LB", "+", "X", "→", "Y", "+", stick("L", "down")], stars: 5 }
        ]
    },
    defesa: {
        accent: "#ff5fa2",
        art: "defesa",
        items: [
            { nome: "Cercar (Contain)", icon: "shield", desc: "Segure o botão de contenção para manter o defensor de frente para o atacante, a forma mais segura de pressionar sem cometer falta.", combo: ["A"], stars: 1 },
            { nome: "Jockey (Marcação)", icon: "footprints", desc: "Segure LT para o defensor acompanhar de lado, com controle fino de posicionamento e ângulo.", combo: ["LT"], stars: 2 },
            { nome: "Sprint Jockey", icon: "gauge", desc: "Segure LT e RT juntos para se mover de lado com mais velocidade contra pontas rápidos.", combo: ["LT", "+", "RT"], stars: 3 },
            { nome: "Desarme (Tackle)", icon: "shield-x", desc: "Tentativa direta de tirar a bola enquanto persegue o adversário. Eficaz, mas arriscado se usado repetidamente.", combo: ["B"], stars: 2 },
            { nome: "Desarme Forte (Hard Tackle)", icon: "shield-alert", desc: "Segure RB e aperte o desarme para uma disputa mais agressiva pela bola.", combo: ["RB", "+", "B"], stars: 3 },
            { nome: "Carrinho (Slide Tackle)", icon: "shield-alert", desc: "Desarme deslizando, usado como último recurso. Acerte a bola, não a perna do adversário.", combo: ["X"], stars: 3 },
            { nome: "Carrinho Forte", icon: "shield-alert", desc: "Segure RB e aperte o carrinho para um deslize mais longo e mais rápido, ainda mais arriscado.", combo: ["RB", "+", "X"], stars: 4 },
            { nome: "Falta Tática", icon: "shield-ban", desc: "Segure RB e aperte o passe curto para cometer uma falta de propósito e cortar um contra-ataque perigoso.", combo: ["RB", "+", "A"], stars: 2 },
            { nome: "Pressão Dupla", icon: "shield-plus", desc: "Segure RB para chamar um segundo jogador e formar pressão dupla sobre a bola.", combo: ["RB"], stars: 2 },
            { nome: "Troca de Jogador Manual", icon: "users", desc: "Controle total sobre qual defensor você assume, em vez de troca automática.", combo: ["LB"], stars: 2 },
            { nome: "Troca pelo Analógico Direito", icon: "move", desc: "Clique o analógico direito para trocar de jogador com precisão cirúrgica em jogadas aéreas.", combo: [stick("R", "click")], stars: 2 },
            { nome: "Cabeceio Defensivo", icon: "circle-dot", desc: "Afasta cruzamentos e bolas aéreas perigosas que vêm na área.", combo: ["B"], stars: 1 },
            { nome: "Cancelar Vantagem", icon: "circle-x", desc: "Segure LT e RT juntos para cancelar a vantagem e parar o jogo na hora.", combo: ["LT", "+", "RT"], stars: 1 },
            { nome: "Engajar Adversário Protegendo a Bola", icon: "shield-half", desc: "Segure LT e mova o analógico esquerdo em direção a quem está protegendo a bola para disputar o corpo a corpo.", combo: ["LT", "+", stick("L", "any")], stars: 3 },
            { nome: "Recuperação Rápida", icon: "refresh-cw", desc: "Aperte o botão de carrinho logo após o desarme deslizando para levantar o jogador mais rápido.", combo: ["X"], stars: 1 }
        ]
    },
    movimento: {
        accent: "#3da9ff",
        art: "movimento",
        items: [
            { nome: "Movimentar Jogador", icon: "move", desc: "Use o analógico esquerdo para conduzir o jogador pelo campo. A base de tudo.", combo: [stick("L", "any")], stars: 1 },
            { nome: "Sprint", icon: "gauge", desc: "Segure RT junto com a direção para correr mais rápido, com ou sem a bola.", combo: ["RT", "+", stick("L", "any")], stars: 1 },
            { nome: "Sprint Controlado", icon: "footprints", desc: "Segure RB para correr em velocidade média mantendo controle total da bola.", combo: ["RB"], stars: 1 },
            { nome: "Proteger a Bola (Shield)", icon: "shield-half", desc: "Segure LT parado para proteger a bola com o corpo contra a marcação por trás.", combo: ["LT"], stars: 1 },
            { nome: "Parar a Bola", icon: "circle-stop", desc: "Solte o analógico esquerdo sem direção e segure RT para parar a bola na hora.", combo: ["RT"], stars: 2 },
            { nome: "Parar e Encarar o Gol", icon: "circle-stop", desc: "Solte LB no momento certo enquanto segura uma direção para parar bruscamente e virar de frente ao gol.", combo: [stick("L", "any"), "+", "LB"], stars: 2 },
            { nome: "Drible Lateral (Strafe Dribble)", icon: "move-horizontal", desc: "Segure LB para driblar de lado, protegendo a bola enquanto se movimenta.", combo: ["LB", "+", stick("L", "any")], stars: 2 },
            { nome: "Jostle no Ar", icon: "wind", desc: "Segure LT para disputar o corpo a corpo enquanto a bola está no ar.", combo: ["LT"], stars: 1 },
            { nome: "Toque Controlado (Effort Touch)", icon: "footprints", desc: "Segure RB e mova o analógico direito para um primeiro toque mais ajustado à direção da corrida.", combo: ["RB", "+", stick("R", "any")], stars: 3 },
            { nome: "Corrida Direcionada", icon: "compass", desc: "Segure LB ou RB e mova o analógico direito para mandar uma corrida específica de um companheiro.", combo: ["LB/RB", "+", stick("R", "any")], stars: 3 },
            { nome: "Trocar de Jogador (Ataque)", icon: "users", desc: "Aperte LB para alternar entre jogadores próximos à bola durante o ataque.", combo: ["LB"], stars: 1 },
            { nome: "Fixar Jogador (Player Lock)", icon: "lock", desc: "Segure LS e RS juntos para fixar o controle em um único jogador específico.", combo: ["LS", "+", "RS"], stars: 2 },
            { nome: "Sprint com Bola", icon: "gauge", desc: "Aumenta a velocidade mantendo a bola dominada. Correr demais reduz o controle fino.", combo: ["RT"], stars: 1 }
        ]
    }
};
const CATEGORY_ART = {
    chutes: '<svg viewBox="0 0 64 64" fill="none"><circle cx="33" cy="36" r="11" stroke="currentColor" stroke-width="2"></circle><path d="M33 27v18M25 36h16M27.5 30l11 11M38.5 30l-11 11" stroke="currentColor" stroke-width="1.3" opacity="0.55"></path><path d="M8 14h12v9" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><path d="M14 10c5 4 7.5 9 8.5 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 5"></path><path d="M19 16c4.5 3.5 7 8 8 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 5"></path></svg>',
    passes: '<svg viewBox="0 0 64 64" fill="none"><circle cx="13" cy="42" r="4.2" stroke="currentColor" stroke-width="2"></circle><circle cx="51" cy="20" r="4.2" stroke="currentColor" stroke-width="2"></circle><path d="M17 40C28 28 36 24 47 22" stroke="currentColor" stroke-width="2" stroke-dasharray="1 6" stroke-linecap="round"></path><circle cx="32" cy="31" r="3.4" fill="currentColor"></circle><path d="M37 27l4 2-3 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>',
    dribles: '<svg viewBox="0 0 64 64" fill="none"><path d="M8 46c8 0 8-14 16-14s8 14 16 14 8-14 16-14" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><circle cx="44" cy="33" r="3.6" fill="currentColor"></circle><path d="M16 22v8M30 16v8M48 22v8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.55"></path></svg>',
    defesa: '<svg viewBox="0 0 64 64" fill="none"><path d="M32 9l18 6v15c0 13-8 21-18 25-10-4-18-12-18-25V15z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path><path d="M32 9v45" stroke="currentColor" stroke-width="1.4" opacity="0.45"></path><circle cx="32" cy="29" r="5" stroke="currentColor" stroke-width="1.8"></circle></svg>',
    movimento: '<svg viewBox="0 0 64 64" fill="none"><path d="M10 22h22M10 32h30M10 42h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.85"></path><path d="M44 16l10 6-10 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="50" cy="42" r="3.4" fill="currentColor" opacity="0.85"></circle></svg>'
};
const STORAGE_KEY = "fc26_controller";
const DIFF_LABEL = { 1: "Fácil", 2: "Fácil", 3: "Médio", 4: "Difícil", 5: "Difícil" };
const DIFF_CLASS = { 1: "diff-facil", 2: "diff-facil", 3: "diff-medio", 4: "diff-dificil", 5: "diff-dificil" };
const DIFF_GROUP = { 1: "1", 2: "1", 3: "2", 4: "3", 5: "3" };
const state = {
    controller: localStorage.getItem(STORAGE_KEY) || "xbox",
    pendingController: null,
    search: "",
    diffFilter: "all"
};
function refreshIcons() {
    if (typeof lucide !== "undefined" && lucide.createIcons) {
        lucide.createIcons();
    }
}
function translateCombo(combo, controllerKey) {
    const map = BUTTON_MAP[controllerKey];
    const result = [];
    combo.forEach(function (part) {
        if (typeof part === "object" && part !== null && part.kind === "stick") {
            result.push({
                type: "stick",
                side: part.side,
                action: part.action,
                count: part.count,
                hold: part.hold,
                label: STICK_LABEL[controllerKey][part.side]
            });
            return;
        }
        if (part === "+" || part === "→" || part === "↔" || part === "/") {
            result.push({ type: "sep", value: part });
            return;
        }
        if (map[part]) {
            const mapped = map[part];
            if (FACE_BUTTONS.indexOf(mapped) !== -1) {
                result.push({ type: "icon", value: mapped });
            }
            else {
                result.push({ type: "text", value: mapped });
            }
            return;
        }
        let translated = part;
        Object.keys(map).forEach(function (btn) {
            const regex = new RegExp("\\b" + btn + "\\b", "g");
            translated = translated.replace(regex, function () {
                const mapped = map[btn];
                return FACE_BUTTONS.indexOf(mapped) !== -1 ? mapped.toUpperCase() : mapped;
            });
        });
        if (controllerKey === "ps5") {
            translated = translated
                .replace(/\bCROSS\b/g, "✕")
                .replace(/\bCIRCLE\b/g, "○")
                .replace(/\bSQUARE\b/g, "□")
                .replace(/\bTRIANGLE\b/g, "△");
        }
        result.push({ type: "text", value: translated });
    });
    return result;
}
function starRow(count) {
    let html = '<div class="stars">';
    for (let i = 1; i <= 5; i++) {
        html += '<i data-lucide="star" class="' + (i <= count ? "" : "off") + '"></i>';
    }
    html += "</div>";
    return html;
}
function stickChip(part) {
    const glyph = STICK_GLYPHS[part.action] || STICK_GLYPHS.any;
    const sideClass = part.side === "L" ? "stick-l" : "stick-r";
    const holdClass = part.hold ? " stick-hold" : "";
    const countBadge = part.count > 1 ? '<span class="stick-count">x' + part.count + '</span>' : "";
    return '<span class="stick-chip ' + sideClass + holdClass + '">' +
        '<span class="stick-glyph">' + glyph + '</span>' +
        '<span class="stick-text">' + part.label + '</span>' +
        countBadge +
        '</span>';
}
function comboRow(combo, controllerKey) {
    const parts = translateCombo(combo, controllerKey);
    return parts.map(function (part) {
        if (part.type === "sep") {
            return '<span class="plus">' + part.value + '</span>';
        }
        if (part.type === "stick") {
            return stickChip(part);
        }
        if (part.type === "icon") {
            if (LETTER_BUTTONS.indexOf(part.value) !== -1) {
                return '<span class="key-icon btn-' + part.value + '">' + part.value + '</span>';
            }
            return '<span class="key-icon btn-' + part.value + '">' + BUTTON_SHAPES[part.value] + '</span>';
        }
        return '<span class="key-label">' + part.value + '</span>';
    }).join("");
}
function matchesFilters(item) {
    if (state.diffFilter !== "all" && DIFF_GROUP[item.stars] !== state.diffFilter)
        return false;
    if (state.search) {
        const haystack = (item.nome + " " + item.desc).toLowerCase();
        if (haystack.indexOf(state.search) === -1)
            return false;
    }
    return true;
}
function renderCategoryArt(catKey, accent) {
    const holder = document.getElementById("art-" + catKey);
    if (!holder)
        return;
    holder.style.setProperty("--accent", accent);
    holder.innerHTML = CATEGORY_ART[catKey] || "";
}
function renderCategory(catKey, controllerKey) {
    const cat = DATA[catKey];
    const grid = document.getElementById("grid-" + catKey);
    const empty = document.getElementById("empty-" + catKey);
    const countEl = document.getElementById("count-" + catKey);
    if (!grid)
        return;
    grid.innerHTML = "";
    const visibleItems = cat.items.filter(function (item) { return matchesFilters(item); });
    if (countEl) {
        countEl.textContent = visibleItems.length + (visibleItems.length === 1 ? " comando" : " comandos");
    }
    if (empty) {
        empty.classList.toggle("active", visibleItems.length === 0);
    }
    grid.style.display = visibleItems.length === 0 ? "none" : "grid";
    visibleItems.forEach(function (item, index) {
        const card = document.createElement("div");
        card.className = "card";
        card.style.setProperty("--accent", cat.accent);
        card.style.animationDelay = (index * 0.035) + "s";
        card.innerHTML =
            '<div class="card-top">' +
                '<div class="card-icon"><i data-lucide="' + item.icon + '"></i></div>' +
                '<div class="card-top-right">' +
                starRow(item.stars) +
                '</div>' +
                '</div>' +
                '<span class="diff-tag ' + DIFF_CLASS[item.stars] + '"><span class="diff-dot"></span>' + DIFF_LABEL[item.stars] + '</span>' +
                '<h3>' + item.nome + '</h3>' +
                '<p>' + item.desc + '</p>' +
                '<div class="combo">' + comboRow(item.combo, controllerKey) + '</div>';
        grid.appendChild(card);
    });
}
function renderAll(controllerKey) {
    Object.keys(DATA).forEach(function (catKey) {
        renderCategory(catKey, controllerKey);
    });
    refreshIcons();
}
function setupSearch() {
    const input = document.getElementById("search-input");
    if (!input)
        return;
    let timer = null;
    input.addEventListener("input", function () {
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(function () {
            state.search = input.value.trim().toLowerCase();
            renderAll(state.controller);
        }, 120);
    });
}
function setupDiffFilter() {
    const group = document.getElementById("diff-filter");
    if (!group)
        return;
    group.addEventListener("click", function (event) {
        const target = event.target;
        const btn = target.closest(".filter-btn");
        if (!btn)
            return;
        group.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        state.diffFilter = btn.dataset.diff || "all";
        renderAll(state.controller);
    });
}
function setupTabs() {
    const tabs = document.querySelectorAll(".tab");
    const panels = document.querySelectorAll(".panel");
    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            const target = tab.dataset.target;
            tabs.forEach(function (t) { t.classList.remove("active"); });
            panels.forEach(function (p) { p.classList.remove("active"); });
            tab.classList.add("active");
            const panel = document.getElementById(target);
            if (panel)
                panel.classList.add("active");
        });
    });
}
function applyControllerToHeader(controllerKey) {
    const label = document.getElementById("current-controller-label");
    const eyebrow = document.getElementById("hero-eyebrow");
    const swapIcon = document.getElementById("swap-icon");
    if (label)
        label.textContent = CONTROLLER_LABELS[controllerKey];
    if (eyebrow)
        eyebrow.textContent = CONTROLLER_LABELS[controllerKey] + " · Controle padrão";
    if (swapIcon)
        swapIcon.src = CONTROLLER_IMAGES[controllerKey];
}
function showScreen(id) {
    document.querySelectorAll(".screen").forEach(function (screen) {
        screen.classList.remove("active");
    });
    const target = document.getElementById(id);
    if (target)
        target.classList.add("active");
}
function applySelectedCard(controllerKey) {
    document.querySelectorAll(".controller-card").forEach(function (card) {
        const isSelected = card.dataset.controller === controllerKey;
        card.classList.toggle("selected", isSelected);
        card.setAttribute("aria-checked", isSelected ? "true" : "false");
    });
}
function setContinueReady(ready) {
    const btn = document.getElementById("continue-btn");
    const hint = document.getElementById("select-hint");
    if (!btn)
        return;
    btn.disabled = !ready;
    btn.classList.toggle("ready", ready);
    if (hint) {
        hint.textContent = ready ? "Tudo pronto, pode continuar" : "Escolha um controle para continuar";
    }
}
function confirmSelection(controllerKey) {
    const btn = document.getElementById("continue-btn");
    const label = btn ? btn.querySelector(".btn-label") : null;
    if (!btn || btn.classList.contains("loading") || btn.classList.contains("success"))
        return;
    btn.classList.add("loading");
    setTimeout(function () {
        btn.classList.remove("loading");
        btn.classList.add("success");
        if (label)
            label.textContent = "Pronto!";
        setTimeout(function () {
            state.controller = controllerKey;
            localStorage.setItem(STORAGE_KEY, controllerKey);
            applyControllerToHeader(controllerKey);
            renderAll(controllerKey);
            showScreen("screen-app");
            btn.classList.remove("success");
            if (label)
                label.textContent = "Continuar";
            setContinueReady(false);
            state.pendingController = null;
        }, 350);
    }, 500);
}
function setupControllerSelect() {
    const cards = Array.prototype.slice.call(document.querySelectorAll(".controller-card"));
    cards.forEach(function (card, index) {
        card.addEventListener("click", function () {
            state.pendingController = card.dataset.controller;
            applySelectedCard(state.pendingController);
            setContinueReady(true);
        });
        card.addEventListener("keydown", function (event) {
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                const next = cards[(index + 1) % cards.length];
                next.focus();
            }
            if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                const prev = cards[(index - 1 + cards.length) % cards.length];
                prev.focus();
            }
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                card.click();
            }
        });
    });
    const continueBtn = document.getElementById("continue-btn");
    if (continueBtn) {
        continueBtn.addEventListener("click", function () {
            if (!state.pendingController || continueBtn.disabled)
                return;
            confirmSelection(state.pendingController);
        });
    }
}
function setupSwapController() {
    const swapBtn = document.getElementById("swap-controller");
    if (swapBtn) {
        swapBtn.addEventListener("click", function () {
            state.pendingController = state.controller;
            applySelectedCard(state.controller);
            setContinueReady(true);
            showScreen("screen-select");
        });
    }
}
function setupCategoryArt() {
    Object.keys(DATA).forEach(function (catKey) {
        renderCategoryArt(catKey, DATA[catKey].accent);
    });
}
function init() {
    refreshIcons();
    setupControllerSelect();
    setupSwapController();
    setupTabs();
    setupSearch();
    setupDiffFilter();
    setupCategoryArt();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && BUTTON_MAP[stored]) {
        state.controller = stored;
        applyControllerToHeader(stored);
        renderAll(stored);
        showScreen("screen-app");
    }
    else {
        showScreen("screen-select");
    }
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
}
else {
    init();
}