import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@heroui/react';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import FileInput from '@/ui/file-input';
import {
  INSERT_IMAGE_COMMAND,
  InsertImagePayload,
} from '@/plugins/ImagesPlugin';

export default function ImageModal({ isOpen, setIsOpen, editor }) {
  const [mode, setMode] = useState<null | 'url' | 'file'>(null);
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');
  
  const loadImage = (files: FileList | null) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setSrc(reader.result);
      }
      return '';
    };
    if (files !== null) {
      reader.readAsDataURL(files[0]);
    }
  };

  const handleOnClick = (payload: InsertImagePayload) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Insert Image
          </ModalHeader>
          <ModalBody className="pb-2">
            {!mode ? (
              <>
                <Button
                  data-test-id="image-modal-option-url"
                  onPress={() => setMode('url')}
                  variant="faded"
                  className="rounded-md shadow-md"
                >
                  URL
                </Button>
                <Button
                  data-test-id="image-modal-option-file"
                  onPress={() => setMode('file')}
                  variant="faded"
                  className="rounded-md shadow-md"
                >
                  File
                </Button>
              </>
            ) : mode === 'file' ? (
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2 ">
                  <label className="text-sm w-max">Choose Image: </label>
                  <FileInput
                    label="Image Upload"
                    onChange={loadImage}
                    accept="image/*"
                    data-test-id="image-modal-file-upload"
                    className="rounded-md flex-1"
                  />
                </div>
                <div className="flex items-center justify-between w-full gap-2 ">
                  <label className="text-sm w-max">Alt Text: </label>
                  <Input
                    placeholder="e.g. Ilemobade Library, FUTA"
                    onChange={(e) => setAltText(e.target.value)}
                    value={altText}
                    type="text"
                    radius="sm"
                    className="w-[73%]"
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() =>
                handleOnClick({
                  altText,
                  src,
                })
              }
              variant="faded"
            >
              Insert
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AnimatePresence>
  );
}
