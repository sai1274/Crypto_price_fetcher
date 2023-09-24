import express from "express";
import axios from "axios"; 

const app = express();
const port = 3000;
const baseURL = 'https://api.coingecko.com/api/v3';
var coinsListResponse;
var cmpResponse;

app.use(express.static("public"))
app.use(express.urlencoded({extended : true}))

app.get("/", async (req, res) => {
    try {
        const pingResponse = await axios.get(baseURL + "/ping"); // Ping check
        
        coinsListResponse = await axios.get(baseURL + '/coins/list'); // Fetching the list of coins

        cmpResponse = await axios.get(baseURL + '/simple/supported_vs_currencies'); // Fetching the list of available currencies for comparison

        res.render("index.ejs", {
            coins_list: (coinsListResponse.data),
            vs_currencies: (cmpResponse.data)
        });

    } catch (error) {
        console.log(error.response);
    }
});

app.get("/categories", async (req,res)=>{
    try{
        const response = await axios.get(baseURL+"/coins/categories/list");
        res.render("categories.ejs",{
            content : response.data
        })

    }catch(error){
        console.log(error.response.data)
    }
})

app.post("/",async (req,res)=>{
    try{
        const fetch_price = await axios.get(baseURL+`/simple/price?ids=${req.body.ids}&vs_currencies=${req.body.vs_currencies}`);
        const img_path = await axios.get(baseURL+`/search?query=${req.body.ids}`);
        if(img_path.data["coins"].length === 0){
            res.render("index.ejs", {
                coins_list: (coinsListResponse.data),
                vs_currencies: (cmpResponse.data),
                price : fetch_price.data[req.body.ids][req.body.vs_currencies],
                exchange : req.body.vs_currencies
            });
        }
        res.render("index.ejs", {
            coins_list: (coinsListResponse.data),
            vs_currencies: (cmpResponse.data),
            price : fetch_price.data[req.body.ids][req.body.vs_currencies],
            exchange : req.body.vs_currencies,
            img_loc : img_path.data["coins"][0]["thumb"]
        });

    }catch(error){
        console.log(error.response)
    }

})

app.listen(port, () => {
    console.log(`Hey!!, I'm listening on ${port}`);
});
