// Target class (position and width)
class Target
{
  constructor(x, y, w, l, id) {

    this.x      = x;
    this.y      = y;
    this.width  = display_size *0.1*w;
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
    
    this.circle_color = {
      A: [62,102,60],
      B: [96,92,56],
      C: [0,40,80],
      D: [102,102,0],
      F: [102,0,102],
      G: [51,102,85],
      J: [102,56,0],
      K: [51,0,102],
      L: [96,8,24],
      M: [23,102,8],
      N: [102,0,51],
      O: [0,102,51],
      P: [102,51,102],
      Q: [102,51,51],
      R: [102,86,0],
      S: [0,102,102],
      T: [102,8,59],
      U: [40,20,80],
      V: [80,20,60],
      Y: [20,60,80],
      Z: [60,80,20]
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
  
  let first = this.label[0];
  
  // balls

  if(target_corretos.includes(this.id)){
    fill(85);
    circle(this.x, this.y, this.width);
  } else {
    fill(...this.circle_color[first]);
    circle(this.x, this.y, this.width);
  }

  // text

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