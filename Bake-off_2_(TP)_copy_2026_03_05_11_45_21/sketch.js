// Bake-off #2 -- Seleção em UIs Densas
// IPM 2025-26, Período 3
// Entrega: até às 23h59, dois dias úteis antes do sexto lab (via Fenix)
// Bake-off: durante os laboratórios da semana 6 (25 a 31 de março)

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER        = 9;     // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE  = false;  // Set to 'true' to record user results to Firebase

// Pixel density and setup variables (DO NOT CHANGE!)
let PPI, PPCM;
const NUM_OF_TRIALS       = 12;     // The numbers of trials (i.e., target selections) to be completed
let continue_button;
let legendas;                       // The item list from the "legendas" CSV

// Metrics (DO NOT CHANGE!)
let testStartTime, testEndTime;     // time between the start and end of one attempt (8 trials)
let hits 			      = 0;      // number of successful selections
let misses 			      = 0;      // number of missed selections (used to calculate accuracy)
let database;                       // Firebase DB  

// Study control parameters (DO NOT CHANGE!)
let draw_targets          = false;  // used to control what to show in draw()
let trials;                         // contains the order of targets that activate in the test
let current_trial         = 0;      // the current trial number (indexes into trials array above)
let attempt               = 0;      // users complete each test twice to account for practice (attemps 0 and 1)

// Target list and layout variables
let targets               = [];
const GRID_ROWS           = 8;      // We divide our 80 targets in a 8x10 grid
const GRID_COLUMNS        = 10;     // We divide our 80 targets in a 8x10 grid

let correct_sound;
let incorrect_sound;

// Ensures important data is loaded before the program starts

function preload()
{
  correct_sound = loadSound('correct_sound.mp3');
  incorrect_sound = loadSound('incorrect_sound.mp3');
  // id,name,...
  const preamble = GROUP_NUMBER < 10 ? 'legendas/G_0' : 'legendas/G_';
  legendas = loadTable(preamble+GROUP_NUMBER+'.csv', 'csv', 'header');
}

// Runs once at the start
function setup()
{
  createCanvas(700, 500);    // window size in px before we go into fullScreen()
  frameRate(60);             // frame rate (DO NOT CHANGE!)
  
  randomizeTrials();         // randomize the trial order at the start of execution
  drawUserIDScreen();        // draws the user start-up screen (student ID and display size)
}

// Runs every frame and redraws the screen
function draw()
{
  if (draw_targets && attempt < 2)
  {     
    // The user is interacting with the 6x3 target grid
    background(color(0,0,0));        // sets background to black
    
    // Print trial count at the top left-corner of the canvas
    textFont("Arial", 16);
    fill(color(255,255,255));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);
        
    // Draw all targets
	for (var i = 0; i < legendas.getRowCount(); i++) targets[i].draw();

    textStyle(NORMAL);
    
    // Draws the target label to be selected in the current trial. We include 
    // a black rectangle behind the trial label for optimal contrast in case 
    // you change the background colour of the sketch (DO NOT CHANGE THESE!)
    fill(color(0,0,0));
    rect(0, height - 40, width, 40);
 
    textFont("Arial", 20); 
    fill(color(255,255,255)); 
    textAlign(CENTER); 
    text(legendas.getString(trials[current_trial],1), width/2, height - 20);
  }
}

