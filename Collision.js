window.addEventListener('load',function() {

    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width= 800;
    canvas.height =720;
    let enemies = [];
    let score=0;
    let gameOver=false;


class InputHandler {
    constructor(){
        this.keys = [];
        window.addEventListener('keydown', e =>

        {

            if ((e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight')
            && this.keys.indexOf(e.key) === -1)

                {

                    this.keys.push(e.key);


                }

        });


        window.addEventListener('keyup', e =>

        {

            if   (e.key === 'ArrowDown'||
                  e.key === 'ArrowUp' ||
                  e.key === 'ArrowLeft' ||
                  e.key === 'ArrowRight')

                {
                    this.keys.splice(this.keys.indexOf(e.key),1) ;
    


                }

        });




    }


}


class Player {

    constructor(gameWidth, gameHeight) {
        this.gameWidth=gameWidth;
        this.gameHeight=gameHeight;
        this.width=200;
        this.height=200;
        this.x=10;
        this.y=this.gameHeight-this.height;
        this.image = document.getElementById('playerImage');
        this.frameX=0;
        this.frameY=0;
        this.speed=0;
        this.vy=0;
        this.weight=1;
        this.maxFrame=8;
        this.fps=20;
        this.frameTimer=0;
        this.frameInterval=1000/this.fps;


    }

    draw(ctx){

        ctx.strokeStyle='white';
        // ctx.fillStyle='white';

        ctx.strokeRect(this.x,this.y,this.width,this.height);
        ctx.beginPath();
        ctx.arc(this.x+this.width/2,this.y+this.height/2,this.width/2,0,Math.PI*2);
        ctx.stroke();

        ctx.strokeStyle='blue';
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.width/2,0,Math.PI*2);
        ctx.stroke();

        // ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image,this.frameX*this.width,this.frameY*this.height,this.width, this.height,this.x,this.y,this.width,this.height);

    }

    update(input,deltaTime,enemies){
        
        enemies.forEach(e =>
            
            {

                const dx = (e.x+e.widht/2) - (this.x+this.width/2);
                const dy = (e.y+e.height/2) - (this.y+this.height/2);
                const distance = Math.sqrt(dx*dx+dy*dy);
                if(distance<e.widht/2+this.width/2)
                {gameOver=true;
               
                
                }


            });



        if(this.frameTimer>this.frameInterval)

        {

            if(this.frameX>this.maxFrame)this.frameX=0;

            else this.frameX++;
            this.frameTimer=0;

        } else {this.frameTimer+=deltaTime;}


        if(input.keys.indexOf('ArrowRight')>-1)
            
            {this.speed=5;}

         else if(input.keys.indexOf('ArrowLeft')>-1)

            {this.speed=-5;}  

            else if(input.keys.indexOf('ArrowUp')>-1 && this.onGround())

            {this.vy-=30;}

        else {

            this.speed = 0;

              }


              this.x += this.speed;
              if (this.x <0) this.x=0;
              else if (this.x> this.gameWidth - this.width) this.x=this.gameWidth-this.width;


              this.y+=this.vy;
              if(!this.onGround())
              {

                this.vy += this.weight;
                this.maxFrame=5;
                this.frameY=1;


              } else {
                
                        this.vy =0;
                        this.maxFrame=8;
                        this.frameY=0;
            
                        }

            if(this.y>this.gameHeight-this.height) this.y=this.gameHeight-this.height;
            

    }

        onGround(){

            return this.y>=this.gameHeight-this.height;


        }


}

class Background {
    constructor(gameWidth,gameHeight){

        this.gameWidth=gameWidth;
        this.gameHeight=gameHeight;
        this.image=document.getElementById('background');
        this.x=0;
        this.y=0;
        this.width=2400;
        this.height=720;
        this.speed=7;

    }

            draw(context){

                context.drawImage(this.image,this.x,this.y,this.width,this.height);
                context.drawImage(this.image,this.x+this.width,this.y,this.width,this.height);

            }

            update(){

                this.x -=this.speed;
                if(this.x<0 - this.width)this.x=0;

            }


}



class Enemy {
    constructor(gameWidth,gameHeight){

        this.gameWidth=gameWidth;
        this.gameHeight=gameHeight;
        this.widht=160;
        this.height=119;
        this.image=document.getElementById('enemyImage');
        this.x=this.gameWidth;
        this.y=this.gameHeight-this.height;
        // this.x=0;
        // this.y=0;
        this.frameX=0;
        this.maxFrame=5;
        this.fps=60;
        this.frameTimer=0;
        this.frameInterval=1000/this.fps;
        this.speed=2;
        this.markedForDeletion=false;
    }
    
    draw(ctx){

        // ctx.strokeStyle='white';
        // ctx.fillStyle='white';

        // ctx.strokeRect(this.x,this.y,this.width,this.height);
        // ctx.beginPath();
        // ctx.arc(this.x+this.width/2,this.y+this.height/2,this.width/2,0,Math.PI*2);
        // ctx.stroke();

        ctx.strokeStyle='blue';
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.width/2,0,Math.PI*2);
        ctx.stroke();

        // ctx.strokeStyle='white';
     
        // ctx.drawImage(this.image,this.frameX*this.widht,0,this.widht,this.height,this.x,this.y,this.widht,this.height);

       ctx.drawImage(this.image,this.frameX*this.widht,0,this.widht,this.height,this.x,this.y,this.widht,this.height);


    }

    update(deltaTime){

            //  this.x--;

        if(this.frameTimer>this.frameInterval)
     
        {
            if(this.frameX>=this.maxFrame)this.frameX=0;
          
            else this.frameX++;

            this.frameTimer=0;

        
        } else {this.frameTimer+=deltaTime;}

        this.x -= this.speed;
   
        if(this.x < 0 - this.widht) 

        {
        
            this.markedForDeletion=true;
            score++;
        
        }
    }

}



function handleEnemies(deltaTime){
      
    if(enemyTimer>enemyInterval+randomEnemyInterval)
   
    {
        enemies.push(new Enemy(canvas.width,canvas.height));
        console.log(enemies);
        randomEnemyInterval = Math.random()*1000+500;
        enemyTimer=0;




    } else {enemyTimer += deltaTime;}

        enemies.forEach(e => 
            
            {

                e.draw(ctx);
                e.update(deltaTime);


            });

            enemies=enemies.filter(e => !e.markedForDeletion);

}

function displayStatutText(){

    ctx.font='40px Helvetica';
    ctx.fillStyle='black';
    ctx.fillText('Score:' + score,20,50);
    ctx.fillStyle='white';
    ctx.fillText('Score:' + score,22,52);
    if(gameOver){

        ctx.textAlign='center';
        ctx.fillStyle='black';
        ctx.fillText('Game over', canvas.width/2,200);
        ctx.fillStyle='white';
        ctx.fillText('Game over', canvas.width/2+2,200);
    

                 }

}

const e = new Enemy(800,canvas.height);
const input = new InputHandler;
const player = new Player(canvas.width,canvas.height);
const background = new Background(canvas.width, canvas.height);

let lastTime=0;
let enemyTimer=0;
let enemyInterval=1000;
let randomEnemyInterval = Math.random()*1000+500;

function animate(timeStamp){

    const deltaTime= timeStamp - lastTime;
    lastTime=timeStamp;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    background.draw(ctx);
    // background.update();
    player.draw(ctx);
    player.update(input,deltaTime,enemies);
    handleEnemies(deltaTime);
    // e.draw(ctx);
    // e.update();
    // console.log(e);
    displayStatutText(ctx);
   requestAnimationFrame(animate);

}

animate(0);

})