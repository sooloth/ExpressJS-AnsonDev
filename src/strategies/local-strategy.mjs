import passport  from "passport";
import { Strategy } from "passport-local";
import {User} from "../mongoose/schemas/user.js"
import { comparePassword } from "../utils/helper.js";
passport.serializeUser((user, done) => {
    console.log(`inside Serialize User`)
    console.log(user);
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    console.log(`inside Deserialize`);
    console.log(`Deserializing User ID: ${id}`);
    try {
        const findUser = await User.findById(id)
        if(!findUser) throw new Error("User Not Found");
        done(null, user)
    } catch (error) {
        done(err, null);
    }
})

export default passport.use(
    new Strategy(async (username, password, done) => {
        try {
           const findUser = await User.findOne({ username});
           if (!findUser) throw new Error("User not found");
           if (!comparePassword(password, findUser.password)) throw new Error("Invalid Credentials");
           done(null, findUser);
        } catch (error) {
            done(error, null)
        }
    })
)