// Print and save results at the end of 12 trials
function printAndSavePerformance()
{
  // DO NOT CHANGE THESE! 
  let accuracy			= parseFloat(hits * 100) / parseFloat(hits + misses);
  let test_time         = (testEndTime - testStartTime) / 1000;
  let time_per_target   = nf((test_time) / parseFloat(hits + misses), 0, 3);
  let penalty           = constrain((((parseFloat(95) - (parseFloat(hits * 100) / parseFloat(hits + misses))) * 0.2)), 0, 100);
  let target_w_penalty	= nf(((test_time) / parseFloat(hits + misses) + penalty), 0, 3);
  let timestamp         = day() + "/" + month() + "/" + year() + "  " + hour() + ":" + minute() + ":" + second();
  
  textFont("Arial", 18);
  background(color(0,0,0));   // clears screen
  fill(color(255,255,255));   // set text fill color to white
  textAlign(LEFT);
  text(timestamp, 10, 20);    // display time on screen (top-left corner)
  
  textAlign(CENTER);
  text("Attempt " + (attempt + 1) + " out of 2 completed!", width/2, 60); 
  text("Hits: " + hits, width/2, 100);
  text("Misses: " + misses, width/2, 120);
  text("Accuracy: " + accuracy + "%", width/2, 140);
  text("Total time taken: " + test_time + "s", width/2, 160);
  text("Average time per target: " + time_per_target + "s", width/2, 180);
  text("Average time for each target (+ penalty): " + target_w_penalty + "s", width/2, 220);

  // Saves results (DO NOT CHANGE!)
  let attempt_data = 
  {
        project_from:       GROUP_NUMBER,
        assessed_by:        student_ID,
        test_completed_by:  timestamp,
        attempt:            attempt,
        hits:               hits,
        misses:             misses,
        accuracy:           accuracy,
        attempt_duration:   test_time,
        time_per_target:    time_per_target,
        target_w_penalty:   target_w_penalty,
  }
  
  // Sends data to DB (DO NOT CHANGE!)
  if (RECORD_TO_FIREBASE)
  {
    // Access the Firebase DB
    if (attempt === 0)
    {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }
    
    // Adds user performance results
    let db_ref = database.ref('G' + GROUP_NUMBER);
    
    db_ref.push(attempt_data)
    .then(() => {print("user data uploaded to Firebase");})
    .catch((error) => {print("upload failed:", error);})
    .finally(() => {
        if (attempt === 2)
        {
          // Close the Firebase connection
          database.goOffline();
          print("Firebase connection closed");
        }});
  }
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() 
{
  // Only look for mouse releases during the actual test
  // (i.e., during target selections)
  if (draw_targets)
  {
    for (var i = 0; i < legendas.getRowCount(); i++)
    {
      // Check if the user clicked over one of the targets
      if (targets[i].clicked(mouseX, mouseY)) 
      {                
        print("targ id: " + targets[i].id + " trial id: " + trials[current_trial]);
        print(targets[i].id == trials[current_trial] + 1);
        // Checks if it was the correct target
        if (targets[i].id == trials[current_trial] + 1) {
          correct_sound.play();
          hits++;
        }
        else {
          incorrect_sound.play();
          misses++;
        }
        
        current_trial++;              // Move on to the next trial/target
        break;
      }
    }
    
    // Check if the user has completed all trials
    if (current_trial === NUM_OF_TRIALS)
    {
      testEndTime = millis();
      draw_targets = false;          // Stop showing targets and the user performance results
      printAndSavePerformance();     // Print the user's results on-screen and send these to the DB
      attempt++;                      
      
      // If there's an attempt to go create a button to start this
      if (attempt < 2)
      {
        continue_button = createButton('START 2ND ATTEMPT');
        continue_button.mouseReleased(continueTest);
        continue_button.position(width/2 - continue_button.size().width/2, height/2 - continue_button.size().height/2);
      }
    }
    // Check if this was the first selection in an attempt
    else if (current_trial === 1) testStartTime = millis(); 
  }
}

// Evoked after the user starts its second (and last) attempt
function continueTest()
{
  // Re-randomize the trial order
  randomizeTrials();
  
  // Resets performance variables
  hits = 0;
  misses = 0;
  
  current_trial = 0;
  continue_button.remove();
  
  // Shows the targets again
  draw_targets = true; 
}

function getIdByCidade(nome) {
  for (let r = 0; r < legendas.getRowCount(); r++) {
    if (legendas.getString(r, 1) === nome) {
      return legendas.getString(r, 0); // coluna 0 = id
    }
  }
  return null;
}

function getMaxCols(len) {
  let max_cols;
  switch(len) {
    case 1: max_cols = 1; break;
    case 2: max_cols = 2; break;
    case 4: max_cols = 2; break
    default: max_cols = 3; break;
  }
  return max_cols;
}

// Creates and positions the UI targets
function createTargets(target_size, horizontal_gap, vertical_gap, block_h_gap, block_v_gap) {

  // Define the margins between targets by dividing the white space 
  // for the number of targets minus one
  h_margin = horizontal_gap / 20;
  v_margin = vertical_gap / (6) + 5;
  
  // Set targets in a 8 x 10

  let cidades = [];

  for (let r = 0; r < legendas.getRowCount(); r++) {
    cidades.push(legendas.getString(r, 1)); // coluna 1 = cidade
  }

  cidades.sort();

  let grupos = {}; // { 'A': [cidades], 'B': [...] }

  for (let i = 0; i < cidades.length; i++) {
    let letra = cidades[i][0];
    if (!grupos[letra]) grupos[letra] = [];

    if (letra == 'V' || letra == 'Y' || letra == 'Z')
      grupos['U'].push(cidades[i]);

    else grupos[letra].push(cidades[i]);
  }

  let max_grid_cols = 4;
  let max_grid_rows = 5;
  let bloco_largura;
  let bloco_altura;

  let bloco_idx = 1;
  let starting_x = 190;
  let starting_y = 200;

  let next_x = starting_x;
  let next_y = starting_y;

  const keys = Object.keys(grupos);
  const keys_len = keys.length;
  for (let key = 0; key < keys_len; key++) {
  //for (letra in grupos) {
    let letra = keys[key];
    let cidades_do_bloco = grupos[letra]; 
    if (!cidades_do_bloco) continue;
    let cidades_len = cidades_do_bloco.length;
    let max_cols = getMaxCols(cidades_len);
  
    bloco_largura = max_cols;
    //bloco_altura = Math.ceil(cidades_len / max_cols);

    switch(letra) {
      case 'C': h_margin += 30; break;
      case 'F': h_margin += 45; break;
      case 'J': h_margin -= 70; break;
      case 'N': h_margin -= 10; break;
      case 'L': h_margin += 44; break;
      case 'P': h_margin += 23; break;
      case 'K': h_margin += 24; break;
      case 'M': h_margin -= 70; break;
      case 'T': h_margin += 7; break;
      case 'U': h_margin += 10; break;
      case 'O': h_margin += 13; break;
      case 'S': h_margin -= 5; break;
      default: break;
    }


    for (let i = 0; i < cidades_len; i++) {

    let blockRow = Math.floor(i / max_cols); // linha do target dentro do bloco
    let blockCol = i % max_cols;             // coluna do target dentro do bloco



    let target_x = next_x + blockCol * (target_size + h_margin + 50) + target_size/2;
    let target_y = next_y + blockRow * (target_size + v_margin) + target_size/2;

    switch(letra) {
      case 'D':
        target_x += 90;
        target_y += 75;
        break;
      case 'F':
        target_x += 10; break;
      case 'L':
        target_x += 10; break;
      case 'G':
        target_x += 120;
        target_y += 30;
        break;
      case 'J':
        target_x += 130;
        target_y += 30;
        break;
      case 'N':
        target_x += 70;
        target_y += 10;
        break;
      case 'Q':
        target_x += 60;
        target_y += 20;
        break;
      case 'K':
        target_x += 100;
        target_y += 15;
        break;
      case 'O':
        target_y += 30;
        target_x += 17;
        break;
      case 'M':
        target_y -= 20;
        target_x += 30;
        break;
      case 'R':
        target_x -= 30; break;
      case 'S':
        target_y += 32;
        target_x += 15;
        break;
      case 'T':
        target_x += 200; break;
      case 'U':
        target_x += 410; break;
      default: break;
    }
    
    let target_label = cidades_do_bloco[i];
    let target_id = getIdByCidade(target_label);

    let target = new Target(target_x, target_y, target_size, target_label, target_id);
    targets.push(target);

    }
    
    
    let bloco_col = bloco_idx % (max_grid_cols);

   // print("letra",letra,"bloco_col",bloco_col,"bloco idx:",bloco_idx,"max_grid_cols:",max_grid_cols);

    let above_key = key - (max_grid_cols - 1);
    if (above_key >= 0) {
      let above_len = grupos[keys[above_key]].length;
      let above_max_cols = getMaxCols(above_len);
      bloco_altura = Math.ceil(above_len / above_max_cols);
      print("blocoidx:",bloco_idx,"letra",letra, "bloco alutra:", bloco_altura, "above cols:", above_max_cols, "above len:", above_len);
    }

    if (bloco_col == 0) {
      next_y += bloco_altura * (target_size + v_margin) + block_v_gap;
      next_x = starting_x;
    }
    else next_x += bloco_largura * (target_size) + block_h_gap - 40;

    bloco_idx++;
  }


}

// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() 
{
  if (fullscreen())
  {
    resizeCanvas(windowWidth, windowHeight);
    
    // DO NOT CHANGE THE NEXT THREE LINES!
    let display        = new Display({ diagonal: display_size }, window.screen);
    PPI                = display.ppi;                      // calculates pixels per inch
    PPCM               = PPI / 2.54;                       // calculates pixels per cm
  
    // Make your decisions in 'cm', so that targets have the same size for all participants
    // Below we find out out white space we can have between 2 cm targets
    let screen_width   = display.width * 2.54;             // screen width
    let screen_height  = display.height * 2.54;            // screen height
    let target_size    = 1.2;                              // sets the target size (will be converted to cm when passed to createTargets)
    let horizontal_gap = screen_width - (target_size+1.1) * GRID_COLUMNS;// empty space in cm across the x-axis (based on 10 targets per row)
    let vertical_gap   = screen_height - (target_size+0.9) * GRID_ROWS;  // empty space in cm across the y-axis (based on 8 targets per column)

    let block_h_gap = 5;
    let block_v_gap = 0.2;

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    // 80 represent some margins around the display (e.g., for text)
    createTargets(target_size * PPCM, horizontal_gap * PPCM - 80, vertical_gap * PPCM - 120, block_h_gap * PPCM, block_v_gap * PPCM);

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}