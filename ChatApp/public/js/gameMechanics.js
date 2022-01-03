var character = document.getElementById("character");
var obstacle = document.getElementById("obstacle");
var score = 0;

document.getElementById("game").addEventListener("click", ()=>{
    if(!character.classList.contains('animate')){
        character.classList.add("animate");
        setTimeout(function(){
          character.classList.remove("animate");
        }, 500);
      
      }
})
document.getElementById("game").addEventListener("click", () => {
  obstacle.classList.add("animate2");
  obstacle.classList.add("left");
})

var update = setInterval(function(){
    var characterHitBox = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    var obstacleHitBox = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
    if(obstacleHitBox < 40 && obstacleHitBox > 0 && characterHitBox >= 50){
        alert("Game Over");
        obstacle.classList.remove("left");
        obstacle.classList.remove("animate2");
        score = 0;
    } 
}, 10);
