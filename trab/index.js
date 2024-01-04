const express=require("express")
const app=express()

const path=require("path")
const http=require("http")
const {Server}=require("socket.io")

const server=http.createServer(app)

const io=new Server(server)
app.use(express.static(path.resolve("")))

let arr=[] //temporario para armazenar o nome dos jogadores
let playingArray=[] //armazena informação dos jogos a decorrer

io.on("connection",(socket)=>{
    //ativado quando um jogador esta a procura de jogo, find recebido do .html
    socket.on("find",(e)=>{
        //verifica se nome foi fornecido
        if(e.name!=null){
            //adiciona o nome ao array temporario
            arr.push(e.name)
            //cria objetos de jogador para ambos os jogadores
            if(arr.length>=2){
                let p1obj={
                    p1name:arr[0],
                    p1value:"X",
                    p1move:""
                }
                let p2obj={
                    p2name:arr[1],
                    p2value:"O",
                    p2move:""
                }
                //cria objeto para jogo e adiciona objeto ao array
                let obj={
                    p1:p1obj,
                    p2:p2obj,
                    sum:1 // contador para movimentos no jogo
                }
                playingArray.push(obj)
                //remove os dois primeiros jogadores do array temporario (começa com o 0 e remove 2 elementos)
                arr.splice(0,2)
                //passa aos jogadores o estado atualizado do jogo
                io.emit("find",{allPlayers:playingArray})
            }
        }
    })
    //ativado quando um jogador faz um movimento, playing recebido do .html
    socket.on("playing",(e)=>{
        //se o primeiro a jogar forem as cruzes (X)
        if(e.value=="X"){
            let objToChange=playingArray.find(obj=>obj.p1.p1name===e.name)

            objToChange.p1.p1move=e.id
            objToChange.sum++
        }
        else if(e.value=="O"){
            let objToChange=playingArray.find(obj=>obj.p2.p2name===e.name)

            objToChange.p2.p2move=e.id
            objToChange.sum++
        }
        //passa a todos jogadores o estado atualizado do jogo
        io.emit("playing",{allPlayers:playingArray})
    })
    //ativado quando um jogador perde, gameOver recebido do .html
    socket.on("gameOver",(e)=>{
        playingArray=playingArray.filter(obj=>obj.p1.p1name!==e.name)
        console.log(playingArray)
        console.log("acaboujogo")
    })
})

//serve o index.html
app.get("/",(req,res)=>{
    return res.sendFile("index.html")
})

//nodemon index, no terminal para começar
server.listen(3000,()=>{
    console.log("conectado porta 3000 (localhost:3000)")
})
