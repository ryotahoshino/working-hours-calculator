import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import FileSelector from './FIleSelector';

export default {
  title: 'Components/FileSelector',
  component: FileSelector,
} as Meta<typeof FileSelector>;

export const Default: StoryObj<typeof FileSelector> = {
  render: (args) => <FileSelector {...args} />,
  args: {
    onSelect: (id: string, files: FileList | null) => {
      if (files) {
        console.log('Selected files:', files);
      }
    },
  },
};
