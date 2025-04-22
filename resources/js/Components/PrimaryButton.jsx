import {useEffect, useState} from "react";
import {Box, Button, useTheme} from "@mui/material";

export default function PrimaryButton({
                                          className = '',
                                          disabled,
                                          children,
                                          ...props
                                      }) {

    const theme = useTheme();

    return (
        <Button
            component={props.href ? 'a' : 'button'}
            {...props}
            className={"px-4 py-2 text-lg text-white tracking-wider rounded-lg"
                + " bg-gradient-to-r from-orange-300 to-teal-600"
                + " hover:from-orange-400 hover:to-teal-700"
                + " hover:shadow-xl hover:shadow-teal-500/30"
                + " focus:outline-none focus:ring-1 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                + " hover:before:blur-2xl "
                + className}
            type={props.type || 'submit'}
            sx={{
                color: theme.palette.common.white,
                fontWeight: 600,
                ...props.sx
            }}
            disabled={disabled}
        >
            {children}
        </Button>
    );
}
