app.use(express.json()) // use express.json()

//middleware
const loggingMiddleware = (req,res,next) => {
    console.log(`${req.method} - ${req.url}`) //check http method and url
    next();
}

//resolveIndexByUserById
const resolveIndexByUserById = (req, res, next) => {
    const {params: {id}} = req; // declare id as params from req 
    const parsedId = parseInt(id) // convert string to integer
    if (!isNaN(parsedId)) return res.sendStatus(400); // condition
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId)
    if(findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next();
}