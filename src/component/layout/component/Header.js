import { Box, Grid, Stack } from '@mui/material'
import React from 'react'


function Header() {
    return (
        <Box sx={{ background: "black", py: '8px', px: 1, }} className="">
            <Grid container spacing={0} xs={12}>
                <Grid container item xs={6}>
                    <Box className="!text-white !font-bold !text-2xl">Wheel</Box>
                </Grid>
                <Grid container item xs={6}>
                    <Stack direction='row' sx={{ width: '100%', alignItems: 'center', justifyContent: 'end', position: 'relative'  }}>
                        {/* <Box className="!rounded " component='img' src={logo} sx={{ height: '25px' , background :'white'}}></Box> */}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Header
