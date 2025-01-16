"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hashfuntion = void 0;
const Hashfuntion = (size) => {
    const randomstring = "124kjjafkdlfj3jhsuqoipzpdp439927";
    const rslen = randomstring.length;
    let hashstring = "";
    for (let i = 0; i < size; i++) {
        hashstring += (Math.floor(Math.random() * rslen));
    }
    return hashstring;
};
exports.Hashfuntion = Hashfuntion;
