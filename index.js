const express =require('express')
const path=require('path')
const {connectToMongoDB}=require('./connect')
const {checkForAuthentication,restrictTo}=require('./middlewares/auth')
const cookieParser=require('cookie-parser')

const URL=require('./models/url')






const urlRoute=require('./routes/url')
const staticRouter=require('./routes/staticrouter')
const userRoute=require('./routes/user')


const app=express()
const port=8001





connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
.then(()=>console.log('mongodb connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');

  app.set('views',path.resolve('./Views'))

  
app.use(express.json())

app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkForAuthentication);





app.use("/url",restrictTo(["NORMAL","ADMIN"]),urlRoute)
app.use("/user",userRoute)
app.use("/",staticRouter,)




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