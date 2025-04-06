'use client';


// Interface que descreve os dados de autenticação esperados (observe que pode haver divergências com o objeto salvo)
interface AuthData {
    token: string;                // Token de acesso
    tokenType: string;            // Tipo do token, por exemplo, "Bearer"
    userId: string;               // ID do usuário
    usuarioEmail: string;         // E-mail do usuário
    usuarioRoles: string[];       // Lista de roles do usuário
    authTokenExpiresIn: number;   // Timestamp de expiração do token (em segundos)
}

export class AuthTokenService {
    // Constantes definindo os papéis (roles) dos usuários
    public static readonly ROLE_ADMIN: string = "administrador";
    public static readonly ROLE_GESTOR: string = "gestor";
    public static readonly ROLE_TECNICO: string = "tecnico";
    public static readonly ROLE_PROFESSOR: string = "professor";
    public static readonly ROLE_ALUNO: string = "aluno";
    public static readonly ROLE_VISITANTE: string = "visitante";

    /**
     * Obtém os dados de autenticação armazenados no localStorage.
     * Caso os dados não existam ou haja erro no parsing, redireciona para o login (se solicitado).
     */
    private static getAuthenticationData(redirectToLogin: boolean = true): any {
        // Verifica se o código está sendo executado no browser
        if (typeof window === 'undefined')
            return null;

        // Tenta recuperar a string armazenada na chave "sgu_authenticated_user"
        const data = localStorage.getItem("sgu_authenticated_user");

        if (data) {
            try {
                // Retorna o objeto JSON parseado
                return JSON.parse(data);
            }
            catch (error) {
                console.error("Erro ao fazer parsing do JSON:", error);
            }
        }

        // Se não houver dados ou ocorrer erro e redirect estiver habilitado, redireciona para o login
        if (redirectToLogin)
            this.redirectToLogin();

        return null;
    }

    /**
     * Retorna o valor do cookie armazenado nos dados de autenticação, se existir.
     */
    public static getCookie(redirectToLogin: boolean = true): string | null {
        const data = this.getAuthenticationData(redirectToLogin);
        return data?.cookie ?? null;
    }

    public static getAccessToken(redirectToLogin: boolean = true): string | null {
        // Recupera os dados de autenticação do localStorage
        const data = this.getAuthenticationData(redirectToLogin);

        if (data === null) {
            if (redirectToLogin) this.redirectToLogin();
            return null;
        }

        // Corrigido: extrai diretamente 'token' e 'authTokenExpiresIn'
        const { token, authTokenExpiresIn } = data;

        // Se não houver token ou expiração definida, redireciona para o login
        if (!token || !authTokenExpiresIn) {
            if (redirectToLogin) this.redirectToLogin();
            return null;
        }

        // Obtém o tempo atual em segundos
        const currentTime = Date.now() / 1000;

        // Verifica se o token expirou
        if (authTokenExpiresIn < currentTime) {
            if (redirectToLogin) this.redirectToLogin();
            return null;
        }

        return token;
    }


    /**
     * Retorna o objeto de autenticação completo (neste caso, esperado em data.authToken).
     * Se o objeto salvo tiver a propriedade "token" ao invés de "authToken", essa função também precisará ser ajustada.
     */
    public static getAuthToken(redirectToLogin: boolean = true): string | null {
        const data = this.getAuthenticationData(redirectToLogin);

        // Verifica se a propriedade authToken existe (novamente, pode ser "token" no seu caso)
        if (data !== null && data.authToken !== null)
            return data.authToken;

        if (redirectToLogin)
            this.redirectToLogin();

        return null;
    }

    /**
     * Calcula o tempo restante (em segundos) para o token expirar.
     */
    public static getAuthTokenExpiresIn(redirectToLogin: boolean = true) {
        const data = this.getAuthenticationData(redirectToLogin);

        if (data !== null) {
            const expires_in = data.authTokenExpiresIn;
            const currentTime = Date.now() / 1000;

            return Math.floor((expires_in - currentTime));
        }

        if (redirectToLogin)
            this.redirectToLogin();

        return null;
    }

