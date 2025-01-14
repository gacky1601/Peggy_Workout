import React from 'react';
import { Avatar, Grid, Text } from '@radix-ui/themes';

export const BrandHeader = () => {
  return (
    <Grid style={{ margin: '10px' }}>
      <Text weight="bold">
        <Avatar
          size="1"
          src="https://mrt.yupooooo.me/logo512.png"
          radius="full"
          fallback="T"
        /> 小豬出行
      </Text>
    </Grid>

  );
};

export default BrandHeader;
