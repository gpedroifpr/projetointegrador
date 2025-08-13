document.addEventListener('DOMContentLoaded', () => {
    // --- SELETORES DO DOM ---
    const loginScreen = document.getElementById('login-screen');
    const registerScreen = document.getElementById('register-screen');
    const mainAppScreen = document.getElementById('main-app');
    const minhaContaScreen = document.getElementById('minha-conta');

    const loginForm = document.getElementById('login-form-actual');
    const registerForm = document.getElementById('register-form-actual');

    const sideMenu = document.getElementById('sideMenu');
    const menuToggle = document.getElementById('menuToggle');
    const closeSideMenuBtn = document.querySelector('.close-side-menu-btn');
    const menuOverlay = document.querySelector('.menu-overlay');

    const pageNavLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');

    const goToLoginFromRegister = document.querySelector('.go-to-login-from-register');
    const closeLoginButton = document.querySelector('.close-login-btn');
    const closeRegisterButton = document.querySelector('.close-register-btn');

    const authLinksHeader = document.querySelector('.site-header .auth-links');
    const siteLogoHeader = document.querySelector('.site-logo-header');

    const userNameDisplay = document.getElementById('user-name-display');
    const userEmailDisplay = document.getElementById('user-email-display');
    const btnLogoutMyAccount = document.getElementById('btn-logout-my-account');


    // --- ESTADO DA APLICAÇÃO ---
    // A lista de usuários agora vive no banco de dados!
    // Mantemos apenas o usuário logado no navegador para ele não precisar logar toda hora.
    let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogadoPenicius')) || null;


// --- DADOS DOS PRODUTOS ---
const produtosModelos = Array(10).fill(null).map((_, i) => ({
    nome: `Modelo Destaque ${i + 1}`,
    preco: `${(100 + i * 10).toFixed(2).replace('.', ',')}`,
    imagem: `backend/public/images/modelo${i + 1}.jpg`, // Caminho para a imagem real
    alt: `Visualização Modelo ${i + 1}`
}));

const produtosMasculinos = Array(10).fill(null).map((_, i) => ({
    nome: `Roupa Masculina ${i + 1}`,
    preco: `${(90 + i * 10).toFixed(2).replace('.', ',')}`,
    imagem: `backend/public/images/masculino${i + 1}.jpg`, // Caminho para a imagem real
    alt: `Visualização Roupa Masculina ${i + 1}`
}));

const produtosInfantis = Array(10).fill(null).map((_, i) => ({
    nome: `Roupa Infantil ${i + 1}`,
    preco: `${(50 + i * 5).toFixed(2).replace('.', ',')}`,
    imagem: `backend/public/images/infantil${i + 1}.jpg`, // Caminho para a imagem real
    alt: `Visualização Roupa Infantil ${i + 1}`
}));
    // --- FUNÇÕES AUXILIARES ---

    function renderizarProdutos(containerId, arrayDeProdutos) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        arrayDeProdutos.forEach(produto => {
            container.innerHTML += `
                <div class="product-card">
                    <div class="product-image-container"><img src="${produto.imagem}" alt="${produto.alt}"></div>
                    <div class="product-info">
                        <h3 class="product-name">${produto.nome}</h3>
                        <p class="product-price">R$ ${produto.preco}</p>
                        <button class="add-to-cart-btn">Ver Detalhes</button>
                    </div>
                </div>`;
        });
    }

    function updateUIBasedOnLoginState() {
        if (usuarioLogado) {
            if (authLinksHeader) {
                authLinksHeader.innerHTML = `<a href="#" id="my-account-link-header" data-target="minha-conta">Olá, ${usuarioLogado.nome.split(' ')[0]}</a> <a href="#" id="logout-link">Sair</a>`;
            }
            if (siteLogoHeader) {
                siteLogoHeader.classList.remove('go-to-login');
                siteLogoHeader.title = "Ver Minha Conta";
                siteLogoHeader.dataset.action = 'go-to-my-account-logo';
            }
            const authLinksSideMenu = sideMenu ? sideMenu.querySelectorAll('.side-menu-link') : [];
            authLinksSideMenu.forEach(link => {
                if (link.classList.contains('go-to-login')) {
                    link.textContent = 'Minha Conta';
                    link.classList.remove('go-to-login');
                    link.dataset.target = "minha-conta";
                    link.href = "#minha-conta";
                } else if (link.classList.contains('go-to-register')) {
                    link.style.display = 'none';
                }
            });
        } else {
            if (authLinksHeader) {
                authLinksHeader.innerHTML = `<a href="#" class="go-to-register">Cadastrar</a> <a href="#" class="go-to-login">Entrar</a>`;
            }
            if (siteLogoHeader) {
                siteLogoHeader.classList.add('go-to-login');
                siteLogoHeader.title = "Ir para Login";
                delete siteLogoHeader.dataset.action;
            }
            const authLinksSideMenu = sideMenu ? sideMenu.querySelectorAll('.side-menu-link') : [];
            authLinksSideMenu.forEach(link => {
                const originalText = link.dataset.originalText || 'Minha Conta / Login';
                if (link.dataset.target === 'minha-conta') {
                    link.textContent = originalText;
                    link.classList.add('go-to-login');
                    delete link.dataset.target;
                    link.href = "#";
                }
                const registerLinkInSideMenu = sideMenu ? sideMenu.querySelector('.go-to-register') : null;
                if (registerLinkInSideMenu) {
                    registerLinkInSideMenu.style.display = 'block';
                    registerLinkInSideMenu.textContent = 'Cadastrar';
                }
            });
        }
    }

    function populateMinhaConta() {
        if (usuarioLogado) {
            if (userNameDisplay) userNameDisplay.textContent = usuarioLogado.nome;
            if (userEmailDisplay) userEmailDisplay.textContent = usuarioLogado.email;
        } else {
            showLoginScreen();
        }
    }

    function showScreen(screenToShow) {
        [mainAppScreen, loginScreen, registerScreen].forEach(s => {
            if (s) s.classList.remove('active');
        });
        if (screenToShow) screenToShow.classList.add('active');
    }

    function showMainApp() { showScreen(mainAppScreen); }
    function showLoginScreen() { showScreen(loginScreen); closeSideMenu(); }
    function showRegisterScreen() { showScreen(registerScreen); closeSideMenu(); }

    function openSideMenu() {
        if(sideMenu) sideMenu.classList.add('open');
        if(menuOverlay) menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSideMenu() {
        if(sideMenu) sideMenu.classList.remove('open');
        if(menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPageContent(targetId) {
        if (!targetId) return;
        if (targetId === 'minha-conta' && !usuarioLogado) {
            showLoginScreen();
            return;
        }
        pageContents.forEach(page => {
            if (page) page.classList.remove('active-page');
        });
        const pageToShow = document.getElementById(targetId);
        if (pageToShow) {
            pageToShow.classList.add('active-page');
        }
        pageNavLinks.forEach(link => {
            if(link) link.classList.remove('active-nav-link');
            if (link && link.dataset.target === targetId) {
                link.classList.add('active-nav-link');
            }
        });
        if (targetId === 'minha-conta') {
            populateMinhaConta();
        }
        const validContentPages = ['modelos', 'masculino', 'infantil', 'sobre', 'minha-conta'];
        if (validContentPages.includes(targetId)) {
            if (history.pushState) {
                history.pushState({ page: targetId }, document.title, '#' + targetId);
            } else {
                window.location.hash = '#' + targetId;
            }
        }
        closeSideMenu();
        if (targetId !== 'login-screen' && targetId !== 'register-screen') {
            showMainApp();
        }
    }


    // --- LÓGICA DE CADASTRO, LOGIN E LOGOUT (CONECTADA AO BACKEND) ---

    // NOVO CÓDIGO DE CADASTRO
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nome = document.getElementById('register-nome').value.trim();
            const email = document.getElementById('register-email').value.trim().toLowerCase();
            const senha = document.getElementById('register-senha').value;
            const confirmarSenha = document.getElementById('register-confirmar-senha').value;

            if (!nome || !email || !senha || !confirmarSenha) { alert("Por favor, preencha todos os campos."); return; }
            if (senha !== confirmarSenha) { alert("As senhas não coincidem!"); return; }
            if (senha.length < 6) { alert("A senha deve ter pelo menos 6 caracteres."); return; }

            try {
                // Usamos 'fetch' para enviar os dados para o nosso backend
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nome, email, senha }),
                });

                const data = await response.json(); // Pega a resposta do servidor

                if (response.ok) { // Status 200-299 indica sucesso
                    alert(data.message); // Mostra a mensagem de sucesso do servidor
                    showLoginScreen();
                    registerForm.reset();
                } else {
                    // Se o servidor retornou um erro (ex: email já existe)
                    alert(`Erro no cadastro: ${data.error}`);
                }
            } catch (error) {
                console.error('Erro ao conectar com o servidor:', error);
                alert('Não foi possível se conectar ao servidor. Verifique se ele está rodando no terminal.');
            }
        });
    }

    // NOVO CÓDIGO DE LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('login-email').value.trim().toLowerCase();
            const senha = document.getElementById('login-senha').value;

            if (!email || !senha) { alert("Por favor, preencha email e senha."); return; }
            
            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, senha }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Login deu certo!
                    usuarioLogado = data.usuario; // O servidor nos devolve os dados do usuário
                    localStorage.setItem('usuarioLogadoPenicius', JSON.stringify(usuarioLogado)); // Salva para manter o login
                    
                    alert(data.message);
                    updateUIBasedOnLoginState();
                    showPageContent('modelos');
                    loginForm.reset();
                } else {
                    // Login falhou
                    alert(`Erro no login: ${data.error}`);
                    usuarioLogado = null;
                    localStorage.removeItem('usuarioLogadoPenicius');
                    updateUIBasedOnLoginState();
                }
            } catch (error) {
                console.error('Erro ao conectar com o servidor:', error);
                alert('Não foi possível se conectar ao servidor. Verifique se ele está rodando no terminal.');
            }
        });
    }

    function handleLogout() {
        if (usuarioLogado) {
            alert(`Até logo, ${usuarioLogado.nome.split(' ')[0]}!`);
        }
        usuarioLogado = null;
        localStorage.removeItem('usuarioLogadoPenicius');
        updateUIBasedOnLoginState();
        showPageContent('modelos');
        if (!mainAppScreen.classList.contains('active')) {
            showMainApp();
        }
    }

    // --- EVENT LISTENERS GERAIS ---

    pageNavLinks.forEach(link => {
        if (link.dataset.target) {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.dataset.target;
                showPageContent(targetId);
            });
        }
    });

    document.body.addEventListener('click', function(event) {
        const targetElement = event.target.closest('a');
        let actionElement = targetElement;

        if (!actionElement) {
            const buttonElement = event.target.closest('button');
            if (buttonElement && (buttonElement.dataset.action || buttonElement.id)) {
                actionElement = buttonElement;
            }
        }
        
        if (!actionElement) return;

        if (actionElement.classList.contains('go-to-login')) {
            event.preventDefault(); showLoginScreen();
        } else if (actionElement.classList.contains('go-to-register')) {
            event.preventDefault(); showRegisterScreen();
        }
        else if (actionElement.id === 'my-account-link-header' && actionElement.dataset.target === 'minha-conta') {
            event.preventDefault();
            if (usuarioLogado) {
                showPageContent('minha-conta');
            } else {
                showLoginScreen();
            }
        }
        else if (actionElement.dataset.action === 'go-to-my-account-logo') {
             event.preventDefault();
            if (usuarioLogado) {
                showPageContent('minha-conta');
            } else {
                showLoginScreen();
            }
        }
        else if (actionElement.id === 'logout-link') {
            event.preventDefault(); handleLogout();
        }
        else if (actionElement.classList.contains('go-to-login-from-register')) {
            event.preventDefault(); showLoginScreen();
        }
    });

    if (btnLogoutMyAccount) {
        btnLogoutMyAccount.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    if (closeLoginButton) {
        closeLoginButton.addEventListener('click', () => {
            showMainApp();
            const currentActivePage = document.querySelector('.page-content.active-page');
            showPageContent(currentActivePage ? currentActivePage.id : 'modelos');
        });
    }
    if (closeRegisterButton) {
        closeRegisterButton.addEventListener('click', () => {
            showMainApp();
            const currentActivePage = document.querySelector('.page-content.active-page');
            showPageContent(currentActivePage ? currentActivePage.id : 'modelos');
        });
    }

    if (menuToggle) menuToggle.addEventListener('click', openSideMenu);
    if (closeSideMenuBtn) closeSideMenuBtn.addEventListener('click', closeSideMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeSideMenu);


    // --- NAVEGAÇÃO PELO HISTÓRICO DO NAVEGADOR (BOTÕES VOLTAR/AVANÇAR) ---
    window.addEventListener('popstate', (event) => {
        let targetPage = 'modelos';
        if (event.state && event.state.page) {
            targetPage = event.state.page;
        } else {
            const hash = window.location.hash.substring(1);
            if (hash) targetPage = hash;
        }

        if (targetPage === 'login-screen') {
            showLoginScreen();
        } else if (targetPage === 'register-screen') {
            showRegisterScreen();
        } else if (document.getElementById(targetPage)) {
            if (targetPage === 'minha-conta' && !usuarioLogado) {
                showLoginScreen();
            } else {
                showPageContent(targetPage);
            }
        } else {
            showPageContent('modelos');
        }
    });

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    function initializeApp() {
        updateUIBasedOnLoginState();
        renderizarProdutos('grid-modelos', produtosModelos);
        renderizarProdutos('grid-masculino', produtosMasculinos);
        renderizarProdutos('grid-infantil', produtosInfantis);

        const currentHash = window.location.hash.substring(1);

        if (currentHash === 'login-screen') {
            showLoginScreen();
        } else if (currentHash === 'register-screen') {
            showRegisterScreen();
        } else if (currentHash === 'minha-conta') {
            if (usuarioLogado) {
                showPageContent('minha-conta');
            } else {
                showLoginScreen();
            }
        } else if (currentHash && document.getElementById(currentHash)) {
            showPageContent(currentHash);
        } else {
            showPageContent('modelos');
        }

        const activePageId = document.querySelector('.page-content.active-page')?.id;
        if (activePageId) {
            const activeLink = sideMenu?.querySelector(`.nav-link[data-target="${activePageId}"]`);
            if (activeLink) activeLink.classList.add('active-nav-link');
        }
    }

    initializeApp();
});