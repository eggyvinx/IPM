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

  let big;
  let normal;

  switch(first) {
    case 'D':
      big = 50;
      normal = 43;
      break;
    case 'G':
      big = 50;
      normal = 43;
      break;
    case 'Q':
      big = 50;
      normal = 43;
      break;
    case 'M':
      big = 40;
      normal = 30;
      rest = " " + rest;
      break;
    case 'N':
      big = 40;
      normal = 30;
      rest = " " + rest;
      break;
    case 'J':
      big = 43;
      normal = 33;
      rest = " " + rest;
      break;
    case 'F':
      big = 40;
      normal = 30;
      rest = " " + rest;
      break;
    case 'L':
      big = 40;
      normal = 30;
      rest = " " + rest;
      break;
    case 'T':
      big = 43;
      normal = 34;
      rest = " " + rest;
      break;
    case 'U':
      big = 40;
      normal = 30;
      rest = " " + rest;
      break;
    case 'V':
      big = 40;
      normal = 30;
      rest = " " + rest;
      break;
    case 'Z':
      big = 40;
      normal = 30;
      rest = " " + rest;
      break;
    case 'Y':
      big = 40;
      normal = 30;
      rest = " " + rest;
      break;
    case 'K':
      big = 40;
      normal = 30;
      rest = " " + rest;
      break;
    case 'O':
      big = 40;
      normal = 30;
      rest = " " + rest;
      break;
    case 'P':
      big = 40;
      normal = 30;
      rest = " " + rest;
      break;
    case 'S':
      big = 40;
      normal = 28;
      rest = " " + rest;
      break;
    case 'R':
      big = 42;
      normal = 27;
      rest = " " + rest;
      break;
    default:
      big = 36;
      normal = 27;
      rest = " " + rest;
  }

  textAlign(CENTER);

  // largura do resto
  textFont("Arial", normal);
  let rest_w = textWidth(rest);

  // primeira letra (maior)
  textFont("Arial", big);
  switch(first) {
    case 'A': fill(255,240,245); break;
    case 'B': fill(240,230,140); break;
    case 'C': fill(0,100,200); break;
    case 'D': fill(255,255,0); break;
    case 'F': fill(255,0,255); break;
    case 'G': fill(127,255,212); break;
    case 'J': fill(255,140,0); break;
    case 'K': fill(128,0,255); break;
    case 'L': fill(240,20,60); break;
    case 'M': fill(57, 255, 20); break;
    case 'N': fill(255,0,128); break;
    case 'O': fill(0,255,128); break;
    case 'P': fill(255,128,255); break;
    case 'Q': fill(255,128,128); break;
    case 'R': fill(255, 215, 0); break;
    case 'S': fill(0,255,255); break;
    case 'T': fill(255,20,147); break;
    case 'U': fill(100,50,200); break;
    case 'V': fill(200,50,150); break;
    case 'Y': fill(50,150,200); break;
    case 'Z': fill(150,200,50); break;
    default: fill(255);
  }

  textStyle(BOLD);
  text(first, this.x - rest_w/2, this.y);

  // resto
  textStyle(NORMAL);
  textFont("Arial", normal);
  fill(255);
  text(rest, this.x + textWidth(first)/2, this.y);
}
}