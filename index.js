const express = require("express");
const Port = 3000;
const app = express();

const productRoutes = require('./routes/product_routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api', productRoutes);

app.listen(Port, () =>{
    console.log(`Server is running on port: ${Port}`);
})
