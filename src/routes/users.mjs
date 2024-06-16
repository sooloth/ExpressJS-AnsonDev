import {Router} from 'express';
import {query, validationResult, checkSchema, matchedData} from 'express-validator';
import { mockUsers } from '../utils/constants.mjs';
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';
import { resolveIndexByUserById } from '../utils/middlewares.mjs';

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


router.post('/api/users', checkSchema(createUserValidationSchema), (req, res) => {
    console.log(req.body)
    const result = validationResult(req)
    console.log(result)

    if (!result.isEmpty())
        return res.status(400).send({ errors: result.array() })
    const data = matchedData(req)
    const newUser = { id: mockUsers[mockUsers.length -1].id + 1, ...data }; //increase new user id
    mockUsers.push(newUser)
    return res.status(201).send(newUser)
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

export default router;