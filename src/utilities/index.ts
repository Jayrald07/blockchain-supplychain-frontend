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
    ACCEPT = 'ACCEPT',
    TRANSFER_NOW = 'TRANSFER_NOW',
    OWN_ASSET = 'OWN_ASSET',
    UPDATE_ASSET = 'UPDATE_ASSET',
    REMOVE_ASSET = 'REMOVE_ASSET',
    CANCEL = 'CANCEL',
    PDF = 'PDF',
    RETURN = 'RETURN',
    PULL = 'PULL',
    REJECT = 'REJECT'
}

export interface HttpResposne {
    message: string
    details: HttpResposne | any,

}

export const validateAndReturn = (httpResponse: HttpResposne | any): any => {
    if (Object.keys(httpResponse).includes("details")) {
        if (typeof httpResponse.details !== "string") {
            return validateAndReturn(httpResponse.details)
        } else {
            return httpResponse;
        }
    } else {
        return httpResponse;
    }
}