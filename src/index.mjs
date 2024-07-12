import express from 'express'
import routes from './routes/index.mjs'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import './strategies/local-strategy.mjs'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';


const app = express();

mongoose.connect("mongodb://localhost/express_tutorial")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err))


app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("helloworld"))
app.use(session({
    secret: 'sooloth the dev',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
        httpOnly: true,
        secure: true,
    }
}))

app.use(passport.initialize())
app.use(passport.session());
app.use(routes)

app.post('/api/auth', passport.authenticate("local"),  (req, res) => {
    console.log(req.user);
    console.log(req.body);
    res.sendStatus(200);
})

// app.get('/api/auth/status', function(req, res, next) {
//     /* look at the 2nd parameter to the below call */
//     passport.authenticate('local', function(err, user, info) {
//       if (err) { return next(err); }
//       if (!user) { return res.redirect('/'); }
//       req.logIn(user, function(err) {
//         if (err) { return next(err); }
//         return res.redirect('/users/' + user.username);
//       });
//     })(req, res, next);
//   });

app.get('/api/auth/status', ( req, res, next) => {
    console.log(`inside /auth/status endpoint`)
    console.log(req.body.user);
    console.log(req.session)
    return req.user ? res.send(req.user) : res.sendStatus(401);
})

app.post('/api/auth/logout', (req, res) => {
    if(!req.user) return res.sendStatus(401);

    req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.send(200)
    })
})

const PORT = process.env.PORT || 3000;





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});




