const app = require("./app");
const port = process.env.PORT || 5000;

const server = require('http').createServer({
  maxHeaderSize: 16384  
},app);

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

server.listen(port, () => {
  console.log("Listening on " + port);
});