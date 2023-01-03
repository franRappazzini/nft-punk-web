import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

import { IError } from "../../utils/interfaces";
import { useRef } from "react";

interface Props {
  error: IError;
  onClick: () => void;
}

const Error = ({ error: { error, message, btn }, onClick }: Props) => {
  const cancelRef = useRef(null);
  const onClose = () => {};

  return (
    <AlertDialog isOpen={error} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Error
          </AlertDialogHeader>

          <AlertDialogBody>{message}</AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onClick} ml={3} colorScheme="green" variant="outline">
              {btn}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default Error;
