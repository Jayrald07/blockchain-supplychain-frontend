export const {
    VITE_BACKEND_API_HOST: host,
    VITE_BACKEND_API_PORT: port
} = import.meta.env;

export enum Action {
    CREATE = 'CREATE',
    ASSETS = 'ASSETS'
}