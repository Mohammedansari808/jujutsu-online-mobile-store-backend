
import jwt from "jsonwebtoken"
export const otauth = (request, response, next) => {
    const token = request.header("ot-auth-token")
    jwt.verify(token, process.env.OTTN, (err, decoded) => {
        if (err) {
            console.error(err)
        } else if (decoded.used) {
            console.error("token is already used")
        } else {
            console.log("token used successfully")
            jwt.sign({ name: "my_key", used: true }, process.env.OTTN, (err, newToken) => {
                console.log("token marked as used", newToken)
            })
            next()
        }
    })
}