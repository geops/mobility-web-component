import { SelectionType } from "./TreeItem/TreeItem";

const ROOT = {
  childItems: [],
  parent: null,
};

const mapNode = (childItems, parent) => {
  for (const child of childItems) {
    child.parent = parent;

    if (child.childItems.length) {
      mapNode(child.childItems, child);
    }
  }
};

const initTree = (tree) => {
  const initializedTree = { ...ROOT };
  initializedTree.childItems = tree;
  mapNode(initializedTree.childItems, initializedTree);

  return initializedTree;
};

const findNodeInTree = (node, nodeToFind) => {
  if (node.id === nodeToFind.id) {
    return node;
  }

  if (node.childItems.length) {
    for (const child of node.childItems) {
      const res = findNodeInTree(child, nodeToFind);
      if (res) {
        return res;
      }
    }
  }
};

const updateCheckedControlStatus = (currentItem, newItem, isParentUpdate) => {
  if (newItem.isControlChecked) {
    if (newItem.selectionType === SelectionType.CHECKBOX) {
      currentItem.isControlChecked = newItem.isControlChecked;
      currentItem.layer.setVisible(currentItem.isControlChecked);
    } else {
      for (const child of currentItem.parent.childItems) {
        child.isControlChecked = child.id === currentItem.id;

        if (!child.isControlChecked) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          updateRadioChildNodes(child);
        }
      }
    }
  } else {
    if (newItem.selectionType === SelectionType.CHECKBOX) {
      currentItem.isControlChecked = newItem.isControlChecked;
      currentItem.layer.setVisible(currentItem.isControlChecked);
    }
  }

  // check all children
  if (currentItem.childItems.length && !isParentUpdate) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    updateChildNodes(currentItem);
  }

  // check all parents
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  updateParentNodes(currentItem);
};

const setNewControlCheckedStatus = (tree, newItem) => {
  const currentItem = findNodeInTree(tree, newItem);

  if (currentItem) {
    updateCheckedControlStatus(currentItem, newItem, false);
  }

  return { ...tree };
};

const updateChildNodes = (node) => {
  if (node.childItems[0].selectionType === SelectionType.RADIO) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    updateRadioChildNodes(node);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    updateCheckboxChildNodes(node);
  }
};

const updateRadioChildNodes = (parent) => {
  if (parent.isControlChecked) {
    for (let i = 0; i < parent.childItems.length; i++) {
      parent.childItems[i].isControlChecked = i === 0;
    }
  } else {
    for (const child of parent.childItems) {
      child.isControlChecked = false;
    }
  }

  if (parent.childItems.length) {
    if (parent.childItems[0].childItems.length) {
      updateChildNodes(parent.childItems[0]);
    }
  }
};

const updateCheckboxChildNodes = (parent) => {
  for (const child of parent.childItems) {
    child.isControlChecked = parent.isControlChecked;
    child.layer.setVisible(child.isControlChecked);

    if (child.childItems.length) {
      updateChildNodes(child);
    }
  }
};

const updateParentNodes = (node) => {
  if (node.parent) {
    if (node.parent.selectionType === SelectionType.CHECKBOX) {
      const newItem = {
        ...node.parent,
        isControlChecked: node.parent.childItems.some((child) => {
          return child.isControlChecked;
        }),
      };
      updateCheckedControlStatus(node.parent, newItem, true);
    } else {
      if (node?.parent?.parent) {
        const newItem = {
          ...node.parent,
          isControlChecked: node.parent.childItems.some((child) => {
            return child.isControlChecked;
          }),
        };
        updateCheckedControlStatus(node.parent, newItem, true);
      }
    }
  }
};

function layersTreeReducer(state = ROOT, action) {
  switch (action.type) {
    case "INIT":
      return initTree(action.payload);
    case "SELECT_ITEM":
      return setNewControlCheckedStatus(state, action.payload);
    default:
      return state;
  }
}

export default layersTreeReducer;
