const id = require('./modules/id.es6');
const loadJSON = require('./modules/loadJSON.es6');

class Client {
    constructor() {
        this.mainTicker = this.setTicker();
        this.view = new View();

        this.latestId = 0;
        this.users = [];

        loadJSON("http://arald.synology.me/~cmd/chat/addmessage-json/","POST",
            {   name: "Hans",
                message: "Hello World!",
                avatar: "http://memesvault.com/wp-content/uploads/Pepe-The-Frog-Happy-06.jpg",
                avatar_width: 100,
                avatar_height: 83
            },data=> {console.log(data)},err=> {console.log(err)});
    }

    getData() {
        loadJSON(
            "http://arald.synology.me/~cmd/chat/getmessages-json/?count=20&start="+this.latestId,
            "GET",
            null,
            data => {
                this.parseData(data.sort((a,b) => {
                    return a.id > b.id;
                }));
                this.view.draw(this.users);
            },
            err => {
                console.log(err);
            },
            () => {
                this.mainTicker = this.setTicker();
            }
        )
    }

    parseData(data) {
        data.forEach(message => {
            if (message.id > this.latestId)
                this.latestId = message.id;

            let i = this.users.findIndex(user => {
                console.log(message.ipaddress, user.ip);
                return message.ipaddress === user.ip;
            });

            if (i > -1) {
                this.users[i].update(message);
            } else {
                this.users.push( new User(message));
            }
        });
    }

    setTicker() {
        return setTimeout(()=>{
            this.getData()
        }, 2000);
    }
}

class User {
    constructor(props){
        this.ip = props.ipaddress;
        this.x = (Math.random() * .8) + .1;
        this.y = (Math.random() * .7) + .1;
        this.name = this.message = this.message_date = null;
        this.avatar = {};

        this.update(props);
    }

    update(props) {

        console.log(props);

        this.name = props.name;
        this.message = props.message;
        this.message_date = props.message_date;

        if (this.avatar.uri !== props.avatar){
            this.avatar = {
                uri: props.avatar,
                w: props.avatar_width,
                h: props.avatar_height,
                image: new Image()
            };
            this.avatar.image.src = this.avatar.uri;
        }
    }
}

class View {
    constructor() {
        this.context = null;
        this.canvas = this.createCanvas();
    }

    draw(users) {
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        users.forEach(user => {
            this.context.drawImage(
                user.avatar.image,
                user.x * this.canvas.width,
                user.y * this.canvas.height,
                user.avatar.w,
                user.avatar.h
            );
            this.context.textAlign = (user.x >=0.5 ? "right" : "left");
            this.context.fillText(
                user.message,
                (user.x * this.canvas.width) + (user.avatar.w * .5),
                user.y * this.canvas.height + (user.avatar.h + 20)
            );
        });
    }

    createCanvas() {
        let c = document.createElement('canvas');
        let w = window.innerWidth, h = window.innerHeight;
        c.width = w; c.height = h;
        document.body.appendChild(c);

        this.context = c.getContext("2d");
        this.context.font = "15px Arial";

        return {
            el: c,
            width: w,
            height: h
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    let c = new Client();
});