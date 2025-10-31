interface User {
    id: string;
    name: string;
    email: string;
    points: number;
    stars: number;
    title: string;
    titles: string[];
    presentations: Presentation[];
}

interface Presentation {
    id: string;
    userId: string;
    topic: string;
    description: string;
    date: string;
    points: number;
}

interface Achievement {
    id: string;
    name: string;
    description: string;
    requiredPoints: number;
    icon: string;
    achieved: boolean;
}

class KnowledgeChampionsApp {
    private users: User[] = [];
    private currentUser: User | null = null;
    private achievements: Achievement[] = [];
    private dataKey = 'knowledge-champions-data'; 

    constructor() {
        this.init();
    }

    private init(): void {
        this.loadData();
        this.setupEventListeners();
        this.checkAutoLogin();
    }

    private loadData(): void {
        const savedData = localStorage.getItem(this.dataKey);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                this.users = data.users || [];
                this.achievements = data.achievements || this.getDefaultAchievements();
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                this.initializeDefaultData();
            }
        } else {
            this.initializeDefaultData();
        }
    }

    private setupEventListeners(): void {
        // Login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.addEventListener('click', () => this.showLoginModal());
        }

        // Registration button
        const startButton = document.getElementById('start-registration');
        if (startButton) {
            startButton.addEventListener('click', () => this.showRegistrationModal());
        }

        // Forms
        const registrationForm = document.getElementById('registration-form');
        if (registrationForm) {
            registrationForm.addEventListener('submit', (e) => this.handleRegistrationSubmit(e));
        }

        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));
        }

        const presentationForm = document.getElementById('presentation-form');
        if (presentationForm) {
            presentationForm.addEventListener('submit', (e) => this.handlePresentationSubmit(e));
        }

        // Navigation between modals
        const goToLogin = document.getElementById('go-to-login');
        if (goToLogin) {
            goToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideRegistrationModal();
                this.showLoginModal();
            });
        }

        const goToRegister = document.getElementById('go-to-register');
        if (goToRegister) {
            goToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideLoginModal();
                this.showRegistrationModal();
            });
        }

        // Logout button
        const logoutButton = document.getElementById('logout-btn');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => this.handleLogout());
        }
    }

    private checkAutoLogin(): void {
        const lastUserEmail = localStorage.getItem('last-user-email');
        if (lastUserEmail) {
            const user = this.users.filter(u => u.email === lastUserEmail)[0];
            if (user) {
                this.currentUser = user;
                this.showMainContent();
            }
        }
    }

    private showRegistrationModal(): void {
        const modal = document.getElementById('registration-modal');
        if (modal) modal.style.display = 'flex';
    }

    private hideRegistrationModal(): void {
        const modal = document.getElementById('registration-modal');
        if (modal) modal.style.display = 'none';
    }

    private showLoginModal(): void {
        const modal = document.getElementById('login-modal');
        if (modal) modal.style.display = 'flex';
    }

    private hideLoginModal(): void {
        const modal = document.getElementById('login-modal');
        if (modal) modal.style.display = 'none';
    }

    private showMainContent(): void {
        const welcomeScreen = document.getElementById('welcome-screen');
        const mainContent = document.getElementById('main-content');
        const logoutSection = document.getElementById('logout-section');
        
        if (welcomeScreen && mainContent && logoutSection && this.currentUser) {
            welcomeScreen.style.display = 'none';
            mainContent.style.display = 'grid';
            logoutSection.style.display = 'block';
            this.render();
        }
    }

    private showWelcomeScreen(): void {
        const welcomeScreen = document.getElementById('welcome-screen');
        const mainContent = document.getElementById('main-content');
        const logoutSection = document.getElementById('logout-section');
        
        if (welcomeScreen && mainContent && logoutSection) {
            welcomeScreen.style.display = 'flex';
            mainContent.style.display = 'none';
            logoutSection.style.display = 'none';
            this.currentUser = null;
            localStorage.removeItem('last-user-email');
        }
    }

    private handleLoginSubmit(e: Event): void {
        e.preventDefault();
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const email = formData.get('login-email') as string;

        if (!email) {
            alert('Por favor, informe seu email!');
            return;
        }

        const user = this.users.find(u => u.email === email.trim());
        
        if (!user) {
            alert('Email não encontrado. Verifique o email ou crie uma nova conta.');
            return;
        }

        this.currentUser = user;
        this.hideLoginModal();
        this.showMainContent();

        localStorage.setItem('last-user-email', user.email);
        alert(`Bem-vindo(a) de volta, ${user.name}!`);
    }

    private handleLogout(): void {
        if (confirm('Deseja realmente sair?')) {
            this.showWelcomeScreen();
        }
    }

    private handleRegistrationSubmit(e: Event): void {
        e.preventDefault();
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const name = formData.get('reg-name') as string;
        const email = formData.get('reg-email') as string;

        if (!name || !email) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (this.users.find(u => u.email === email)) {
            alert('Este email já está cadastrado! Faça login em vez de criar nova conta.');
            return;
        }

        this.createUser(name, email);
        this.hideRegistrationModal();
        this.showMainContent();

        localStorage.setItem('last-user-email', email);
        alert(`Bem-vindo(a), ${name}! Sua conta foi criada com sucesso.`);
    }

    private createUser(name: string, email: string): User {
        const newUser: User = {
            id: this.generateId(),
            name,
            email,
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
    }

    private handlePresentationSubmit(e: Event): void {
        e.preventDefault();
        
        if (!this.currentUser) {
            alert('Por favor, faça login primeiro.');
            return;
        }
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const topic = formData.get('topic') as string;
        const description = formData.get('description') as string;
        const date = formData.get('date') as string;

        if (!topic || !description || !date) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        this.registerPresentation(this.currentUser.id, topic, description, date);
        this.render();
        form.reset();

        alert('Apresentação registrada com sucesso! +1 ponto para você!');
    }

    private registerPresentation(userId: string, topic: string, description: string, date: string): void {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const presentation: Presentation = {
            id: this.generateId(),
            userId,
            topic,
            description,
            date,
            points: 1
        };

        user.presentations.push(presentation);
        user.points += 1;
        
        user.stars = this.calculateStars(user.points);
        user.title = this.calculateTitle(user.points);
        user.titles = this.calculateTitles(user.points);

        this.checkAchievements(user);
        this.saveData();
    }

    private calculateStars(points: number): number {
        if (points >= 50) return 5;
        if (points >= 20) return 4;
        if (points >= 10) return 3;
        if (points >= 5) return 2;
        return 1;
    }

    private calculateTitle(points: number): string {
        if (points >= 50) return 'Campeão do Conhecimento';
        if (points >= 20) return 'Especialista EY';
        if (points >= 10) return 'Mestre do Saber';
        if (points >= 5) return 'Apresentador Ativo';
        return 'Novato do Conhecimento';
    }

    private calculateTitles(points: number): string[] {
        const titles = ['Iniciante'];
        if (points >= 1) titles.push('Primeiro Passo');
        if (points >= 5) titles.push('Compartilhador');
        if (points >= 10) titles.push('Mestre');
        if (points >= 20) titles.push('Especialista');
        if (points >= 50) titles.push('Lenda');
        return titles;
    }

    private checkAchievements(user: User): void {
        this.achievements.forEach(achievement => {
            if (!achievement.achieved && user.points >= achievement.requiredPoints) {
                achievement.achieved = true;
            }
        });
        this.saveData();
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    private saveData(): void {
        const data = {
            users: this.users,
            achievements: this.achievements
        };
        localStorage.setItem(this.dataKey, JSON.stringify(data));
    }

    private render(): void {
        if (this.currentUser) {
            this.renderProfile();
            this.renderAchievements();
            this.renderRanking();
            this.renderPresentations();
        }
    }

    private renderProfile(): void {
        if (!this.currentUser) return;

        const avatarElement = document.getElementById('profile-avatar');
        const nameElement = document.getElementById('profile-name');
        const titleElement = document.getElementById('profile-title');
        const starsElement = document.getElementById('profile-stars');
        const pointsElement = document.getElementById('profile-points');
        const titlesElement = document.getElementById('profile-titles');

        const initials = this.currentUser.name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);

        if (avatarElement) avatarElement.textContent = initials;
        if (nameElement) nameElement.textContent = this.currentUser.name;
        if (titleElement) titleElement.textContent = this.currentUser.title;
        if (starsElement) starsElement.textContent = this.repeatString('★', this.currentUser.stars) + this.repeatString('☆', 5 - this.currentUser.stars);
        if (pointsElement) pointsElement.textContent = `${this.currentUser.points} pontos`;
        if (titlesElement) {
            titlesElement.innerHTML = this.currentUser.titles.map(title => `<span class="title-badge">${title}</span>`).join('');
        }
    }

    private repeatString(str: string, count: number): string {
        let result = '';
        for (let i = 0; i < count; i++) {
            result += str;
        }
        return result;
    }

    private renderAchievements(): void {
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList) return;

        achievementsList.innerHTML = this.achievements.map(achievement => `
            <div class="achievement ${achievement.achieved ? 'achieved' : ''}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `).join('');
    }

    private renderRanking(): void {
        const rankingContent = document.getElementById('ranking-content');
        if (!rankingContent) return;

        const sortedUsers = [...this.users].sort((a, b) => b.points - a.points);

        if (sortedUsers.length === 0) {
            rankingContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🏆</div>
                    <h3>Ainda não há participantes no ranking</h3>
                    <p>Seja o primeiro a registrar uma apresentação!</p>
                </div>
            `;
            return;
        }

        rankingContent.innerHTML = `
            <table class="ranking-table">
                <thead>
                    <tr>
                        <th class="ranking-position">#</th>
                        <th>Participante</th>
                        <th>Pontos</th>
                        <th>Título</th>
                        <th>Estrelas</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedUsers.map((user, index) => `
                        <tr>
                            <td class="ranking-position">${index + 1}</td>
                            <td>${user.name}</td>
                            <td>${user.points}</td>
                            <td>${user.title}</td>
                            <td class="ranking-stars">${this.repeatString('★', user.stars)}${this.repeatString('☆', 5 - user.stars)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    private renderPresentations(): void {
        const presentationsList = document.getElementById('presentations-list');
        if (!presentationsList || !this.currentUser) return;

        const userPresentations = this.currentUser.presentations;

        if (userPresentations.length === 0) {
            presentationsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <h3>Nenhuma apresentação registrada ainda</h3>
                    <p>Use o formulário ao lado para registrar sua primeira apresentação!</p>
                </div>
            `;
            return;
        }

        const sortedPresentations = [...userPresentations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        presentationsList.innerHTML = sortedPresentations.map(presentation => `
            <div class="presentation-item">
                <div class="presentation-header">
                    <span class="presentation-date">${this.formatDate(presentation.date)}</span>
                    <span class="presentation-point">+1 ponto</span>
                </div>
                <div class="presentation-topic">${presentation.topic}</div>
                <div class="presentation-description">${presentation.description}</div>
            </div>
        `).join('');
    }

    private formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    private initializeDefaultData(): void {
        this.achievements = this.getDefaultAchievements();
        this.users = [];
        this.saveData();
    }

    private getDefaultAchievements(): Achievement[] {
        return [
            { id: 'first-presentation', name: 'Primeira Apresentação', description: 'Realize sua primeira apresentação', requiredPoints: 1, icon: '1', achieved: false },
            { id: 'beginner-presenter', name: 'Apresentador Iniciante', description: 'Realize 5 apresentações', requiredPoints: 5, icon: '5', achieved: false },
            { id: 'knowledge-master', name: 'Mestre do Conhecimento', description: 'Realize 10 apresentações', requiredPoints: 10, icon: '10', achieved: false },
            { id: 'presentation-expert', name: 'Especialista em Apresentações', description: 'Realize 20 apresentações', requiredPoints: 20, icon: '20', achieved: false },
            { id: 'knowledge-champion', name: 'Campeão do Conhecimento', description: 'Realize 50 apresentações', requiredPoints: 50, icon: '50', achieved: false }
        ];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new KnowledgeChampionsApp();
});