    /**
     * Retorna o e-mail do usuário logado.
     */
    public static getUsuarioLogado(redirectToLogin: boolean = true): string | null {
        const data = this.getAuthenticationData(redirectToLogin);
        return data ? data.usuarioEmail : null;
    }

    /**
     * Retorna o e-mail do usuário (idem ao anterior).
     */
    public static getUsuarioEmail(redirectToLogin: boolean = true): string | null {
        const data = this.getAuthenticationData(redirectToLogin);
        return data ? (data.usuarioEmail as string) : null;
    }

    /**
     * Retorna a lista de roles do usuário.
     */
    public static getUsuarioRoles(redirectToLogin: boolean = true): string[] | null {
        const data = this.getAuthenticationData(redirectToLogin);
        if (data && Array.isArray(data.roles)) {
            return data.roles as string[];
        }
        return null;
    }

    /**
     * Verifica se o usuário possui o role de Administrador.
     */
    public static isAdmin(redirectToLogin: boolean = true): boolean {
        const roles = this.getUsuarioRoles(redirectToLogin);
        return roles ? roles.includes(AuthTokenService.ROLE_ADMIN) : false;
    }

    /**
     * Verifica se o usuário é Gestor.
     */
    public static isGestor(redirectToLogin: boolean = true): boolean {
        const roles = this.getUsuarioRoles(redirectToLogin);
        return roles ? roles.includes(AuthTokenService.ROLE_GESTOR) : false;
    }

    /**
     * Verifica se o usuário é Técnico.
     */
    public static isTecnico(redirectToLogin: boolean = true): boolean {
        const roles = this.getUsuarioRoles(redirectToLogin);
        return roles ? roles.includes(AuthTokenService.ROLE_TECNICO) : false;
    }
    /**
         * Verifica se o usuário é um Aluno.
         */
    public static isProfessor(redirectToLogin: boolean = true): boolean {
        const roles = this.getUsuarioRoles(redirectToLogin);
        return roles ? roles.includes(AuthTokenService.ROLE_PROFESSOR) : false;
    }
    /**
     * Verifica se o usuário é um Aluno.
     */
    public static isAluno(redirectToLogin: boolean = true): boolean {
        const roles = this.getUsuarioRoles(redirectToLogin);
        return roles ? roles.includes(AuthTokenService.ROLE_ALUNO) : false;
    }
    /**
        * Verifica se o usuário é um visitante.
        */
    public static isVisitante(redirectToLogin: boolean = true): boolean {
        const roles = this.getUsuarioRoles(redirectToLogin);
        return roles ? roles.includes(AuthTokenService.ROLE_VISITANTE) : false;
    }

    /**
     * Verifica se o usuário possui uma role específica.
     * Atenção: Aqui o código usa "data.usuarioRole", mas na maioria dos casos a propriedade é "usuarioRoles" (plural).
     * Verifique se a estrutura dos dados está correta.
     */
    public static isRole(role: string, redirectToLogin: boolean = true): boolean {
        const data = this.getAuthenticationData(redirectToLogin);

        if (data) {
            // Possível problema: data.usuarioRole pode não existir ou ser um array.
            // Talvez o correto seja data.usuarioRoles.includes(role)
            return data.usuarioRole.includes(role);
        }

        return false;
    }

    /**
     * Verifica se o usuário está autenticado.
     * Se não estiver, redireciona para a página de login (se redirectToLogin for true).
     */
    public static isAuthenticated(redirectToLogin: boolean = true): boolean {
        const accessToken = this.getAccessToken(redirectToLogin);
        const isLoggedIn = !!accessToken;

        if (!isLoggedIn && redirectToLogin)
            this.redirectToLogin();

        return isLoggedIn;
    }

    /**
     * Remove os dados de autenticação e redireciona para a página de login.
     */
    public static redirectToLogin(redirectUrl: string = '/login'): void {

        try {
            // Remove os dados de autenticação do localStorage
            localStorage.removeItem("sgu_authenticated_user");
            // Redireciona para a URL especificada (padrão '/login')
            window.location.href = redirectUrl;
        }
        catch (error) {
            console.error('Falha ao redirecionar para login:', error);
        }
    }
}

export default AuthTokenService;
