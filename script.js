var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var KnowledgeChampionsApp = /** @class */ (function () {
    function KnowledgeChampionsApp() {
        this.users = [];
        this.currentUser = null;
        this.achievements = []; // Corrigido: era 'achievement' no singular
        this.dataKey = 'knowledge-champions-data'; // Corrigido: era 'datakey'
        this.init();
    }
    KnowledgeChampionsApp.prototype.init = function () {
        this.loadData();
        this.setupEventListeners(); // Corrigido: era 'setupEventListener'
        this.checkAutoLogin(); // Corrigido: era 'checkAutologin'
    };
    KnowledgeChampionsApp.prototype.loadData = function () {
        var savedData = localStorage.getItem(this.dataKey);
        if (savedData) {
            try {
                var data = JSON.parse(savedData);
                this.users = data.users || [];
                this.achievements = data.achievements || this.getDefaultAchievements();
            }
            catch (error) {
                console.error('Erro ao carregar dados:', error);
                this.initializeDefaultData();
            }
        }
        else {
            this.initializeDefaultData();
        }
    };

    // Dentro da classe KnowledgeChampionsApp, adicione:

    KnowledgeChampionsApp.prototype.criarConta = function () {
        var name = document.getElementById('reg-name').value;
        var email = document.getElementById('reg-email').value;

        if (!name || !email) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (this.users.find(function (u) { return u.email === email; })) {
            alert('Este email já está cadastrado!');
            return;
        }

        this.createUser(name, email);
        this.hideRegistrationModal();
        this.showMainContent();

        localStorage.setItem('last-user-email', email);
        alert("Bem-vindo(a), ".concat(name, "!"));
    };

    KnowledgeChampionsApp.prototype.fazerLogin = function () {
        var email = document.getElementById('login-email').value;

        if (!email) {
            alert('Por favor, informe seu email!');
            return;
        }

        var user = this.users.find(function (u) { return u.email === email.trim(); });

        if (!user) {
            alert('Email não encontrado!');
            return;
        }

        this.currentUser = user;
        this.hideLoginModal();
        this.showMainContent();

        localStorage.setItem('last-user-email', user.email);
        alert("Bem-vindo(a) de volta, ".concat(user.name, "!"));
    };
    KnowledgeChampionsApp.prototype.setupEventListeners = function () {
        var _this = this;
        // Login button
        var loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.addEventListener('click', function () { return _this.showLoginModal(); });
        }
        // Registration button
        var startButton = document.getElementById('start-registration');
        if (startButton) {
            startButton.addEventListener('click', function () { return _this.showRegistrationModal(); });
        }
        // Forms
        var registrationForm = document.getElementById('registration-form');
        if (registrationForm) {
            registrationForm.addEventListener('submit', function (e) { return _this.handleRegistrationSubmit(e); });
        }
        var loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function (e) { return _this.handleLoginSubmit(e); });
        }
        var presentationForm = document.getElementById('presentation-form');
        if (presentationForm) {
            presentationForm.addEventListener('submit', function (e) { return _this.handlePresentationSubmit(e); });
        }
        // Navigation between modals
        var goToLogin = document.getElementById('go-to-login');
        if (goToLogin) {
            goToLogin.addEventListener('click', function (e) {
                e.preventDefault();
                _this.hideRegistrationModal();
                _this.showLoginModal();
            });
        }
        var goToRegister = document.getElementById('go-to-register');
        if (goToRegister) {
            goToRegister.addEventListener('click', function (e) {
                e.preventDefault();
                _this.hideLoginModal();
                _this.showRegistrationModal();
            });
        }
        // Logout button
        var logoutButton = document.getElementById('logout-btn');
        if (logoutButton) {
            logoutButton.addEventListener('click', function () { return _this.handleLogout(); });
        }
    };
    KnowledgeChampionsApp.prototype.checkAutoLogin = function () {
        var lastUserEmail = localStorage.getItem('last-user-email');
        if (lastUserEmail) {
            var user = this.users.find(function (u) { return u.email === lastUserEmail; });
            if (user) {
                this.currentUser = user;
                this.showMainContent();
            }
        }
    };
    KnowledgeChampionsApp.prototype.showRegistrationModal = function () {
        var modal = document.getElementById('registration-modal');
        if (modal)
            modal.style.display = 'flex';
    };
    KnowledgeChampionsApp.prototype.hideRegistrationModal = function () {
        var modal = document.getElementById('registration-modal');
        if (modal)
            modal.style.display = 'none';
    };
    KnowledgeChampionsApp.prototype.showLoginModal = function () {
        var modal = document.getElementById('login-modal');
        if (modal)
            modal.style.display = 'flex';
    };
    KnowledgeChampionsApp.prototype.hideLoginModal = function () {
        var modal = document.getElementById('login-modal');
        if (modal)
            modal.style.display = 'none';
    };
    KnowledgeChampionsApp.prototype.showMainContent = function () {
        console.log('showMainContent chamado!'); // Adicione esta linha
        var welcomeScreen = document.getElementById('welcome-screen');
        var mainContent = document.getElementById('main-content');
        var logoutSection = document.getElementById('logout-section');

        console.log('Elementos:', { welcomeScreen, mainContent, logoutSection, currentUser: this.currentUser }); // E esta

        if (welcomeScreen && mainContent && logoutSection && this.currentUser) {
            welcomeScreen.style.display = 'none';
            mainContent.style.display = 'grid';
            logoutSection.style.display = 'block';
            this.render();
            console.log('Main content mostrado!'); // E esta
        }
    };
    KnowledgeChampionsApp.prototype.showWelcomeScreen = function () {
        var welcomeScreen = document.getElementById('welcome-screen');
        var mainContent = document.getElementById('main-content');
        var logoutSection = document.getElementById('logout-section');
        if (welcomeScreen && mainContent && logoutSection) {
            welcomeScreen.style.display = 'flex';
            mainContent.style.display = 'none';
            logoutSection.style.display = 'none';
            this.currentUser = null;
            localStorage.removeItem('last-user-email');
        }
    };
    KnowledgeChampionsApp.prototype.handleLoginSubmit = function (e) {
        e.preventDefault(); // Já tem esta linha
        e.stopPropagation(); // ADICIONE ESTA LINHA

        var form = e.target;
        var formData = new FormData(form);
        var email = formData.get('login-email');

        if (!email) {
            alert('Por favor, informe seu email!');
            return false; // ADICIONE return false
        }

        var user = this.users.find(function (u) { return u.email === email.trim(); });

        if (!user) {
            alert('Email não encontrado. Verifique o email ou crie uma nova conta.');
            return false; // ADICIONE return false
        }

        this.currentUser = user;
        this.hideLoginModal();
        this.showMainContent();

        localStorage.setItem('last-user-email', user.email);
        alert("Bem-vindo(a) de volta, ".concat(user.name, "!"));

        return false; // ADICIONE return false no final
    };
    KnowledgeChampionsApp.prototype.handleLogout = function () {
        if (confirm('Deseja realmente sair?')) {
            this.showWelcomeScreen();
        }
    };
    KnowledgeChampionsApp.prototype.handleRegistrationSubmit = function (e) {
        e.preventDefault();
        var form = e.target;
        var formData = new FormData(form);
        var name = formData.get('reg-name');
        var email = formData.get('reg-email');
        if (!name || !email) {
            alert('Por favor, preencha todos os campos!');
            return;
        }
        if (this.users.find(function (u) { return u.email === email; })) {
            alert('Este email já está cadastrado! Faça login em vez de criar nova conta.');
            return;
        }
        this.createUser(name, email);
        this.hideRegistrationModal();
        this.showMainContent();
        localStorage.setItem('last-user-email', email);
        alert("Bem-vindo(a), ".concat(name, "! Sua conta foi criada com sucesso."));
    };
    KnowledgeChampionsApp.prototype.createUser = function (name, email) {
        var newUser = {
            id: this.generateId(),
            name: name,
            email: email,
            points: 0,
            stars: 1,
            title: 'Novato do Conhecimento',
            titles: ['Iniciante'],
            presentations: []
        };
        this.users.push(newUser);
        this.currentUser = newUser;
        this.saveData();
        return newUser;
    };
    KnowledgeChampionsApp.prototype.handlePresentationSubmit = function (e) {
        e.preventDefault();
        if (!this.currentUser) {
            alert('Por favor, faça login primeiro.');
            return;
        }
        var form = e.target;
        var formData = new FormData(form);
        var topic = formData.get('topic');
        var description = formData.get('description');
        var date = formData.get('date');
        if (!topic || !description || !date) {
            alert('Por favor, preencha todos os campos!');
            return;
        }
        this.registerPresentation(this.currentUser.id, topic, description, date);
        this.render();
        form.reset();
        alert('Apresentação registrada com sucesso! +1 ponto para você!');
    };
    KnowledgeChampionsApp.prototype.registerPresentation = function (userId, topic, description, date) {
        var user = this.users.find(function (u) { return u.id === userId; });
        if (!user)
            return;
        var presentation = {
            id: this.generateId(),
            userId: userId,
            topic: topic,
            description: description,
            date: date,
            points: 1
        };
        user.presentations.push(presentation);
        user.points += 1;
        user.stars = this.calculateStars(user.points);
        user.title = this.calculateTitle(user.points);
        user.titles = this.calculateTitles(user.points);
        this.checkAchievements(user);
        this.saveData();
    };
    KnowledgeChampionsApp.prototype.calculateStars = function (points) {
        if (points >= 50)
            return 5;
        if (points >= 20)
            return 4;
        if (points >= 10)
            return 3;
        if (points >= 5)
            return 2;
        return 1;
    };
    KnowledgeChampionsApp.prototype.calculateTitle = function (points) {
        if (points >= 50)
            return 'Campeão do Conhecimento';
        if (points >= 20)
            return 'Especialista EY';
        if (points >= 10)
            return 'Mestre do Saber';
        if (points >= 5)
            return 'Apresentador Ativo';
        return 'Novato do Conhecimento';
    };
    KnowledgeChampionsApp.prototype.calculateTitles = function (points) {
        var titles = ['Iniciante'];
        if (points >= 1)
            titles.push('Primeiro Passo');
        if (points >= 5)
            titles.push('Compartilhador');
        if (points >= 10)
            titles.push('Mestre');
        if (points >= 20)
            titles.push('Especialista');
        if (points >= 50)
            titles.push('Lenda');
        return titles;
    };
    KnowledgeChampionsApp.prototype.checkAchievements = function (user) {
        this.achievements.forEach(function (achievement) {
            if (!achievement.achieved && user.points >= achievement.requiredPoints) {
                achievement.achieved = true;
            }
        });
        this.saveData();
    };
    KnowledgeChampionsApp.prototype.generateId = function () {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };
    KnowledgeChampionsApp.prototype.saveData = function () {
        var data = {
            users: this.users,
            achievements: this.achievements
        };
        localStorage.setItem(this.dataKey, JSON.stringify(data));
    };
    KnowledgeChampionsApp.prototype.render = function () {
        if (this.currentUser) {
            this.renderProfile();
            this.renderAchievements();
            this.renderRanking();
            this.renderPresentations();
        }
    };
    KnowledgeChampionsApp.prototype.renderProfile = function () {
        if (!this.currentUser)
            return;
        var avatarElement = document.getElementById('profile-avatar');
        var nameElement = document.getElementById('profile-name');
        var titleElement = document.getElementById('profile-title');
        var starsElement = document.getElementById('profile-stars');
        var pointsElement = document.getElementById('profile-points');
        var titlesElement = document.getElementById('profile-titles');
        var initials = this.currentUser.name.split(' ').map(function (word) { return word[0]; }).join('').toUpperCase().substring(0, 2);
        if (avatarElement)
            avatarElement.textContent = initials;
        if (nameElement)
            nameElement.textContent = this.currentUser.name;
        if (titleElement)
            titleElement.textContent = this.currentUser.title;
        if (starsElement)
            starsElement.textContent = this.repeatString('★', this.currentUser.stars) + this.repeatString('☆', 5 - this.currentUser.stars);
        if (pointsElement)
            pointsElement.textContent = "".concat(this.currentUser.points, " pontos");
        if (titlesElement) {
            titlesElement.innerHTML = this.currentUser.titles.map(function (title) { return "<span class=\"title-badge\">".concat(title, "</span>"); }).join('');
        }
    };
    KnowledgeChampionsApp.prototype.repeatString = function (str, count) {
        var result = '';
        for (var i = 0; i < count; i++) {
            result += str;
        }
        return result;
    };
    KnowledgeChampionsApp.prototype.renderAchievements = function () {
        var achievementsList = document.getElementById('achievements-list');
        if (!achievementsList)
            return;
        achievementsList.innerHTML = this.achievements.map(function (achievement) { return "\n            <div class=\"achievement ".concat(achievement.achieved ? 'achieved' : '', "\">\n                <div class=\"achievement-icon\">").concat(achievement.icon, "</div>\n                <div class=\"achievement-info\">\n                    <h4>").concat(achievement.name, "</h4>\n                    <p>").concat(achievement.description, "</p>\n                </div>\n            </div>\n        "); }).join('');
    };
    KnowledgeChampionsApp.prototype.renderRanking = function () {
        var _this = this;
        var rankingContent = document.getElementById('ranking-content');
        if (!rankingContent)
            return;
        var sortedUsers = __spreadArray([], this.users, true).sort(function (a, b) { return b.points - a.points; });
        if (sortedUsers.length === 0) {
            rankingContent.innerHTML = "\n                <div class=\"empty-state\">\n                    <div class=\"empty-icon\">\uD83C\uDFC6</div>\n                    <h3>Ainda n\u00E3o h\u00E1 participantes no ranking</h3>\n                    <p>Seja o primeiro a registrar uma apresenta\u00E7\u00E3o!</p>\n                </div>\n            ";
            return;
        }
        rankingContent.innerHTML = "\n            <table class=\"ranking-table\">\n                <thead>\n                    <tr>\n                        <th class=\"ranking-position\">#</th>\n                        <th>Participante</th>\n                        <th>Pontos</th>\n                        <th>T\u00EDtulo</th>\n                        <th>Estrelas</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    ".concat(sortedUsers.map(function (user, index) { return "\n                        <tr>\n                            <td class=\"ranking-position\">".concat(index + 1, "</td>\n                            <td>").concat(user.name, "</td>\n                            <td>").concat(user.points, "</td>\n                            <td>").concat(user.title, "</td>\n                            <td class=\"ranking-stars\">").concat(_this.repeatString('★', user.stars)).concat(_this.repeatString('☆', 5 - user.stars), "</td>\n                        </tr>\n                    "); }).join(''), "\n                </tbody>\n            </table>\n        ");
    };
    KnowledgeChampionsApp.prototype.renderPresentations = function () {
        var _this = this;
        var presentationsList = document.getElementById('presentations-list');
        if (!presentationsList || !this.currentUser)
            return;
        var userPresentations = this.currentUser.presentations;
        if (userPresentations.length === 0) {
            presentationsList.innerHTML = "\n                <div class=\"empty-state\">\n                    <div class=\"empty-icon\">\uD83D\uDCCA</div>\n                    <h3>Nenhuma apresenta\u00E7\u00E3o registrada ainda</h3>\n                    <p>Use o formul\u00E1rio ao lado para registrar sua primeira apresenta\u00E7\u00E3o!</p>\n                </div>\n            ";
            return;
        }
        var sortedPresentations = __spreadArray([], userPresentations, true).sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
        presentationsList.innerHTML = sortedPresentations.map(function (presentation) { return "\n            <div class=\"presentation-item\">\n                <div class=\"presentation-header\">\n                    <span class=\"presentation-date\">".concat(_this.formatDate(presentation.date), "</span>\n                    <span class=\"presentation-point\">+1 ponto</span>\n                </div>\n                <div class=\"presentation-topic\">").concat(presentation.topic, "</div>\n                <div class=\"presentation-description\">").concat(presentation.description, "</div>\n            </div>\n        "); }).join('');
    };
    KnowledgeChampionsApp.prototype.formatDate = function (dateString) {
        var date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };
    KnowledgeChampionsApp.prototype.initializeDefaultData = function () {
        this.achievements = this.getDefaultAchievements();
        this.users = [];
        this.saveData();
    };
    KnowledgeChampionsApp.prototype.getDefaultAchievements = function () {
        return [
            { id: 'first-presentation', name: 'Primeira Apresentação', description: 'Realize sua primeira apresentação', requiredPoints: 1, icon: '1', achieved: false },
            { id: 'beginner-presenter', name: 'Apresentador Iniciante', description: 'Realize 5 apresentações', requiredPoints: 5, icon: '5', achieved: false },
            { id: 'knowledge-master', name: 'Mestre do Conhecimento', description: 'Realize 10 apresentações', requiredPoints: 10, icon: '10', achieved: false },
            { id: 'presentation-expert', name: 'Especialista em Apresentações', description: 'Realize 20 apresentações', requiredPoints: 20, icon: '20', achieved: false },
            { id: 'knowledge-champion', name: 'Campeão do Conhecimento', description: 'Realize 50 apresentações', requiredPoints: 50, icon: '50', achieved: false }
        ];
    };
    return KnowledgeChampionsApp;
}());

window.app = new KnowledgeChampionsApp();
