const express = require("express")
const { sequelize } = require('./models')
const app = express();

const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));


sequelize.sync({ force: false }) // 이 코드 발견 시 시퀄라이즈 실행
.then(() => {
    console.log('데이터베이스 연결 성공');
})
.catch((err) => {
    console.error(err);
})
//routes
app.use("/api/user", require("./router/user"))
app.use("/api/boards", require("./router/board"))

app.get("/",(req,res)=>{
    res.send("hellp")
})

app.listen(PORT, ()=>console.log(`Example server listening on ${PORT}`))
