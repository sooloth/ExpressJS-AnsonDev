import {Router} from 'express';
import {query, validationResult, checkSchema, matchedData} from 'express-validator';
import { mockUsers } from '../utils/constants.mjs';
import { resolveIndexByUserById } from '../utils/middlewares.mjs';
import { User } from '../mongoose/schemas/user.js';
import {createUserValidationSchema} from '../utils/validationSchemas.mjs';
import { hashedpassword } from '../utils/helper.js';

const router = Router();

router.get("/api/users", 
query('filter')
    .isString()
    .notEmpty()
    .withMessage('must not be empty')
    .isLength({ min: 3, max: 10 })
    .withMessage('Must be at least 3-10 characters'),
 (req, res) => {  
    console.log(req.session.id)
    req.sessionStore.get(req.session.id, (err, sessionData) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(sessionData)
    })
    //query params
    const result = validationResult(req)
    console.log(result)
    const {query: { filter, value }} = req;
    //when filter and value are undefined
        if(filter && value) return res.send(
        mockUsers.filter((user) => user[filter].includes(value))
        );  
    return res.send(mockUsers)
})

router.get('/api/users/:id', resolveIndexByUserById, (req, res) => {
    const {findUserIndex} = req;
    const findUser = mockUsers[findUserIndex]
    if(!findUser) return res.status(404)
    return res.send(findUser)
})


router.post('/api/users', checkSchema(createUserValidationSchema), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());
    const data = matchedData(req);
    console.log(data);
    data.password = hashedpassword(data.password)
    console.log(data)
    const newUser = new User(data);
    try {
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
})

router.put("/api/users/:id", resolveIndexByUserById,(req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return res.sendStatus(200);
})

router.patch('/api/users/:id', resolveIndexByUserById,(req, res) => {
    const {body, findUserIndex} = req;
    
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return res.sendStatus(200)
})

router.delete('/api/users/:id', resolveIndexByUserById ,(req, res) => {
    const {findUserIndex} = req;
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200)
})

router.get("/", (req, res) => {
    console.log(req.session)
    console.log(req.session.id)
    req.session.visited = true;
    res.cookie('hello','world', { maxAge: 30000,  signed: true})
    res.status(201).send({ msg: "Hello"})
})

// router.post('/api/auth', (req, res) => {
//     console.log(req.body);
//     const {username, password} = req.body;
//     console.log(username, password);
//     const findUser = mockUsers.find((user) =>user.username === username);
//     console.log(findUser)
//     if (!findUser || findUser.password !== password) return res.status(401).send({ msg: 'BAD CREDENTIALS'});

//     req.session.user = findUser;
//     return res.status(200).send(findUser);
// })

// router.get('/api/auth/status', (req, res) => {
//     req.sessionStore.get(req.sessionID, (err, session) => {
//         console.log(session)
//     })
//     return req.session.user
//     ? res.status(200).send(req.session.user) 
//     : res.status(401).send({ msg: 'Not Authenticated'})
// })
// router.get('/api/auth/status', (req, res) => {
//     req.sessionStore.get(req.sessionID, (err, session) => {
//         if (err) {
//             console.error('Session retrieval error:', err);
//             return res.status(500).send({ msg: 'Internal Server Error' });
//         }
//         console.log('Session data:', req.session);
        
//         if (req.session.user) {
//             res.status(200).send(req.session.user);
//         } else {
//             res.status(401).send({ msg: 'Not Authenticated' });
//         }
//     });
// });

router.post('/api/cart', (req, res) => {
    if (!req.session.user) return res.status(401)
    const {body: item} = req;
    const { cart } = req.session;
    if (cart) {
    
    cart.push(item)
    } 
    else {
        req.session.cart = [item];
    }
    return res.status(201).send(item)
})

router.get('/api/cart', (req, res) => {
    if (!req.session.user) return res.sendStatus(401)
        return res.status(200).send(req.session.cart ?? []);
})

export default router;