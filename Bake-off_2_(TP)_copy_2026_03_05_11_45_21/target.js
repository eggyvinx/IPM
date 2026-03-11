// Target class (position and width)
class Target
{
  constructor(x, y, w, l, id)
  {
    this.x      = x;
    this.y      = y;
    this.width  = w;
    this.label  = l;
    this.id     = id;
  }
  
  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y)
  {
    return dist(this.x, this.y, mouse_x, mouse_y) < this.width / 2;
  }
  
  // Draws the target (i.e., a circle)
  // and its label
draw()
{

  let first = this.label[0];
  let rest  = this.label.slice(1);

  let big = 50.0;
  let normal = 25.0;

  switch(first) {
    case 'A':
      fill(48, 25, 52);
      circle(this.x, this.y, this.width);
      break;
    case 'B':
      fill(54, 69, 79);
      circle(this.x, this.y, this.width);
      break;
    case 'C':
      fill(2, 48, 32);
      circle(this.x, this.y, this.width);
      break;
    case 'D':
      fill(0, 0, 204);
      rect(this.x - this.width/2, this.y - this.width/2, this.width);
      break;
    case 'F':
      fill(53, 57, 53);
      circle(this.x, this.y, this.width);
      break;
    case 'G':
      fill(204, 0, 204);
      rect(this.x - this.width/2, this.y - this.width/2, this.width);
      break;
    case 'J':
      fill(102, 0, 0);
      circle(this.x, this.y, this.width);
      break;
    case 'Q':
      fill(204, 204, 0);
      rect(this.x - this.width/2, this.y - this.width/2, this.width);
      break;
    case 'U':
      fill(204, 102, 0);
      rect(this.x - this.width/2, this.y - this.width/2, this.width);
      break;
    case 'V':
      fill(104, 204, 0);
      rect(this.x - this.width/2, this.y - this.width/2, this.width);
      break;
    case 'Y':
      fill(0, 102, 204);
      rect(this.x - this.width/2, this.y - this.width/2, this.width);
      break;
    case 'Z':
      fill(204, 0, 102);
      rect(this.x - this.width/2, this.y - this.width/2, this.width);
      break;
    case 'K':
      fill(76, 0, 53);
      circle(this.x, this.y, this.width);
      break;
    case 'L':
      fill(25, 25, 112);
      circle(this.x, this.y, this.width);
      break;
    case 'M':
      fill(102, 102, 0);
      circle(this.x, this.y, this.width);
      break;
    case 'N':
      fill(102, 51, 0);
      circle(this.x, this.y, this.width);
      break;
    case 'O':
      fill(0, 51, 51);
      circle(this.x, this.y, this.width);
      break;
    case 'P':
      fill(102, 0, 0);
      circle(this.x, this.y, this.width);
      break;
    case 'R':
      fill(51, 0, 102);
      circle(this.x, this.y, this.width);
      break;
    case 'S':
      fill(25, 51, 0);
      circle(this.x, this.y, this.width);
      break;
    case 'T':
      fill(0, 51, 102);
      circle(this.x, this.y, this.width);
      break;
    default:
      fill(255);
  }
  if(target_corretos.includes(this.id)){
    fill(0, 255, 0);
    circle(this.x, this.y, this.width);
    fill(0, 0, 0);
  }
  
  textAlign(CENTER);

  

  // largura do resto
  
  let rest_w = textWidth(rest);
  // primeira let21212ra (maior)
  textSize(normal);
  fill(255);
  textSize(big);
  textStyle(BOLD);

  text(first, this.x, this.y - 1.2 * 20);

  // resto
  textStyle(NORMAL);
  textSize(normal);
  fill(255);
  text(rest, this.x, this.y + 15);
  if(target_corretos.includes(this.id) && ( first == 'D' || first == 'G' || first == 'Q' 
    || first == 'U' || first == 'V' || first == 'Z' || first == 'Y')){
    fill(0, 255, 0);
    rect(this.x - this.width/2, this.y - this.width/2, this.width);
    fill(0, 0, 0);
    text(first, this.x, this.y - 1.2 * 20);
    text(rest, this.x, this.y + 15);
  } 
  else if(target_corretos.includes(this.id)) {
    fill(0, 255, 0);
    circle(this.x, this.y, this.width);
    fill(0, 0, 0);
    text(first, this.x, this.y - 1.2 * 20);
    text(rest, this.x, this.y + 15);
  }
}
}