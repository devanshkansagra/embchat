import React, { useMemo, useState } from "react";
import { Box } from "@embeddedchat/ui-elements";
import { Menu } from "../../components/SortableMenu";
import { useMessageToolboxStyles } from "./Message.styles";
import SurfaceMenu from "../../components/SurfaceMenu/SurfaceMenu";
import SurfaceItem from "../../components/SurfaceMenu/SurfaceItem";
import MenuItem from "../../components/SortableMenu/MenuItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

export const MessageToolbox = ({
  variantStyles = {},
  optionConfig = {
    surfaceItems: [
      "reaction",
      "reply",
      "quote",
      "star",
      "pin",
      "edit",
      "delete",
      "report",
    ],

    menuItems: [],
  },

  ...props
}) => {
  const styles = useMessageToolboxStyles();
  const [surfaceItems, setSurfaceItems] = useState(optionConfig.surfaceItems);
  const [menuItems, setMenuItems] = useState(optionConfig.menuItems);
  const [activeSurfaceItem, setActiveSurfaceItem] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState(null);

  const placeholderSurfaceItem = "placeholder-surface";
  const placeholderMenuItem = "placeholder-menu";

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1.5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    if (event.active.data.current?.type === "SurfaceOptions") {
      setActiveSurfaceItem({
        id: event.active.id,
        iconName: event.active.data.current.icon,
        label: event.active.data.current.label,
      });
    } else if (event.active.data.current?.type === "MenuOptions") {
      setActiveMenuItem({
        id: event.active.id,
        icon: event.active.data.current.icon,
        label: event.active.data.current.label,
      });
    }
  };

  const handleDragEnd = (event) => {
    setActiveSurfaceItem(null);
    setActiveMenuItem(null);
    const { active, over } = event || {};

    if (active?.id !== over?.id) {
      if (
        event.active.data.current?.type === "SurfaceOptions" &&
        event.over.data.current?.type === "SurfaceOptions"
      ) {
        setSurfaceItems((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      } else if (
        event.active.data.current?.type === "MenuOptions" &&
        event.over.data.current?.type === "MenuOptions"
      ) {
        setMenuItems((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      } else if (
        event.active.data.current?.type === "SurfaceOptions" &&
        event.over.data.current?.type === "MenuOptions"
      ) {
        setSurfaceItems((items) => items.filter((item) => item !== active.id));
        setMenuItems((items) => {
          const newItems = [
            ...items.filter((item) => item !== placeholderMenuItem),
            active.id,
          ];
          return newItems;
        });
      } else if (
        event.active.data.current?.type === "MenuOptions" &&
        event.over.data.current?.type === "SurfaceOptions"
      ) {
        setMenuItems((items) => items.filter((item) => item !== active.id));
        setSurfaceItems((items) => {
          const newItems = [
            ...items.filter((item) => item !== placeholderSurfaceItem),
            active.id,
          ];
          return newItems;
        });
      }
    }
  };

  const options = useMemo(
    () => ({
      reply: {
        label: "Reply in thread",
        id: "reply",
        onClick: () => {},
        iconName: "thread",
        visible: true,
      },
      quote: {
        label: "Quote",
        id: "quote",
        onClick: () => {},
        iconName: "quote",
        visible: true,
      },
      star: {
        label: "Star",
        id: "star",
        onClick: () => {},
        iconName: "star",
        visible: true,
      },
      reaction: {
        label: "Add reaction",
        id: "reaction",
        onClick: () => {},
        iconName: "emoji",
        visible: true,
      },
      pin: {
        label: "Pin",
        id: "pin",
        onClick: () => {},
        iconName: "pin",
        visible: true,
      },
      edit: {
        label: "Edit",
        id: "edit",
        onClick: () => {},
        iconName: "edit",
        visible: true,
      },
      delete: {
        label: "Delete",
        id: "delete",
        onClick: () => {},
        iconName: "trash",
        visible: true,
        type: "destructive",
      },
      report: {
        label: "Report",
        id: "report",
        onClick: () => {},
        iconName: "report",
        visible: true,
        type: "destructive",
      },
    }),
    []
  );

  const menuOptions =
    menuItems.length > 0
      ? menuItems
          ?.map((item) => {
            if (item in options && options[item].visible) {
              return {
                id: options[item].id,
                action: options[item].onClick,
                label: options[item].label,
                icon: options[item].iconName,
              };
            }
            return null;
          })
          .filter((option) => option !== null)
      : [{ id: placeholderMenuItem, label: "No items", icon: "plus" }];

  const surfaceOptions =
    surfaceItems.length > 0
      ? surfaceItems
          ?.map((item) => {
            if (item in options && options[item].visible) {
              return {
                id: options[item].id,
                onClick: options[item].onClick,
                label: options[item].label,
                iconName: options[item].iconName,
                type: options[item].type,
              };
            }
            return null;
          })
          .filter((option) => option !== null)
      : [{ id: placeholderSurfaceItem, label: "No items", iconName: "plus" }];

  return (
    <>
      <Box css={variantStyles.toolboxContainer || styles.toolboxContainer}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <Box css={styles.toolbox} className="ec-message-toolbox" {...props}>
            {surfaceOptions?.length > 0 && (
              <SurfaceMenu options={surfaceOptions} size="small" />
            )}
            {menuOptions?.length > 0 && (
              <Menu
                size="small"
                options={menuOptions}
                from="bottom"
                tooltip={{ isToolTip: true, position: "top", text: "More" }}
                useWrapper={false}
                style={{ top: "auto", bottom: `calc(100% + 2px)` }}
              />
            )}
          </Box>
          {createPortal(
            <DragOverlay zIndex={1700}>
              {activeSurfaceItem && (
                <SurfaceItem {...activeSurfaceItem} size="small" />
              )}
              {activeMenuItem && <MenuItem {...activeMenuItem} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </Box>
    </>
  );
};
