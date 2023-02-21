const fs = require('fs');
const http = require('http');
const url = require('url');

const { text } = require('stream/consumers');
const path = require('path');

const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//FILES
//blocing, synchronous
// const textIn = fs.readFileSync('/home/abk/complete-node-bootcamp-master/1-node-farm/starter/txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `this is related to avocado: ${textIn}.\ncreated on${Date.now()}`;

// fs.writeFileSync('/home/abk/complete-node-bootcamp-master/1-node-farm/starter/txt/output.txt', textOut);
// console.log('file written');

//non-blocking, asynchronous
// fs.readFile('/home/abk/complete-node-bootcamp-master/1-node-farm/starter/txt/starttt.txt', 'utf-8', (err, data1) => {

//     if (err) return console.log('error');
//     fs.readFile(`/home/abk/complete-node-bootcamp-master/1-node-farm/starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`/home/abk/complete-node-bootcamp-master/1-node-farm/starter/txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('/home/abk/complete-node-bootcamp-master/1-node-farm/starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('file written');
//             });
//         });
//     });
// });
// console.log('will read file');

// SERVERS

// fs.readFile('./dev-data/data.json');
const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  'utf-8'
);
const dataObject = JSON.parse(data);

// const slugs = dataObject.map(el => slugify(el.productName, { lower: true }));
// dataObject.forEach((element, index) => {
//     element.slug = slugs[index];
// });

dataObject.forEach((element, index, arr) => {
  arr[index].slug = slugify(element.productName, {
    lower: true,
  });
});
const server = http.createServer((req, res) => {
  // const { query, pathname } = url.parse(req.url, true);
  const { pathname } = url.parse(req.url, true);

  // overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  }

  // product page
  // else if (pathname === '/product') {
  //     res.writeHead(200, {
  //         'Content-type': 'text/html'
  //     });
  //     const product = dataObject[query.id];
  //     const output = replaceTemplate(tempProduct, product);
  //     // output.querySelector('.card__link').href = `/product/${product.slug}`;
  //     res.end(output);
  // }
  else if (pathname.split('/')[1] === 'product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const product = dataObject.find((el) => el.slug === pathname.split('/')[2]);
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  // api
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  }

  // not found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to requests on port 8000');
});
