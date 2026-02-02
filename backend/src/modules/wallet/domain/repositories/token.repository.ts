export const TOKEN_REPOSITORY = Symbol('TOKEN_REPOSITORY');

export interface TokenRepository {
    saveToken(sessionId: string, token: string, ttlSeconds: number): Promise<void>;
    getToken(sessionId: string): Promise<{ token: string } | null>;
    validateToken(sessionId: string, token: string): Promise<boolean>;
    deleteToken(sessionId: string): Promise<void>;
}

