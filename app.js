console.log("OK");
const app = require("express")();
const join = require("path").join
app.get("/",(req,res) => {
  res.sendFile(join(__dirname,"Mtatitra-Front/dist/Mtatitra/foo.zip"));
})
app.listen(Number(process.env.PORT))
