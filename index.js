const express =require('express')

const {connectToMongoDB}=require('./connect')
const URL=require('./models/url')

const urlRoute=require('./routes/url')
const app=express()
const port=8001

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
.then(()=>console.log('mongodb connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json())

app.use("/url",urlRoute)

app.get('/:shortId',async(req,res)=>{
   const shortId=req.params.shortId;

  if (shortId === 'favicon.ico') return res.status(204).end();

  const entry= await URL.findOneAndUpdate({
       shortId
   },{
    $push:{
        visitHistory:{
            timestamp:Date.now()
        }
    }
   }
);
if (!entry) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
res.redirect(entry.redirectURL)
})

app.listen(port,()=>console.log(`server is running on port ${port}`))