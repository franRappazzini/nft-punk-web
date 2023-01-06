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
  removeError: () => void;
}

// dialog error (wallet disconnected, incorrect network, etc.)
const Error = ({ error: { error, message, btn }, onClick, removeError }: Props) => {
  const cancelRef = useRef(null);

  return (
    <AlertDialog isOpen={error} leastDestructiveRef={cancelRef} onClose={removeError} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Error
          </AlertDialogHeader>

          <AlertDialogBody>{message}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={removeError} variant="ghost">
              Cancelar
            </Button>
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
