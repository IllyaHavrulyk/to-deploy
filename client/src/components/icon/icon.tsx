import Add from "../../assets/icons/add.svg?react";
import Copy from "../../assets/icons/copy.svg?react";
import Delete from "../../assets/icons/delete.svg?react";
import { type IconName } from "../../common/types/types";

type Props = {
  iconName: IconName;
};

const iconNameToComponent: Record<
  IconName,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  add: Add,
  copy: Copy,
  delete: Delete,
};

const Icon: React.FC<Props> = ({ iconName }) => {
  const IconComponent = iconNameToComponent[iconName];

  return <IconComponent />;
};

export { Icon };
