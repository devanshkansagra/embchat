import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Box } from '../../components/Box';
import { useRecentMessageStyles } from './ChatBody.styles';

const RecentMessageButton = ({ visible, onClick, text }) => {
  const [clicked, setClicked] = useState(false);
  const styles = useRecentMessageStyles();
  return (
    <Button
      css={[styles.button, !visible && 'not', clicked && 'clicked']}
      type="primary"
      size="small"
      onClick={() => {
        onClick();
        setClicked(true);
      }}
    >
      <Box css={styles.textIconContainer}>
        {text}
        <Icon name="arrow-down" size={16} />
      </Box>
    </Button>
  );
};

export default RecentMessageButton;
