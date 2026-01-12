import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'

type DatePickerProps = {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  startMonth?: Date
  endMonth?: Date
}

export function DatePicker({
  selected,
  onSelect,
  placeholder = 'Pick a date',
  startMonth,
  endMonth,
}: DatePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='gray'
          data-empty={!selected}
          className='data-[empty=true]:text-muted-foreground justify-start text-start font-normal w-full'
        >
          {selected ? (
            format(selected, 'MMM d, yyyy')
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className='ms-auto h-4 w-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          onDayClick={() => setIsPopoverOpen(false)}
          mode='single'
          captionLayout='dropdown'
          selected={selected}
          fromYear={startMonth?.getFullYear() ?? 1960}
          toYear={endMonth?.getFullYear() ?? 2030}
          defaultMonth={new Date()}
          onSelect={onSelect}
          disabled={(date: Date) => {
            if (startMonth && date < startMonth) return true
            if (endMonth && date > endMonth) return true
            return false
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
