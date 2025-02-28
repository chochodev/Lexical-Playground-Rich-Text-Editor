import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { LuTrash2, LuLink } from "react-icons/lu";
import { useToolbarStore } from '@/store';

export default function LinkModal({
  linkUrl,
  insertLink,
  unlinkText,
}) {
  const { showInsertLinkModal, setShowInsertLinkModal } = useToolbarStore();
  const [link, setLink] = useState(linkUrl);

  useEffect(() => {
    if (showInsertLinkModal) {
      setLink(linkUrl);
    }
  }, [showInsertLinkModal, linkUrl]);
  
  const handleInsertLink = (e: any) => {
    e.preventDefault();
    const link = new FormData(e.target).get("link");
    if (link) {
      insertLink(link);
    }
    setShowInsertLinkModal(false);
  };

  return (
    <Modal
      isOpen={showInsertLinkModal}
      placement="top-center"
      onOpenChange={setShowInsertLinkModal}
    >
      <ModalContent>
        <form onSubmit={handleInsertLink}>
          <ModalHeader className="flex flex-col gap-1">Insert Link</ModalHeader>
          <ModalBody>
            <Input
              endContent={
                <LuLink className="pointer-events-none flex-shrink-0 text-default-400" />
              }
              label="Link Address"
              placeholder="https://example.com"
              name="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              variant="bordered"
              autoFocus
              className="rounded-lg border border-solid border-gray-200"
            />
          </ModalBody>
          <ModalFooter className="flex w-full justify-between">
            <Button
              color="warning"
              size="sm"
              variant="flat"
              onPress={unlinkText}
              className="min-w-[2rem] rounded-md p-2"
            >
              <LuTrash2 className="text-[1.25rem]" />
            </Button>
            <Button
              size="sm"
              className="rounded-md bg-neutral-800 text-neutral-200"
              onPress={handleInsertLink}
              type="submit"
            >
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
