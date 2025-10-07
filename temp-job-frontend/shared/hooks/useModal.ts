import { useState } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  function onOpen() {
    setIsOpen(true);
  }

  function onClose() {
    setIsOpen(false);
  }

  return { isOpen, onOpen, onClose };
}
