import React from 'react';
import { css, Global } from '@emotion/react';
import { useTheme, alpha } from '@embeddedchat/ui-elements';

const getGlobalStyles = (theme) => css`
  .ec-embedded-chat * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .ec-embedded-chat body {
    font-family: ${theme.typography.default.fontFamily};
    font-size: ${theme.typography.default.fontSize}px;
    font-weight: ${theme.typography.default.fontWeightRegular};
  }

  .ec-embedded-chat a {
    color: ${theme.colors.foreground};
  }

  .ec-embedded-chat ::-webkit-scrollbar {
    width: 4px;
    height: 7.7px;
  }

  .ec-embedded-chat ::-webkit-scrollbar-thumb {
    background: ${alpha(theme.colors.primary, 0.5)};
    border-radius: 4px;
  }

  .ec-embedded-chat ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primary};
    cursor: pointer;
  }

  .ec-embedded-chat ::-webkit-scrollbar-button {
    display: none;
  }
  @media (max-width: 780px) {
    .ec-sidebar {
      position: absolute;
      width: 100% !important;
      height: calc(100% - 56.39px) !important;
      min-width: 250px !important;
      left: 0;
      bottom: 0;
      background: ${theme.colors.background}!important;
    }
  }
`;

const GlobalStyles = () => {
  const { theme } = useTheme();
  const styles = getGlobalStyles(theme);

  return <Global styles={styles} />;
};

export default GlobalStyles;
