
export interface SaasProvider {
    name: string;
    authenticate(): Promise<void>;
    getEntity(entityType: string, id: string): Promise<any>;
    listEntities(entityType: string, filters: any): Promise<any[]>;
}
