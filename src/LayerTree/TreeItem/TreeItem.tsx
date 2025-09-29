import { useContext, useEffect, useId, useState } from "preact/compat";

import ArrowDown from "../../icons/ArrowDown";
import ArrowUp from "../../icons/ArrowUp";
import minusGrey from "../../icons/Minus/minus.svg";
import Checkbox from "../../ui/Checkbox";
// import RvfRadioButton from "../../RvfRadioButton";
import { LayersTreeDispatchContext } from "../layersTreeContext";

import type BaseLayer from "ol/layer/Base";
import type { HTMLAttributes, PreactDOMAttributes } from "preact";
import type { SVGProps } from "preact/compat";

export enum SelectionType {
  CHECKBOX = "checkbox",
  RADIO = "radio",
}

export type TreeItemProps = {
  childItems: TreeItemProps[];
  Icon?: (props: SVGProps<SVGSVGElement>) => preact.JSX.Element;
  id: string;
  isCollapsedOnControlClick?: boolean;
  isControlChecked?: boolean;
  layer?: BaseLayer;
  onIconClick?: () => void;
  selectionType: SelectionType;
  title: string;
} & HTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

function TreeItem({
  childItems,
  isCollapsedOnControlClick,
  isControlChecked,
  layer,
  selectionType,
  title,
}: TreeItemProps) {
  const [isContainerVisible, setIsContainerVisible] = useState(true);
  const dispatch = useContext(LayersTreeDispatchContext);
  const inputId = useId();
  const buttonId = useId();

  useEffect(() => {
    if (isCollapsedOnControlClick) {
      setIsContainerVisible(isControlChecked);
    }
  }, [isControlChecked, isCollapsedOnControlClick, layer]);

  const handleItemClick = () => {
    setIsContainerVisible(!isContainerVisible);

    if (isCollapsedOnControlClick && !isContainerVisible) {
      dispatch({
        payload: {
          ...this.props,
          isControlChecked: true,
        },
        type: "SELECT_ITEM",
      });
    }
  };

  const handleSelectionChange = (event) => {
    dispatch({
      payload: {
        ...this.props,
        isControlChecked: event.target.checked,
      },
      type: "SELECT_ITEM",
    });
  };

  const renderedLayers = childItems
    .filter(({ title: titlee }) => {
      return !!titlee;
    })
    .map((item, idx) => {
      return <TreeItem key={idx} {...item} />;
    });

  if (!title) {
    return null;
  }

  const isMiddleState = () => {
    if (childItems.length > 0) {
      const checkedItems = childItems.filter((item) => {
        return item.isControlChecked;
      });
      if (checkedItems.length === childItems.length) {
        return false;
      }

      return childItems.some((item) => {
        return item.isControlChecked;
      });
    }

    return false;
  };

  return (
    <div>
      <div className="flex items-center gap-2 border-b py-2 pr-1">
        {selectionType === SelectionType.RADIO ? null : (
          // <RvfRadioButton
          //   checked={isControlChecked}
          //   id={inputId}
          //   onChange={handleSelectionChange}
          // />
          <Checkbox
            checked={isControlChecked}
            checkedIconUrl={isMiddleState() ? minusGrey : null}
            className={isMiddleState() ? "bg-[length:18px]" : ""}
            id={inputId}
            onChange={handleSelectionChange}
          />
        )}
        <label
          className={`flex-1 cursor-pointer`}
          htmlFor={renderedLayers.length > 0 ? buttonId : inputId}
        >
          {title}
        </label>
        {renderedLayers.length > 0 && (
          <button
            className={`flex cursor-pointer items-center gap-2`}
            id={buttonId}
            onClick={handleItemClick}
          >
            {isContainerVisible ? <ArrowUp /> : <ArrowDown />}
          </button>
        )}
      </div>
      {isContainerVisible && renderedLayers.length > 0 && (
        <div className="pl-6">{renderedLayers}</div>
      )}
    </div>
  );
}

export default TreeItem;
