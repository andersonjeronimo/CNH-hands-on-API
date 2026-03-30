export default class Price {
    _id?:string;
    value: number;    

    constructor(value: number) {
        this.value = value;
    }
}