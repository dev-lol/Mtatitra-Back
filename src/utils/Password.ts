export default class Password {
    static hash(password: String): Promise<string> {
        const bcrypt = require('bcrypt')
        return new Promise((resolve, reject) => {

            bcrypt.hash(password, Number(process.env.SALT), async (err, hash) => {
                if (err)
                    reject(err)
                else
                    resolve(hash)
            })
        })
    }
    static compare(password: String, password2: String): Promise<boolean> {
        const bcrypt = require('bcrypt')
        return new Promise((resolve, reject) => {

            bcrypt.compare(password, password2, (err, isSame) => {
                if (err)
                    reject(err)
                else
                    resolve(isSame)
            })
        })
    }
}