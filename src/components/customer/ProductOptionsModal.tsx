import { useState } from 'react';
import { FoodItem, OptionChoice } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface ProductOptionsModalProps {
  item: FoodItem;
  open: boolean;
  onClose: () => void;
  onConfirm: (item: FoodItem, selectedOptions: any, specialInstructions: string) => void;
}

export const ProductOptionsModal = ({
  item,
  open,
  onClose,
  onConfirm,
}: ProductOptionsModalProps) => {
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string | string[] }>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleOptionChange = (optionLabel: string, value: string | string[], allowMultiple?: boolean) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionLabel]: value,
    }));
  };

  const handleConfirm = () => {
    onConfirm(item, selectedOptions, specialInstructions);
    setSelectedOptions({});
    setSpecialInstructions('');
  };

  const calculateTotal = () => {
    let total = item.price;
    item.options?.forEach((option) => {
      if (option.allowMultiple && Array.isArray(selectedOptions[option.label])) {
        (selectedOptions[option.label] as string[]).forEach((selected) => {
          const choice = option.choices?.find((c) => c.name === selected);
          if (choice) total += choice.price;
        });
      } else if (selectedOptions[option.label]) {
        const choice = option.choices?.find((c) => c.name === selectedOptions[option.label]);
        if (choice) total += choice.price;
      }
    });
    return total;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {item.options?.map((option) => (
            <div key={option.label} className="space-y-2">
              <Label className="text-base font-semibold">{option.label}</Label>
              {option.allowMultiple ? (
                <div className="space-y-2">
                  {option.choices?.map((choice) => (
                    <div key={choice.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${option.label}-${choice.name}`}
                        checked={(selectedOptions[option.label] as string[] || []).includes(
                          choice.name
                        )}
                        onCheckedChange={(checked) => {
                          const current = (selectedOptions[option.label] as string[]) || [];
                          const updated = checked
                            ? [...current, choice.name]
                            : current.filter((c) => c !== choice.name);
                          handleOptionChange(option.label, updated, true);
                        }}
                      />
                      <Label
                        htmlFor={`${option.label}-${choice.name}`}
                        className="flex-1 cursor-pointer"
                      >
                        {choice.name} {choice.price > 0 && `(+₹${choice.price})`}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <RadioGroup
                  value={selectedOptions[option.label] as string}
                  onValueChange={(value) => handleOptionChange(option.label, value)}
                >
                  {option.choices?.map((choice) => (
                    <div key={choice.name} className="flex items-center space-x-2">
                      <RadioGroupItem value={choice.name} id={`${option.label}-${choice.name}`} />
                      <Label
                        htmlFor={`${option.label}-${choice.name}`}
                        className="flex-1 cursor-pointer"
                      >
                        {choice.name} {choice.price > 0 && `(+₹${choice.price})`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          ))}
          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              placeholder="Any special requests?"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex-1 text-lg font-bold">Total: ₹{calculateTotal()}</div>
          <Button onClick={handleConfirm} className="w-full sm:w-auto">
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
