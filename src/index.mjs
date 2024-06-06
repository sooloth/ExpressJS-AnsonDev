import express from 'express'
import {
    query, 
    validationResult, 
    body, 
    matchedData, 
    checkSchema 
} from 'express-validator'
import {createUserValidationSchema} from './utils/validationSchemas.mjs'

const app = express();

app.use(express.json())
const PORT = process.env.PORT || 3000;

// middleware 
const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
}

const resolveIndexByUserById = (req, res, next) => {
    const {
        params: { id }} = req;

    const parsedID = parseInt(id);
    if (isNaN(parsedID)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedID);
    if (findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next();
}

const mockUsers = [
    {id: 1, username: "sooloth", displayname: "SCH"},
    {id: 2, username: "john", displayname: "SVI"},
    {id: 3, username: "dev", displayname: "VIS"},
    {id: 4, username: "david", displayname: "Tiger"},
    {id: 5, username: "sumo", displayname: "jacket"},
    {id: 6, username: "hammer", displayname: "VANH"},
]

app.get('/',
    (req, res, next) => {
        console.log("Base URL1");
        next();
    },
    (req, res, next) => {
        console.log("Base URL2");
        next();
    },
    (req, res, next) => {
        console.log("Base URL3");
        next();
    },
    (req, res) => {
    res.status(201).send({ msg: "hello world"})
})

// // get request user request to get something from server
// ====================================================================
app.get('/api/users', 
    query('filter')
    .isString()
    .notEmpty()
    .withMessage('must not be empty')
    .isLength({ min: 3, max: 10 })
    .withMessage('Must be at least 3-10 characters'),
     (req, res) => {  
//query params
    const result = validationResult(req)
    console.log(result)
    const {query: { filter, value }} = req;
    //when filter and value are undefined
    if(filter && value) return res.send(
        mockUsers.filter((user) => user[filter].includes(value))
    )
    return res.send(mockUsers)
})

app.get("/api/products", (req, res) => {
    res.send([{id: 123, name: "chicken", price: 12.99}])
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// ======================================================================
// route params 
// ======================================================================
app.get('/api/users/:id', resolveIndexByUserById, (req, res) => {
    const {findUserIndex} = req;
    const findUser = mockUsers[findUserIndex]
    if(!findUser) return res.status(404)
    return res.send(findUser)
})

// =======================================================================
app.use(loggingMiddleware)

app.post('/api/users', checkSchema(createUserValidationSchema), (req, res) => {
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

// ========================================================================
app.put("/api/users/:id", resolveIndexByUserById,(req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return res.sendStatus(200);
})

app.patch('/api/users/:id', resolveIndexByUserById,(req, res) => {
    const {body, findUserIndex} = req;
    
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return res.sendStatus(200)
})

app.delete('/api/users/:id', resolveIndexByUserById ,(req, res) => {
    const {findUserIndex} = req;
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200)
})

