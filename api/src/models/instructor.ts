export default class Instructor {
    firstname: string;
    lastname: string;
    email: string;
    ddd: string;
    phone: string;
    cpf: string;
    cnpj: string;
    status: string;
    category: string;
    vehicle: string;
    description: string;
    state: string;
    stateId: number;
    city: string;
    cityId: number;
    microregionId: number;
    callByMicroregion: boolean;
    agree: boolean;

    constructor(firstname: string, lastname: string, email: string, ddd: string, phone: string, cpf: string, cnpj:string, status: string, category: string, vehicle: string, description: string,
        state: string,
        stateId: number,
        city: string,
        cityId: number,
        microregionId: number,
        callByMicroregion: boolean,
        agree: boolean
    ) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.ddd = ddd;
        this.phone = phone;
        this.cpf = cpf;
        this.cnpj = cnpj;
        this.status = status;
        this.category = category;
        this.vehicle = vehicle;
        this.description = description;
        this.state = state;
        this.stateId = stateId;
        this.city = city;
        this.cityId = cityId;
        this.microregionId = microregionId;
        this.callByMicroregion = callByMicroregion;
        this.agree = agree;
    }
}