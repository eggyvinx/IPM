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

    this.sizes = {
      A:[36,27],
      C:[36,27],
      D:[50,43],
      G:[50,43],
      Q:[50,43],
      J:[43,33],
      T:[43,34],
      S:[40,28],
      R:[42,27]
    };

    this.first_cor_tab = {
      A: [154,255,151],
      B: [240,230,140],
      C: [0,100,200],
      D: [255,255,0],
      F: [255,0,255],
      G: [127,255,212],
      J: [255,140,0],
      K: [128,0,255],
      L: [240,20,60],
      M: [57, 255, 20],
      N: [255,0,128],
      O: [0,255,128],
      P: [255,128,255],
      Q: [255,128,128],
      R: [255, 215, 0],
      S: [0,255,255],
      T: [255,20,147],
      U: [100,50,200],
      V: [200,50,150],
      Y: [50,150,200],
      Z: [150,200,50]
    };
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
  
  // balls

  if(target_corretos.includes(this.id)){
    fill(85);
    circle(this.x, this.y, this.width);
  } else {
    fill(18);
    circle(this.x, this.y, this.width);
  }

  // text

  let first = this.label[0];
  let rest  = this.label.slice(1);

  let big;
  let normal;

  let size = this.sizes[first];

  if (size) {
    [big, normal] = size;
  } else {
    big = 40;
    normal = 30;
  }

  if (!(first == 'D' || first == 'G' || first == 'Q')) rest = " " + rest;

  textAlign(CENTER);

  // largura do resto
  textFont("Arial", normal);
  let rest_w = textWidth(rest); // width muda dependendo da fonte ^

  let first_cor = this.first_cor_tab[first];
  fill(...first_cor);
  textFont("Arial", big);
  textStyle(BOLD);
  text(first, this.x - rest_w/2, this.y);

  // resto
  fill(255);
  textFont("Arial", normal);
  textStyle(NORMAL);
  text(rest, this.x + textWidth(first)/2, this.y);

}
}