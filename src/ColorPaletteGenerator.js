import React, { useState, useEffect, createContext, useContext } from "react";
import { Hsluv } from "hsluv";
import { AppBar, Toolbar, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CssBaseline, Stack, ThemeProvider, createTheme} from "@mui/material";
import Grid from '@mui/material/Grid2';

// icons and logos
import lightLogo from "./enverus-logo-light.svg";  // Light mode logo
import darkLogo from "./enverus-logo-dark.svg";  // Dark mode logo
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

/* ------ PARAMETERS ------ */


/*
    # 📌 Adjustments for Light & Dark Mode Colors

    # Saturation Adjustments
    
    # Some hues need slight saturation tweaks to achieve visual balance with the others:
        - Red, Orange: Sat = 80-90 (to control intensity).
        - Yellow: Sat = 90 (prevents it from appearing too light).
        - Green: Sat = 85-90 (prevents dullness).
        - Blue, Purple: Sat = 100 (to maintain vibrancy).

    # Hue-Adjusted Saturation
        - For Light Mode: Slightly reduce saturation to avoid overly vibrant colors.
        - For Dark Mode: Increase saturation to prevent dullness.

    |------------|------------------------------|-------------------------------|
    | Color      | Light Mode (Saturation%)     | Dark Mode (Saturation%)       |
    |------------|------------------------------|-------------------------------|
    | Red        | 80%                          | 90%                           |
    | Orange     | 85%                          | 95%                           |
    | Yellow     | 90%                          | 80% (reduce to prevent glare) |
    | Green      | 70%                          | 75%                           |
    | Cyan       | 60%                          | 80%                           |
    | Blue       | 100%                         | 85%                           |
    | Purple     | 100%                         | 95%                           |
    |------------|------------------------------|-------------------------------|

    # Lightness Adjustments
        - For Light Mode: reduce lightness slightly to maintain contrast.
        - For Dark Mode: increase the lightness of colors to compensate for the dark background.
    |------------|------------------------------|-------------------------------|
    | Color      | Light Mode (Lightness adj)   | Dark Mode (Lightness adj)     |
    |------------|------------------------------|-------------------------------|
    | Red        | -1%                          | -                             |
    | Orange     | -5%                          | -                             |
    | Yellow     | -1%                          | -                             |
    | Green      | +1%                          | +1%                           |
    | Cyan       | -1%                          | +2%                           |
    | Blue       | -                            | -                             |
    | Purple     | -                            | +2%                           |
    |------------|------------------------------|-------------------------------|

    > **Why?** Dark mode backgrounds are darker, so colors need **higher lightness** for better contrast.
*/



// Base Hue and Saturation values for light and dark modes
const LIGHT_MODE_COLOR_PARAMS = [ 
    { name: "Red", hue: 10, sat: 75, minLightness: 5, maxLightness: 92 },
    { name: "Orange", hue: 30, sat: 75, minLightness: 7, maxLightness: 89 },
    { name: "Yellow", hue: 60, sat: 80, minLightness: 4, maxLightness: 96},
    { name: "Green", hue: 120, sat: 60, minLightness: 3, maxLightness: 99},
    { name: "Cyan", hue: 180, sat: 75, minLightness: 3, maxLightness: 98},
    { name: "Blue", hue: 240, sat: 75, minLightness: 3, maxLightness: 95},
    { name: "Purple", hue: 290, sat: 75, minLightness: 3, maxLightness: 95},
];

const DARK_MODE_COLOR_PARAMS = [ 
    { name: "Red", hue: 10, sat: 90, minLightness: 8, maxLightness: 93 },
    { name: "Orange", hue: 30, sat: 90, minLightness: 10, maxLightness: 93 },
    { name: "Yellow", hue: 60, sat: 80, minLightness: 10, maxLightness: 93 },
    { name: "Green", hue: 120, sat: 70, minLightness: 8, maxLightness: 98 },
    { name: "Cyan", hue: 180, sat: 80, minLightness: 8, maxLightness: 98 },
    { name: "Blue", hue: 240, sat: 90, minLightness: 8, maxLightness: 95 },
    { name: "Purple", hue: 290, sat: 90, minLightness: 8, maxLightness: 95 },
];

// the name of the colors in each ramp (i.e. red 0, red 10, etc)e 
const STEP_NAMES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100];

const NEUTRAL_STEP_NAMES = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100];

const NEUTRAL_PARAMS = [ 
    { name: "Neutral0", hue: 5, sat: 0, minLightness: 0, maxLightness: 100 },
    { name: "Neutral1", hue: 10, sat: 0, minLightness: 0, maxLightness: 100 },
];


// Context for toggling dark mode
const ThemeContext = createContext();

