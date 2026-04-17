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
    success: boolean,
    message: string,
    data: any,
    timestamp: string,
}

export type JwtPayload = {
    id: string,
    exp: number,
}

export type Properties = {
    name: string,
    value: string,
}

export type Filter = {
    category: string,
    vehicle: string,
    stateId: number,
    cityId: number,
    microregionId: number,
    callByMicroregion: boolean,
    skip: number,
    limit: number,
}

export type Instructor = {
    userId: string,
    cloudinary_public_id: string,
    cloudinary_secure_url: string,
    cloudinary_asset_folder: string,
    cloudinary_timestamp: number,
    firstname: string,
    lastname: string,
    ddd: string,
    phone: string,
    cpf: string,
    cnpj: string,
    status: string,
    category: string,
    vehicle: string,
    description: string,
    state: string,
    stateId: number,
    city: string,
    cityId: number,
    microregionId: number,
    callByMicroregion: boolean,
    agree: boolean
}

export type Pagination = {
    pageNumber: number,
    pageSize: number,
    limit: number,
}

export type Price = {
    value: number,
}

export type User = {
    email: string,
    password: string,
    role: string,
}

export type CloudinaryImage = {
    public_id: string,
    secure_url: string,
    asset_folder: string,
    timestamp: number
}