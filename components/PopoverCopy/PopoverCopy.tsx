import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";

interface Props {
  children: JSX.Element;
  text: string;
}

// for copy address
const PopoverCopy = ({ children, text }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    onOpen();
    setTimeout(onClose, 1000);
  };

  return (
    <span onClick={handleCopy} style={{ cursor: "pointer" }}>
      <Popover isOpen={isOpen}>
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent w="min-content">
          <PopoverArrow />
          <PopoverHeader>Copiado!</PopoverHeader>
        </PopoverContent>
      </Popover>
    </span>
  );
};

export default PopoverCopy;
