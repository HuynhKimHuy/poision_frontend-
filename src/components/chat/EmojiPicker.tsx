import { useThemeStore } from "@/stores/useThemeStore";
import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
    onChange: (emoji: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
    const { isDarkMode } = useThemeStore();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5">
                    <Smile className="h-3 w-3" />
                </Button>
            </PopoverTrigger>

            <PopoverContent sizeOffset={40} className="w-full  p-0 border-none">
                <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                    theme={isDarkMode ? 'dark' : 'light'}
                />
            </PopoverContent>
        </Popover>
    )
}

export default EmojiPicker
