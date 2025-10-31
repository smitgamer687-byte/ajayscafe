import { Category } from '@/types';
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: Category[];
  selected: Category;
  onSelect: (category: Category) => void;
}

export const CategoryFilter = ({ categories, selected, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? 'default' : 'outline'}
          onClick={() => onSelect(category)}
          className="whitespace-nowrap rounded-full"
          size="sm"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};
