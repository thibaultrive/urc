export class CustomError extends Error {

    code?: string;
    httpStatus?: number;

    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, CustomError.prototype);
    }

}