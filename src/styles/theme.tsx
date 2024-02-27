import { Theme, createTheme } from "@mui/material";

export const ColorPalette = {
    fontDark: "#101727",
    fontLight: "#f0f0f0",
    blueSky: "#457b9d",
    red: "#ff3131",
};

export const MuiTheme: Theme = createTheme({
    components: {
        MuiTooltip: {
            defaultProps: {
                disableInteractive: true,
                style: {
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                },
            },
        },
        MuiSelect: {
            defaultProps: {
                style: {
                    borderRadius: "18px",
                },
            },
        },
    },
    typography: {
        fontFamily: '"Poppins", sans-serif',
    },

    palette: {
        primary: {
            main: ColorPalette.blueSky,
        },
        secondary: {
            main: "#bababa",
        },
        error: {
            main: ColorPalette.red,
        },
    },
});