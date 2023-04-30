export const {
    VITE_BACKEND_API_HOST: host,
    VITE_BACKEND_API_PORT: port
} = import.meta.env;

export enum Action {
    CREATE = 'CREATE',
    ASSETS = 'ASSETS',
    READ = 'READ',
    LOGS = 'LOGS',
    TRANSACTIONS = 'READ_COLLECTION',
    TRANSFER = 'TRANSFER',
    ACCEPT = 'ACCEPT'
}

export interface HttpResposne {
    message: string
    details: HttpResposne | any,

}

export const validateAndReturn = (httpResponse: HttpResposne | any): any => {
    if (Object.keys(httpResponse).includes("details")) {
        return validateAndReturn(httpResponse.details)
    } else {
        return httpResponse;
    }
}