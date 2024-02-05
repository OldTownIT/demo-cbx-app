import React from 'react';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useDispatch, useSelector } from 'react-redux';
import { changeMode, selectMode } from '../../store/user/userSlice';

function TemplateTester() {
    const dispatch = useDispatch();
    const mode = useSelector(selectMode);

    const colors = [
        {
            type: 'primary',
            colors: ['.light', '.main', '.dark'],
        },
        {
            type: 'secondary',
            colors: ['.light', '.main', '.dark'],
        },
        {
            type: 'error',
            colors: ['.light', '.main', '.dark'],
        },
        {
            type: 'warning',
            colors: ['.light', '.main', '.dark'],
        },
        {
            type: 'info',
            colors: ['.light', '.main', '.dark'],
        },
        {
            type: 'success',
            colors: ['.light', '.main', '.dark'],
        },
        {
            type: 'grey',
            colors: [
                '.50',
                '.100',
                '.200',
                '.300',
                '.400',
                '.500',
                '.600',
                '.700',
                '.800',
                '.900',
            ],
        },
        {
            type: 'background',
            colors: ['.default', '.paper', '.opposite', '.light'],
        },
        {
            type: 'text',
            colors: ['.primary', '.secondary', '.disabled'],
        },
    ];

    const typographies = [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'subtitle1',
        'subtitle2',
        'body1',
        'body2',
        'body3',
        'body4',
        'caption',
        'button',
        'overline',
    ];
    const themeTypes = (type, func) => (
        <Stack
            sx={{
                p: 2,
                boxShadow: 3,
                borderRadius: 5,
                position: 'relative',
                backgroundColor: 'grey.100',
            }}
            gap={2}
        >
            <Typography variant="h3">{type}</Typography> {func}
            <IconButton
                onClick={() => dispatch(changeMode())}
                sx={{ position: 'absolute', top: 10, right: 10 }}
            >
                <Brightness4Icon
                    sx={{
                        transition: 'transform 0.4s',
                        transform:
                            mode === 'dark'
                                ? 'rotateY(180deg)'
                                : 'rotateY(0deg)',
                    }}
                />
            </IconButton>
        </Stack>
    );

    const colorCards = colors.map((cat) => (
        <Stack key={cat.type} gap={2}>
            <Typography variant="h5">{cat.type}</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
                {cat.colors.map((color) => (
                    <Stack key={color}>
                        <Box
                            sx={{
                                boxShadow: 2,
                                width: { xs: 52, sm: 60, md: 76 },
                                height: { xs: 32, sm: 40, md: 46 },
                                backgroundColor: cat.type + color,
                                background:
                                    color === 'gradient' && cat.type + color,
                                borderRadius: 1,
                                p: 0.65,
                                '& p': {
                                    fontSize: { xs: 10, sm: 14, md: 16 },
                                    textShadow:
                                        mode === 'dark'
                                            ? '0px 0px 10px #000'
                                            : '0px 0px 10px #fff',
                                },
                            }}
                        >
                            <Typography fontWeight="bold">{color}</Typography>
                        </Box>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    ));

    const typoCards = typographies.map((typo) => (
        <Stack key={typo} gap={1}>
            <Typography variant={typo}>{typo}</Typography>
        </Stack>
    ));

    return (
        <Stack gap={5}>
            {themeTypes('#Colors', colorCards)}
            {themeTypes('#Typography', typoCards)}
        </Stack>
    );
}

export default TemplateTester;
