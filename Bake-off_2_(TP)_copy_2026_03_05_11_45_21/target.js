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
  // Draws the target (i.e., a circle)
  // and its label
  draw()
  {
    if (targets_corretos.includes(this.id)) {
        fill(color(0, 0, 155)); // pinta de outra cor se certo
    } else {
        fill(color(155, 155, 155));    
    }          
    circle(this.x, this.y, this.width);
    
    // Draw label
    textFont("Arial", 12);
    textStyle(BOLD);      //mete letras a bold
    fill(color(255, 255, 255));
    textAlign(CENTER);
    text(this.label, this.x, this.y);
    
  }
}