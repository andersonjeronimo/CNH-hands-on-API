export enum Status {
    Ativo = "Ativo",
    Inativo = "Inativo",
    Pausado = "Pausado"
}

export enum Category {
    A = "A",
    B = "B",
    AB = "A e B"
}

export enum Vehicle {
    Aluno = "Aluno",
    Instrutor = "Instrutor",
    Ambos = "Combinar"
}

export type ResponseDefault = {
    success: boolean;
    message: string;
    data: {};
    timestamp: string;
}

export type JwtPayload = {
    id: string;
    exp: number;
}

export type Properties = {
    name: string;
    value: string;
}

export type Filter = {
    category: string;
    vehicle: string;
    stateId: number;
    cityId: number;
    microregionId: number;
    callByMicroregion: boolean;
    skip: number;
    limit: number;
}