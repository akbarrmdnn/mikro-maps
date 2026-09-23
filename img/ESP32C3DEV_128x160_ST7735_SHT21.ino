// ESP32C3DEV_128x169_SHT21_nn
//
// platform: ESP32-C3 Super Mini 
// display: 128*160 SPI 1.8 inch diagonal TFT ST7735 controller
// sensor is SHT21 - i2c interface temperature-humidity sensor
//
// hardware i2c pins on the Super Mini are: 8 = SDA, 9 = SCL
// pin wiring is as follows
// 
// pin layout:
// display   ESP32C3 Super Mini
//   GND --------- GND
//   VCC --------- 5V
//   SCL --------- 2
//   SDA --------- 4
//   RST --------- 0
//   DC ---------- 1
//   CS ---------- 5
//   BL ---------- 3V3
//
// Floris Wouterlood
// September 1, 2024
// public domain

   #include <Wire.h>

   #include <SparkFunHTU21D.h>
   HTU21D myHumidity;                                            // create an instance of the object

   #include <TFT_eSPI.h>                                         // include the graphics library (this includes the sprite functions)
   TFT_eSPI    tft = TFT_eSPI();                                 // create object "tft"
 
   #define BLACK  0x0000
   #define WHITE  0xFFFF 
   #define RED    0xF800

   int j;
   int center_x = 80;                                           // center x of circular scale
   int center_y = 75;                                           // center y of circular scale
   float humd;
   float temp;
   
void setup(){

    Wire.begin (8,9);                                            // 8 is SDA pin, 9 is SCL pin

    Serial.begin (9600);
    tft.init ();
    tft.setRotation (0);  
    myHumidity.begin();

    Serial.println ();
    Serial.println ("Hello! SHT21 temperature-humidity meter");
    Serial.println ("on ESP32 C3 DEV Super Mini");
    Serial.println ();   
    Serial.println ("ESP32C3DEV Super Mini SHT21");
    Serial.println ("==========================");  
    tft.fillScreen (WHITE);
    setup_the_screen ();        
}


void loop(){
 
   humd = myHumidity.readHumidity();
   temp = myHumidity.readTemperature(); 
 
   delay (1000);

   tft.setTextColor (BLACK,WHITE);
   tft.setTextSize (2);
   tft.setCursor (center_x-35,center_y+29); 
   tft.print (humd,1); 
   tft.setCursor (center_x-35,center_y-27); 
   tft.print (temp,1); 

   Serial.print ("Time: ");
   Serial.print (millis ());
   Serial.print (" Temperature: ");
   Serial.print (temp, 1);
   Serial.print ("C");
   Serial.print (" Humidity: ");
   Serial.print (humd, 1);
   Serial.println ("%"); 
}


void setup_the_screen (){

   tft.drawRoundRect (center_x-75, center_y-65, 120,140,4,RED);  
   tft.drawRoundRect (center_x-70, center_y-35, 110, 30,4,RED);
   tft.drawRoundRect (center_x-70, center_y+20, 110, 30,4,RED); 

   tft.setTextSize (1);
   tft.setTextColor (BLACK); 
    
   tft.setCursor (center_x-55, center_y-48);
   tft.print ("temperature"); 
   tft.setCursor (center_x+15, center_y-52);
   tft.print ("o");   
   tft.setCursor (center_x+21, center_y-48);
   tft.print ("C");   
   tft.setCursor (center_x-45, center_y+10);
   tft.print ("% humidity");
   tft.setCursor (center_x-61, center_y+63);
   tft.print ("ESP32-C3 + SHT21");
}
