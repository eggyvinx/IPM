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
let target_corretos = [];

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
        // Checks if it was the correct target
        if (targets[i].id == trials[current_trial] + 1) {
          correct_sound.play();
          target_corretos.push(targets[i].id);
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
  target_corretos = [];
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
    case 3: max_cols = 2; break;
    case 4: max_cols = 2; break
    case 5: max_cols = 2; break;
    default: max_cols = 3; break;
  }
  return max_cols;
}

const pos_offsets_cm = {
  C:[0.15, 0],
  D:[2.2, 1.8],
  F:[0.26, 0],
  L:[0.26, 0],
  G:[4.06, -0.26],
  J:[5.8, 0.39],
  N:[2.8, -0.66],
  Q:[1.33, -0.26],
  K:[6, 0.20],
  O:[3.06, 0.4],
  M:[1.59, -1.6],
  R:[0.6, -1.46],
  S:[1.98, 0.65],
  T:[5, -2.4],
  U:[6.7, -2.66]
};

const h_margin_offset_cm = {
  B: 0.13,
  C: 0.79,
  F: 1.19,
  J: 0,
  N: 0.2,
  L: 1.16,
  P: 0.71,
  K: 0.63,
  M: 0.2,
  T: 0.45,
  U: 0.43,
  O: 0.34,
  S: 0.40,
  R: 0.79
};

// Creates and positions the UI targets
function createTargets(target_size_cm, horizontal_gap_cm, vertical_gap_cm, block_h_gap_cm, block_v_gap_cm, ppcm) {

  const toPx = (cm) => cm * ppcm;

  
  const base_h_margin_cm = horizontal_gap_cm / 20 - 50/ppcm;
  const base_v_margin_cm = vertical_gap_cm / 20 + 18 / ppcm;

  let cidades = [];

  for (let r = 0; r < legendas.getRowCount(); r++) {
    cidades.push(legendas.getString(r, 1));
  }

  cidades.sort();

  let grupos = {};

  for (let i = 0; i < cidades.length; i++) {
    let letra = cidades[i][0];

    if (!grupos[letra]) grupos[letra] = [];

    if (letra == 'V' || letra == 'Y' || letra == 'Z') {
      if (!grupos['U']) grupos['U'] = [];
      grupos['U'].push(cidades[i]);
    } else {
      grupos[letra].push(cidades[i]);
    }
  }

  const max_grid_cols = 4;

  const starting_x_cm = 150 / ppcm;
  const starting_y_cm = 45 / ppcm;

  let next_x_cm = starting_x_cm;
  let next_y_cm = starting_y_cm;

  const keys = Object.keys(grupos);

  for (let key = 0; key < keys.length; key++) {
    let letra = keys[key];
    let cidades_do_bloco = grupos[letra];
    if (!cidades_do_bloco) continue;

    let cidades_len = cidades_do_bloco.length;
    let max_cols = getMaxCols(cidades_len);

    const manual_h_margin_cm = h_margin_offset_cm[letra] ? h_margin_offset_cm[letra] : 0;
    const group_h_margin_cm = base_h_margin_cm + manual_h_margin_cm;

    for (let i = 0; i < cidades_len; i++) {
      let blockRow = Math.floor(i / max_cols);
      let blockCol = i % max_cols;

      let target_x_cm = next_x_cm + blockCol * (target_size_cm + group_h_margin_cm + 50 / ppcm) + target_size_cm / 2;
      let target_y_cm = next_y_cm + blockRow * (target_size_cm + base_v_margin_cm) + target_size_cm / 2;

      let offset = pos_offsets_cm[letra];
      if (offset) {
        target_x_cm += offset[0];
        target_y_cm += offset[1];
      }

      let target_label = cidades_do_bloco[i];
      let target_id = getIdByCidade(target_label);

      let target_x_px = toPx(target_x_cm);
      let target_y_px = toPx(target_y_cm);

      let target = new Target(target_x_px, target_y_px, ppcm, target_label, target_id);
      targets.push(target);
    }

    let bloco_col = (key + 1) % max_grid_cols;

    let above_key = key - (max_grid_cols - 1);
    let above_bloco_altura = 0;

    if (above_key >= 0) {
      let above_len = grupos[keys[above_key]].length;
      let above_max_cols = getMaxCols(above_len);
      above_bloco_altura = Math.ceil(above_len / above_max_cols);
    }

    if (bloco_col == 0) {
      next_y_cm += above_bloco_altura * (target_size_cm + base_v_margin_cm) + block_v_gap_cm;
      next_x_cm = starting_x_cm;
    } else {
      next_x_cm += max_cols * target_size_cm + block_h_gap_cm - 40 / ppcm;
    }
  }
}

function windowResized() 
{
  if (fullscreen())
  {
    resizeCanvas(windowWidth, windowHeight);
    
    // DO NOT CHANGE THE NEXT THREE LINES!
    let display = new Display({ diagonal: display_size }, window.screen);
    PPI  = display.ppi;     // calculates pixels per inch
    PPCM = PPI / 2.54;      // calculates pixels per cm
  
    let screen_width_cm  = display.width * 2.54;
    let screen_height_cm = display.height * 2.54;

    const H_GAP_EXTRA_CM = 0;
    const V_GAP_EXTRA_CM = display_size*0.1;
    const BLOCK_H_GAP_CM = display_size*0.266667;
    const BLOCK_V_GAP_CM = display_size*0.02;
    
    let target_size_cm = 0.1*display_size;

    let horizontal_gap_cm = screen_width_cm - (target_size_cm + H_GAP_EXTRA_CM) * GRID_COLUMNS;
    let vertical_gap_cm   = screen_height_cm - (target_size_cm + V_GAP_EXTRA_CM) * GRID_ROWS;

    createTargets(
      target_size_cm,
      horizontal_gap_cm,
      vertical_gap_cm,
      BLOCK_H_GAP_CM,
      BLOCK_V_GAP_CM,
      PPCM
    );

    draw_targets = true;
  }
}