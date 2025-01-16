export const Hashfuntion = (size:number) => {
    const randomstring = "124kjjafkdlfj3jhsuqoipzpdp439927"
    const rslen = randomstring.length;
    let hashstring = "";
    for (let i = 0; i < size; i++) {
        hashstring += (Math.floor(Math.random() * rslen));
    }
    return hashstring;
}