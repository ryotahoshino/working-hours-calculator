import { Meta, StoryObj } from "@storybook/react";

import Calender from "./Calender";

export default {
  title: "Components/Calender",
  component: Calender,
} as Meta<typeof Calender>;

type Story = StoryObj<typeof Calender>;

export const Default: Story = {
  render: (args) => <Calender {...args} />,
};
