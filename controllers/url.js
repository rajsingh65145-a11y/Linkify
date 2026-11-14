const shortid=require('shortid')
const URL=require('../models/url')

async function handleGenerateShortURL(req,res){
    const body=req.body
    if(!body.url)return res.status(400).json({error:'url is required'})

let originalURL = body.url.trim();
  if (!/^https?:\/\//i.test(originalURL)) {
    originalURL = 'https://' + originalURL;
  }

    const shortId=shortid();

    await URL.create({
        shortId:shortId,
        redirectURL:originalURL,
        visitHistory:[],
        createdBy:req.user._id
    });

    const allUrls = await URL.find({});

    return res.render('home', {
        id: shortId,
        urls: allUrls,
    });
}

// Get click analytics
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  if (!result) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}


module.exports={
    handleGenerateShortURL,
    handleGetAnalytics,
}