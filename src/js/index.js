const CONTROLLER_STORAGE_KEY = 'fc26_selected_controller';

const controllerLabels = {
    xbox: 'Xbox',
    playstation: 'PS4 / PS5'
};

const viewControllerSelect = document.getElementById('viewControllerSelect');
const viewSidebar = document.getElementById('viewSidebar');

const controllerCards = document.querySelectorAll('.controller-card');
const btnContinue = document.getElementById('btnContinue');
const selectionHint = document.getElementById('selectionHint');

const appLayout = document.getElementById('appLayout');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarScrim = document.getElementById('sidebarScrim');
const btnBackToController = document.getElementById('btnBackToController');

const commandLinks = document.querySelectorAll('#commandsList .sidebar__link');
const commandPageTitle = document.getElementById('commandPageTitle');
const commandsGrid = document.getElementById('commandsGrid');
const controllerBadgeText = document.getElementById('controllerBadgeText');

const CONTROLLER_ICON_BASENAME = {
    xbox: 'Xbox',
    playstation: 'PlayStation'
};

let currentControllerType = 'xbox';
let currentCommandPage = 'chutes';

const sidebarAlert = document.getElementById('sidebarAlert');
const sidebarAlertClose = document.getElementById('sidebarAlertClose');
const ALERT_DISMISSED_KEY = 'fc26_alert_dismissed';

const commandLabels = {
    chutes: 'Chutes',
    passes: 'Passes',
    dribles: 'Dribles',
    defesa: 'Defesa',
    goleiro: 'Goleiro',
    movimentacao: 'Movimentação / Sprint',
    cruzamentos: 'Cruzamentos',
    faltas: 'Faltas e Escanteios'
};

function saveController(type) {
    try {
        localStorage.setItem(CONTROLLER_STORAGE_KEY, type);
    } catch (error) {
        console.warn('Não foi possível salvar o controle selecionado.');
    }
}

function loadSavedController() {
    try {
        return localStorage.getItem(CONTROLLER_STORAGE_KEY);
    } catch (error) {
        return null;
    }
}

function setSelectedController(type, options = {}) {
    if (!controllerLabels[type]) return;

    currentControllerType = type;

    controllerCards.forEach(card => {
        card.classList.toggle('is-selected', card.dataset.controller === type);
    });

    btnContinue.disabled = false;
    btnContinue.classList.add('is-active');
    selectionHint.textContent = `Controle selecionado: ${controllerLabels[type]}`;
    selectionHint.classList.add('is-confirmed');

    if (controllerBadgeText) {
        controllerBadgeText.textContent = CONTROLLER_ICON_BASENAME[type];
    }

    renderCommandsGrid(currentCommandPage);

    if (!options.silent) {
        saveController(type);
    }
}

function showView(view) {
    viewControllerSelect.classList.remove('is-active');
    viewSidebar.classList.remove('is-active');
    view.classList.add('is-active');
}

function goToSidebar() {
    showView(viewSidebar);
}

function goToControllerSelect() {
    showView(viewControllerSelect);
}

function handleContinue() {
    if (btnContinue.disabled) return;
    goToSidebar();
}

function initControllerCards() {
    controllerCards.forEach(card => {
        card.addEventListener('click', () => {
            setSelectedController(card.dataset.controller);
        });
    });
}

function restoreSavedController() {
    const saved = loadSavedController();
    if (saved && controllerLabels[saved]) {
        setSelectedController(saved, { silent: true });
        goToSidebar();
    }
}

function openSidebar() {
    appLayout.classList.add('is-sidebar-open');
}

function closeSidebar() {
    appLayout.classList.remove('is-sidebar-open');
}

function toggleSidebar() {
    appLayout.classList.contains('is-sidebar-open') ? closeSidebar() : openSidebar();
}

function initSidebarToggle() {
    if (!sidebarToggle) return;
    sidebarToggle.addEventListener('click', toggleSidebar);
    sidebarScrim.addEventListener('click', closeSidebar);
}

