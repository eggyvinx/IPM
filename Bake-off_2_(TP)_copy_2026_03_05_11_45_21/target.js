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

  fill(12);
  circle(this.x, this.y, this.width);

  let first = this.label[0];
  let rest  = this.label.slice(1);
  //rest = rest.replaceAll(" ", "\n");
  rest = " " + rest;

  let big = 33;
  let normal = 21;

  textAlign(CENTER);

  // largura do resto
  textSize(normal);
  let rest_w = textWidth(rest);

  // primeira letra (maior)
  textSize(big);
  switch(first) {
    case 'A': fill(255,0,0); break;
    case 'B': fill(0,255,0); break;
    case 'C': fill(0,0,255); break;
    case 'D': fill(255,255,0); break;
    case 'F': fill(255,0,255); break;
    case 'G': fill(0,255,255); break;
    case 'J': fill(255,128,0); break;
    case 'K': fill(128,0,255); break;
    case 'L': fill(0,128,255); break;
    case 'M': fill(128,255,0); break;
    case 'N': fill(255,0,128); break;
    case 'O': fill(0,255,128); break;
    case 'P': fill(255,128,255); break;
    case 'Q': fill(255,128,128); break;
    case 'R': fill(128,255,128); break;
    case 'S': fill(200,100,50); break;
    case 'T': fill(50,255,100); break;
    case 'U': fill(100,50,200); break;
    case 'V': fill(200,50,150); break;
    case 'Y': fill(50,150,200); break;
    case 'Z': fill(150,200,50); break;
    default: fill(255);
  }

  textStyle(BOLD);
  text(first, this.x - rest_w/2, this.y);

  // resto
  textStyle(BOLD);
  textSize(normal);
  fill(255);
  text(rest, this.x + textWidth(first)/2, this.y);
}
}