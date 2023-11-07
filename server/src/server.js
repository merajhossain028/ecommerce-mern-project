const { connect, default: mongoose } = require("mongoose");
const connectDatabase = require("./config/db.js");
const app = require("./app");
const  {serverPort}  = require("./secrete.js");
const cors = require("cors")

app.use(cors("*"))

app.listen(serverPort, async () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
  await connectDatabase();
});


app.get("/", (req, res) => { 
  res.send("Hello World!")
  });