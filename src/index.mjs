import express from 'express'
import routes from './routes/index.mjs'


const app = express();

app.use(express.json())
app.use(routes)


const PORT = process.env.PORT || 3000;

app.get("/api/products", (req, res) => {
    res.send([{id: 123, name: "chicken", price: 12.99}])
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});




