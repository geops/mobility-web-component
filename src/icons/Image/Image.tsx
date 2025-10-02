import { MdOutlineImage } from "react-icons/md";

import type { IconBaseProps } from "react-icons";

function Image(props: IconBaseProps) {
  return <MdOutlineImage size={24} {...props} />;
}

export default Image;