// Generates a color ramp based on the base hue and sat values passed.
const generateColorRamp = (colorName, hue, sat, minLightness, maxLightness, stepNames) => {
    const lightnessValues = Array.from(
        { length: stepNames.length },
        (_, i) => Math.round(
            minLightness + 
            ((maxLightness - minLightness) * i) / (stepNames.length - 1)
        )
    );

    return lightnessValues.map((l) => {
        const hsluvInstance = new Hsluv();
        hsluvInstance.hsluv_h = hue;
        hsluvInstance.hsluv_s = sat;
        hsluvInstance.hsluv_l = l;
        hsluvInstance.hsluvToRgb();

        const r = Math.round(hsluvInstance.rgb_r * 255);
        const g = Math.round(hsluvInstance.rgb_g * 255);
        const b = Math.round(hsluvInstance.rgb_b * 255);

        const rgbaColor = `rgb(${r},${g},${b})`;
        const hexColor = rgbToHex([r / 255, g / 255, b / 255]);

        return {
            step: stepNames[lightnessValues.indexOf(l)],  
            hex: hexColor,
            rgba: rgbaColor,
            hsl: `hsl(${hue},${sat},${l})`
        };
    });
};

// Generator for the default color palette
const ColorPaletteGenerator = () => {    
    const { darkMode, toggleTheme } = useContext(ThemeContext);

    // Select the appropriate saturation values based on theme
    const selectedParams = darkMode ? DARK_MODE_COLOR_PARAMS : LIGHT_MODE_COLOR_PARAMS;
    const logMessage = darkMode ? 'generating palette for dark mode' : 'generating palette for light mode';
    console.log(logMessage);

    const [colorRamps, setColorRamps] = useState([]);

    // Generate color ramps when component mounts or when theme changes
    useEffect(() => {
        setColorRamps(
            selectedParams.map(({ name, hue, sat, minLightness, maxLightness }) => ({
                name,
                hue,
                sat,
                colorRamp: generateColorRamp(name, hue, sat, minLightness, maxLightness, STEP_NAMES),
            }))
        );
        
    }, [darkMode, selectedParams]); // Runs only when darkMode changes
    
    

    const [loading] = useState(false);

    return (
        (<div style={{ padding: "15px", textAlign: "left" }}>
            <AppBar component="nav">                
                <Toolbar>
                    <img height="50px" alt="enverus logo" className="logo"  src={darkMode ? darkLogo : lightLogo} />
                    <div style={{ lineHeight: "1", height: "14px", fontSize: "22px", verticalAlign: "bottom", marginLeft: "8px" }}> HSLuv Color Palette Generator </div>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2} style={{marginTop: '50px'}}>
                <Grid size={6}>
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            paddingBottom: "16px"
                        }}
                    >
                        <Button
                            onClick={toggleTheme}
                            LightModeIcon
                            style={{
                                backgroundColor: darkMode ? "#444" : "#ddd",
                                color: darkMode ? "#fff" : "#000",
                            }}
                        >
                            {darkMode ?<LightModeIcon /> :  <DarkModeIcon/> } &nbsp; Go {darkMode ? 'Light'  : "Dark"} 
                        </Button>
                    </Stack>
                </Grid>
                <Grid size={6}>
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                            paddingBottom: "16px"
                        }}
                    >
                        <Button
                            onClick={() => exportAsJSON(colorRamps)}
                            style={{
                                    backgroundColor: darkMode ? "#444" : "#ddd",
                                    color: darkMode ? "#fff" : "#000",
                                }}
                        >
                            Export JSON
                        </Button>
                        <Button
                            onClick={() => exportAsCSV(colorRamps)}
                            style={{
                                    backgroundColor: darkMode ? "#444" : "#ddd",
                                    color: darkMode ? "#fff" : "#000",
                                }}
                        >
                            Export CSV
                        </Button>
                        <Button onClick={() => exportAsDesignTokens(colorRamps)} style={{
                                    backgroundColor: darkMode ? "#444" : "#ddd",
                                    color: darkMode ? "#fff" : "#000",
                                }}>
                            Export Design Tokens
                        </Button>
                        <Button
                            onClick={() => exportToFigma(colorRamps)}
                            style={{
                                backgroundColor: darkMode ? "#444" : "#ddd",
                                color: darkMode ? "#fff" : "#000",
                            }}
                        >
                            Export to Figma
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
            {!loading ? ( // Hide the palette when regenerating
                (<TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Color
                                </TableCell>
                                {Array.from({ length: STEP_NAMES.length }, (_, i) => (
                                    <TableCell key={i} align="center">
                                        {" "}
                                        {STEP_NAMES[i]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {colorRamps.map(({ name, colorRamp }) => (
                                <TableRow key={name}>
                                    <TableCell>
                                        <small>{name}</small>
                                    </TableCell>
                                    {colorRamp.map(({ hex, rgba, hsl }, i) => (
                                        <TableCell
                                            key={i}
                                            align="center"
                                            style={{
                                                backgroundColor: hex,
                                                color: (parseInt(hsl.match(/\d+/g)[2]) >= 50 ? "black" : "white"),
                                                padding: "10px",
                                            }}
                                            title={hsl} // Show HSLuv value on hover
                                        >
                                            <p><pre>{hex}</pre></p>
                                            <div>
                                                <code style={{ whiteSpace: 'nowrap', fontWeight: '500' }}>{rgba}</code>
                                            </div>
                                             <div>
                                                <code style={{ whiteSpace: 'nowrap', fontWeight: '500' }}>{hsl}</code>
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>)
            ) : (
            (<h2 style={{ marginTop: "20px" }}>Regenerating Palette...</h2>) // Show regenerating message
        )}
        </div>)
    );
};


// Generator for the neutral color palette
const NeutralPaletteGenerator = () => {    
    const { darkMode, toggleTheme } = useContext(ThemeContext);

    // Select the appropriate saturation values based on theme
    const selectedParams = NEUTRAL_PARAMS;
    const logMessage = 'generating neutral palette';
    console.log(logMessage);

    const [colorRamps, setColorRamps] = useState([]);

    // Generate color ramps when component mounts or when theme changes
    useEffect(() => {
        setColorRamps(
            selectedParams.map(({ name, hue, sat, minLightness, maxLightness }) => ({
                name,
                hue,
                sat,
                colorRamp: generateColorRamp(name, hue, sat, minLightness, maxLightness, NEUTRAL_STEP_NAMES),
            }))
        );
        
    }, [selectedParams]); 
    
    
    const [loading] = useState(false);

    return (
        (<div style={{ padding: "15px", textAlign: "left" }}>
            <AppBar component="nav">                
                <Toolbar>
                    <img height="50px" alt="enverus logo" className="logo"  src={darkMode ? darkLogo : lightLogo} />
                    <div style={{ lineHeight: "1", height: "14px", fontSize: "22px", verticalAlign: "bottom", marginLeft: "8px" }}> HSLuv Color Palette Generator </div>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2} style={{marginTop: '50px'}}>
                <Grid size={6}>
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            paddingBottom: "16px"
                        }}
                    >
                       
                        <Button
                            onClick={toggleTheme}
                            LightModeIcon
                            style={{
                                backgroundColor: darkMode ? "#444" : "#ddd",
                                color: darkMode ? "#fff" : "#000",
                            }}
                        >
                            {darkMode ?<LightModeIcon /> :  <DarkModeIcon/> } &nbsp; Go {darkMode ? 'Light'  : "Dark"} 
                        </Button>
                    </Stack>
                </Grid>
                <Grid size={6}>
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                            paddingBottom: "16px"
                        }}
                    >
                        <Button
                            onClick={() => exportAsJSON(colorRamps)}
                            style={{
                                    backgroundColor: darkMode ? "#444" : "#ddd",
                                    color: darkMode ? "#fff" : "#000",
                                }}
                        >
                            Export JSON
                        </Button>
                        <Button
                            onClick={() => exportAsCSV(colorRamps)}
                            style={{
                                    backgroundColor: darkMode ? "#444" : "#ddd",
                                    color: darkMode ? "#fff" : "#000",
                                }}
                        >
                            Export CSV
                        </Button>
                        <Button onClick={() => exportAsDesignTokens(colorRamps)} style={{
                                    backgroundColor: darkMode ? "#444" : "#ddd",
                                    color: darkMode ? "#fff" : "#000",
                                }}>
                            Export Design Tokens
                        </Button>
                        <Button
                            onClick={() => exportToFigma(colorRamps)}
                            style={{
                                backgroundColor: darkMode ? "#444" : "#ddd",
                                color: darkMode ? "#fff" : "#000",
                            }}
                        >
                            Export to Figma
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            {!loading ? ( // Hide the palette when regenerating
                (<TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Color
                                </TableCell>
                                {Array.from({ length: NEUTRAL_STEP_NAMES.length }, (_, i) => (
                                    <TableCell key={i} align="center">
                                        {" "}
                                        {NEUTRAL_STEP_NAMES[i]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {colorRamps.map(({ name, colorRamp }) => (
                                <TableRow key={name}>
                                    <TableCell>
                                        <small>{name}</small>
                                    </TableCell>
                                    {colorRamp.map(({ hex, hsl, rgba }, i) => (
                                        <TableCell
                                            key={i}
                                            align="center"
                                            style={{
                                                backgroundColor: hex,
                                                color: (parseInt(hsl.match(/\d+/g)[2]) >= 50 ? "black" : "white"),
                                                padding: "10px",
                                            }}
                                            title={hsl} // Show HSLuv value on hover
                                        >
                                            <p><pre>{hex}</pre></p>
                                            <div>
                                                <code style={{ whiteSpace: 'nowrap', fontWeight: '500' }}>{rgba}</code>
                                            </div>
                                            <div>
                                                <code style={{ whiteSpace: 'nowrap', fontWeight: '500' }}>{hsl}</code>
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>)
            ) : (
            (<h2 style={{ marginTop: "20px" }}>Regenerating Palette...</h2>) // Show regenerating message
        )}
        </div>)
    );
};


// Light/Dark Mode Theme Provider Component
const ThemeProviderComponent = ({ children }) => {
    const [darkMode, setDarkMode] = useState(true);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
            background: {
                default: darkMode ? "#1e1e1e" : "#ffffff", // Dark mode: dark gray, Light mode: light gray
                paper: darkMode ? "#1e1e1e" : "#ffffff",  // Table background colors
            },
            text: {
                primary: darkMode ? "#ffffff" : "#000000", // Adjust text colors
            }
        },
        components: {
            MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: "14px", // Default font size for all table cells
                },
            },
            },
        },
    });

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div style={{ backgroundColor: theme.palette.background.default, minHeight: "100vh", padding: "20px" }}>
                    {children}
                </div>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};


// Function to create a hex color code from an rgb array of red, green, blue values.
const rgbToHex = (rgbArray) => {
    return (
        "#" +
        rgbArray
            .map((value) => {
                const hex = Math.round(value * 255).toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            })
            .join("")
    );
};

// function to download an exported token file
const downloadFile = (data, filename, type) => {
    const blob = new Blob([data], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// function to export design tokens in JSON Format
const exportAsJSON = (colorRamps) => {
    // console.log('color ramps: ' + JSON.stringify(colorRamps));
    const jsonData = JSON.stringify(colorRamps, null, 2);
    downloadFile(jsonData, "color_palette.json", "application/json");
};

const exportToFigma = (colorRamps) => {
  // Create a Figma-compatible color styles object
  const figmaStyles = {};
  
  colorRamps.forEach(({ name, colorRamp }) => {
    colorRamp.forEach(({ hex, step }) => {
      // Create style key in format "color/red/100" or "color/blue/50"
      const styleKey = `color/${name.toLowerCase()}/${step}`;
      
      // Convert hex to RGB values (0-1 range as Figma expects)
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      // Create Figma color style object
      figmaStyles[styleKey] = {
        name: styleKey,
        description: `${name} ${step}`,
        paints: [
          {
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: { r, g, b }
          }
        ]
      };
    });
  });
  
  // Create text representation for copying
  const figmaText = JSON.stringify(figmaStyles, null, 2);
  
  // Create a textarea element to hold the text for copying
  const textArea = document.createElement("textarea");
  textArea.value = figmaText;
  textArea.style.position = "fixed";  // Make it invisible
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    // Execute copy command
    const successful = document.execCommand('copy');
    if (successful) {
      alert("Figma styles copied to clipboard! Paste in Figma's Import dialog.");
    } else {
      throw new Error("Copy command failed");
    }
  } catch (err) {
    console.error("Could not copy to clipboard: ", err);
    // Fallback: Create downloadable file
    downloadFile(figmaText, "figma_color_styles.json", "application/json");
  } finally {
    // Clean up
    document.body.removeChild(textArea);
  }
};
// function to export design tokens in CSV Format
const exportAsCSV = (colorRamps) => {
    let csv = "Color Name," + STEP_NAMES.join(",") + "\n";

    colorRamps.forEach(({ name, colorRamp }) => {
        csv += name + "," + colorRamp.map(({ hex }) => hex).join(",") + "\n";
    });

    downloadFile(csv, "color_palette.csv", "text/csv");
};

// function to export design tokens in Design Token Community Group Format
// TODO: this needs some love as it's not currently in the proper DTCG format. 
const exportAsDesignTokens = (colorRamps) => {
    const designTokens = {
        "$schema": "https://design-tokens.github.io/community-group/format/",
        "color": {}
    };

    // TODO: this needs to handle color for both dark and light modes
    colorRamps.forEach(({ name, colorRamp }) => {
        designTokens.color[name.toLowerCase()] = {};
        colorRamp.forEach(({ hex, step }) => {
            designTokens.color[name.toLowerCase()][`${step}`] = {
                "value": hex
            };
        });
    });

    downloadFile(JSON.stringify(designTokens, null, 2), "design_tokens.json", "application/json");
};

const App = () => {
    return (
        <ThemeProviderComponent>
            <ColorPaletteGenerator />
            <NeutralPaletteGenerator />
        </ThemeProviderComponent>
    );
};

export default App;