const PORT = 8000

const express = require('express')
const puppeteer = require('puppeteer')
const cors = require('cors')

const app = express()
app.use(cors())

const url = 'https://wsa-test.vercel.app/'
app.use(express.json());


app.get('/', function(req,res){
  res.json('This is my web scraper')
})

app.post('/results', async(req,res)=>{
  try {
    const {link, options} = req.body
		const browser = await puppeteer.launch()
		const page = await browser.newPage()
		await page.goto(link, {waitUntil: 'networkidle0',})

    let response = []
    let links2 = []

    // full page
		const html = await page.content(); 
    //console.log(html)

     // images option
     if(options.includes('Images')){
      const imgUrl = await page.evaluate(() => 
        Array.from(document.querySelectorAll('img')).map(img => img.src) 
      ); 

      const img_list = {
        title: "Images",
        content: imgUrl
      } 
      response.push(img_list)
     }

    // titles option
    if(options.includes('Titles')){
      const titles = await page.evaluate(() => 
        Array.from(document.querySelectorAll('h1')).map(h1 => h1.textContent) 
      ); 
      const titles2 = await page.evaluate(() => 
        Array.from(document.querySelectorAll('h2')).map(h2 => h2.textContent) 
      ); 
      titles.push(...titles2) 
      const titles3 = await page.evaluate(() => 
        Array.from(document.querySelectorAll('h3')).map(h3 => h3.textContent) 
      ); 
      titles.push(...titles3) 
      const title_list = {
        title: "Titles",
        content: titles
      } 
      response.push(title_list)
    }

    // text option
    if(options.includes('Text')){
      const text = await page.evaluate(() => 
        Array.from(document.querySelectorAll('p')).map(p => p.textContent).filter(text => text)
      ); 
      const list = await page.evaluate(() => 
        Array.from(document.querySelectorAll('li')).map(li => li.textContent).filter(text => text)
      );
      text.push(...list) 
      const text_list = {
        title: "Text",
        content: text
      } 

      response.push(text_list)
    }

    // links option
    if(options.includes('Links')){
      const links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a'));
      
        const uniqueLinks = anchors.filter((a, index) => {
          const href = a.href;
          return anchors.findIndex(item => item.href === href) === index;
        });
        return uniqueLinks.map(a => a.href);
      });

      const link_list = {
        title: "Links",
        content: links
      } 
      response.push(link_list)
      links2.push(...links)
     }

    // authors option
    if(options.includes('Authors')){
      let names = await page.evaluate(() => 
        Array.from(document.querySelectorAll('span')).map(span => span.textContent.trim()).filter(text => text)
      );

      const regx = '\\b\\w+\\b'
      names = names.filter(name => name.match(regx));

      const name_list = {
        title: "Authors",
        content: names
      } 
      response.push(name_list)

    }

    // dates option
    if(options.includes('Dates')){
      const dates = await page.evaluate(() => 
        Array.from(document.querySelectorAll('time')).map(time => time.textContent) 
      ); 
      const date_list = {
        title: "Dates",
        content: dates
      } 

      response.push(date_list)
    }

    res.json(response)

    // test for handling sub pages

    /*
    console.log(links2)
    const page2 = await browser.newPage()
    await page2.goto(links2[0], {waitUntil: 'networkidle0',})
    const html2 = await page2.content(); 
    console.log(html2)
    */

		await browser.close()
	} catch (error) {
		console.error(error)
	}
})


function sentimentAnalysis(text) {
  const positive = ['good', 'happy', 'great', 'awesome', 'excellent','joys', 'enriching','positive', 'well','benefits','rewarding','easy','adequate',
,'serene','joyful','candid','radiant','bustling','incredible','quiet','vibrant','alive','warmth','fresh','pleasant','happiness'];
  const negative = ['bad', 'sad', 'terrible', 'awful', 'unpleasant','harmful','negative','challenges','coping','pollution','stiff','overwhelming'
,'hefty','expensive','negatively','dissapointing','critical',''];
  const neutral = ['neutral','unbiased','good','bad','prejudice','different','open','perceived','essential','established','approval','dissaproval'
  ,'neutrality','regular']

  const words = text.toLowerCase().split(' ');
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  let totalWords = 0;

  words.forEach(word => {
    if (positive.includes(word)) {
      positiveCount++;
    } else if (negative.includes(word)) {
      negativeCount++;
    }else if (neutral.includes(word)) {
      neutralCount++;
    }totalWords++;
  });

  return {
    positive: positiveCount,
    negative: negativeCount,
    neutral: neutralCount
  };
}



app.post('/sentiments', async(req,res)=>{
  try {
    const {link} = req.body
		const browser = await puppeteer.launch()
		const page = await browser.newPage()
		await page.goto(link, {waitUntil: 'networkidle0',})

    let response = []

    // full page
		const html = await page.content(); 

    // word count
    
    const extractedText = await page.$eval('*', (el) => el.innerText);

    const result_sentiment = sentimentAnalysis(extractedText);

    const { positive, negative, neutral } = result_sentiment;
    const differenceThreshold = 2; 
    if (positive - negative >= differenceThreshold) {
      if (positive >= 3) {
        response.push('Mostly positive')
      } else {
        response.push('Positive')
      }
    } else if (negative - positive >= differenceThreshold) {
      if (negative >= 3) {
        response.push('Mostly negative')
      } else {
        response.push('Negative')
      }
    } else {
      response.push('Neutral')
    }

    res.json(response)

		await browser.close()
	} catch (error) {
		console.error(error)
	}
})


app.post('/wordcount', async(req,res)=>{
  try {
    const {link} = req.body
		const browser = await puppeteer.launch()
		const page = await browser.newPage()
		await page.goto(link, {waitUntil: 'networkidle0',})

    let response = []

    // full page
		const html = await page.content(); 

    const extractedText = await page.$eval('*', (el) => el.innerText);
    //const regx = new RegExp('Blogger', 'g')
    const regx = new RegExp('\\b\\w+\\b', 'g')
    count = (extractedText.match(regx) || []).length;
    
    res.json(count)

		await browser.close()
	} catch (error) {
		console.error(error)
	}
})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))