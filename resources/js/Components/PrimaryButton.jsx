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
            className={"cta-button cta-gradient " + className}
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
