"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@components/ui/command";
import { cn } from "@web/lib/utils";

interface Props {
  models: string[];
  value: string;
  onChange: (model: string) => void;
}

export default function ModelCombobox({ models, value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-48"
        >
          {value || "Choisir un modèle"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandInput placeholder="Rechercher..." />
          <CommandList>
            <CommandEmpty>Aucun modèle</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model}
                  value={model}
                  onSelect={(current) => {
                    onChange(current);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      model === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {model}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