function initSidebarAutoClose() {
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeSidebar();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 1024) closeSidebar();
        }, 150);
    });
}

function initBackToController() {
    if (!btnBackToController) return;
    btnBackToController.addEventListener('click', goToControllerSelect);
}

const CONTROLLER_FOLDER_MAP = {
    xbox: 'Xbox',
    playstation: 'PlayStation'
};

function buildButtonIcon(buttonKey) {
    const iconMap = BUTTON_ICON_MAP[currentControllerType];
    const labelMap = BUTTON_LABEL_MAP[currentControllerType];
    const filename = iconMap[buttonKey];
    const label = labelMap[buttonKey] || buttonKey.toUpperCase();

    if (!filename) return null;

    const folder = CONTROLLER_FOLDER_MAP[currentControllerType];
    const img = document.createElement('img');
    img.className = 'command-card__button-icon';
    img.src = `src/${folder}/${filename}`;
    img.alt = label;
    img.loading = 'lazy';
    return img;
}

function buildCommandCard(command) {
    const card = document.createElement('div');
    card.className = 'command-card';

    const media = document.createElement('div');
    media.className = 'command-card__media';
    media.innerHTML = COMMAND_SVG_ICONS[command.icon] || '';

    const buttons = document.createElement('div');
    buttons.className = 'command-card__buttons';

    command.buttons.forEach((buttonKey, index) => {
        const icon = buildButtonIcon(buttonKey);
        if (icon) buttons.appendChild(icon);

        if (index < command.buttons.length - 1) {
            const plus = document.createElement('span');
            plus.className = 'command-card__plus';
            plus.textContent = '+';
            buttons.appendChild(plus);
        }
    });

    const body = document.createElement('div');
    body.className = 'command-card__body';

    const name = document.createElement('span');
    name.className = 'command-card__name';
    name.textContent = command.name;

    const desc = document.createElement('p');
    desc.className = 'command-card__desc';
    desc.textContent = command.desc;

    body.appendChild(buttons);
    body.appendChild(name);
    body.appendChild(desc);

    card.appendChild(media);
    card.appendChild(body);
    return card;
}

function renderCommandsGrid(page) {
    if (!commandsGrid) return;

    const commands = COMMANDS_DATA[page];
    if (!commands) return;

    commandsGrid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    commands.forEach(command => {
        fragment.appendChild(buildCommandCard(command));
    });
    commandsGrid.appendChild(fragment);
}

function selectCommandPage(page) {
    if (!commandLabels[page]) return;

    currentCommandPage = page;

    commandLinks.forEach(link => {
        link.classList.toggle('is-active', link.dataset.page === page);
    });

    commandPageTitle.textContent = commandLabels[page];
    renderCommandsGrid(page);
    closeSidebar();
}

function initCommandLinks() {
    commandLinks.forEach(link => {
        link.addEventListener('click', () => {
            selectCommandPage(link.dataset.page);
        });
    });
}

function dismissAlert() {
    if (!sidebarAlert) return;
    sidebarAlert.classList.add('is-dismissed');
    try {
        localStorage.setItem(ALERT_DISMISSED_KEY, 'true');
    } catch (error) {
        console.warn('Não foi possível salvar o estado da notificação.');
    }
}

function restoreAlertState() {
    if (!sidebarAlert) return;
    let dismissed = false;
    try {
        dismissed = localStorage.getItem(ALERT_DISMISSED_KEY) === 'true';
    } catch (error) {
        dismissed = false;
    }
    if (dismissed) sidebarAlert.classList.add('is-dismissed');
}

function initSidebarAlert() {
    if (!sidebarAlertClose) return;
    sidebarAlertClose.addEventListener('click', dismissAlert);
    restoreAlertState();
}

function init() {
    if (window.lucide) lucide.createIcons();
    initControllerCards();
    btnContinue.addEventListener('click', handleContinue);
    restoreSavedController();
    initSidebarToggle();
    initSidebarAutoClose();
    initBackToController();
    initCommandLinks();
    initSidebarAlert();
}

init();