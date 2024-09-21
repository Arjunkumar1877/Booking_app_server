import jwt from 'jsonwebtoken';


export const jwtSign = (id: string)=>{
    try {
        const token = jwt.sign({userId: id}, 'secret-key' as string, { expiresIn: '1d'})

        return token;

    } catch (error) {
        console.log(error)
    }
}



