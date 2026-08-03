declare module 'react-window' {
  import * as React from 'react';

  type GridChildComponentProps = {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
  };

  export const FixedSizeGrid: React.ComponentType<any>;
  export const FixedSizeList: React.ComponentType<any>;
  export type GridChildComponentPropsType = GridChildComponentProps;
}
