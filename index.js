const express = require('express')
const app = express()
const port = process.env.PORT ||  4000
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs-extra')
require('dotenv').config()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
 
  const MongoClient = require('mongodb').MongoClient;
const ObjectID = require ('mongodb').ObjectID
const uri =  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lwmgg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err =>{
    const ordersCollection = client.db("Repairer").collection("orders");
    const reviewCollection =  client.db("Repairer").collection("reviews");
    const adminCollection =  client.db("Repairer").collection("admin");
    const serviceCollection =  client.db("Repairer").collection("service");
    app.post('/addOrder',(req,res)=>{
        const newProduct = req.body;
        ordersCollection.insertOne(newProduct)
        .then(result=>{
          res.send(result.insertedCount>0)
        })
      })

      app.post('/addReview',(req,res)=>{
        const newReview = req.body;      
        reviewCollection.insertOne(newReview)
        .then(result=>{
          res.send(result.insertedCount>0)
        })
      })

      app.get('/getReviews',(req,res)=>{
        reviewCollection.find()
        .toArray((err,items)=>{
         res.send(items)
        })
      })
      app.get('/myBookings',(req,res)=>{
   
        ordersCollection.find({email:req.query.email})
         .toArray((err,items)=>{
          res.send(items)
           
         })
       })
       app.post('/addAdmin',(req,res)=>{
        const newAdmin = req.body;      
        adminCollection.insertOne(newAdmin)
        .then(result=>{
            res.send(result.insertedCount>0)
        })
      })



      app.post('/findAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
              
                if (admin.length!==0) {
                  res.send(true)
                }
                else{
                  res.send(false)
                }
            })

            app.post('/addService', (req, res) => {
              const newProduct = req.body;
              serviceCollection.insertOne(newProduct)
              .then(result=>{
                res.send(result.insertedCount>0)
              })
          })



    })

    app.get('/allBookings',(req,res)=>{
      ordersCollection.find()
       .toArray((err,items)=>{
        res.send(items)
         
       })
     })
     app.get('/services',(req,res)=>{
      serviceCollection.find()
       .toArray((err,items)=>{
        res.send(items)
       })
     })
     app.get('/singleService/:id',(req,res)=>{
      serviceCollection.find({_id:ObjectID(req.params.id)})
     .toArray((err,item)=>{
       res.send(item[0])
     })
   })
     

    
})

  app.listen(port, () => {
   
  })