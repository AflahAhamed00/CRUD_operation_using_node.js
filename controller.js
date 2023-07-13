const fs = require('fs');
const path = require('path');
const filepath = "./data.json";
const fileContents = fs.readFileSync(filepath, 'utf-8');
const data = JSON.parse(fileContents);
const querystring = require('querystring');


exports.create = (req, res) => {

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
        let item = {
            id: data.length + 1,
            Name: querystring.parse(body).Name,
            Place: querystring.parse(body).Place,
            Phone: querystring.parse(body).Phone
          };
      
        data.push(item);
        fs.writeFileSync(filepath, JSON.stringify(data));
      });  
}

exports.getUpdateDetails=(userId,res)=>{
  const user = data.find((item) => item.id === parseInt(userId));

  if (user) {
    return user;
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: `Requested ${userId} not found` }));
  }
}

exports.update=(userId,req,res)=>{
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      let item = {
        id:parseInt(userId),
        Name: querystring.parse(body).Name,
        Place: querystring.parse(body).Place,
        Phone: querystring.parse(body).Phone
      };
      const index = data.findIndex(d => d.id === parseInt(item.id));
      if (index !== -1)
      data[index] = item;
      fs.writeFileSync(filepath, JSON.stringify(data));
    });
   

}
exports.delete=(userId,req,res)=>{
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
        let item = {
          id:parseInt(userId),
          Name: querystring.parse(body).Name,
          Place: querystring.parse(body).Place,
          Phone: querystring.parse(body).Phone
        };
        const index = data.findIndex(d => d.id === parseInt(item.id));
        if (index !== -1)
        data.splice(index, 1);
        for (let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
          }
        fs.writeFileSync(filepath, JSON.stringify(data));
      });

}