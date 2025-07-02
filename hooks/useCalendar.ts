import {
	add,
	endOfMonth,
	endOfWeek,
	isBefore,
	isSameDay,
	isWithinInterval,
	startOfMonth,
	startOfWeek,
	sub,
} from 'date-fns'
import { useEffect, useState } from 'react'

export type CalendarMode = 'single' | 'range';

export type SingleDateValue = Date | undefined | null;
export type RangeDateValue = {
  startDate: Date  | null;
  endDate: Date | null;
};

// Tipo genérico para o valor do DatePicker/Calendar
// Isso permite que o `value` e `onChange` se adaptem ao `mode`
export type DatePickerValue<TMode extends CalendarMode> = TMode extends 'single'
  ? SingleDateValue
  : RangeDateValue;

export interface UseCalendarProps<TMode extends CalendarMode> {
  value: DatePickerValue<TMode>;
  onChange: (newValue: DatePickerValue<TMode>) => void;
  mode: TMode; // A nova prop 'mode'
}

export interface UseCalendarReturn<TMode extends CalendarMode> {
  currentDate: Date;
  nextMonth: () => void;
  prevMonth: () => void;
  dates: Date[];
  // As datas selecionadas dependerão do modo
  selectedSingleDate: SingleDateValue;
  selectedRangeDates: RangeDateValue;
  handleSelectDate: (date: Date) => void;
  isWithinSelectedRange: (date: Date) => boolean;
}

const useCalendar = <TMode extends CalendarMode>({
  value,
  onChange,
  mode,
}: UseCalendarProps<TMode>): UseCalendarReturn<TMode> => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Estados internos para single e range.
  // Será usado o estado relevante com base no `mode`
  const [selectedSingleDate, setSelectedSingleDate] = useState<SingleDateValue>(
    mode === 'single' ? (value as SingleDateValue) : undefined
  );
  const [selectedRangeDates, setSelectedRangeDates] = useState<RangeDateValue>(
    mode === 'range' ? (value as RangeDateValue) : { startDate: null, endDate: null }
  );

  // Sincroniza o estado interno com o valor externo (`value` prop)
  useEffect(() => {
    if (mode === 'single') {
      setSelectedSingleDate(value as SingleDateValue);
    } else { // mode === 'range'
      setSelectedRangeDates(value as RangeDateValue);
    }
  }, [value, mode]);

  const nextMonth = () => setCurrentDate(add(currentDate, { months: 1 }));
  const prevMonth = () => setCurrentDate(sub(currentDate, { months: 1 }));

  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);

  const startDateOfMonthDisplay = startOfWeek(startOfCurrentMonth, {
    weekStartsOn: 0, // Domingo
  });
  const endDateOfMonthDisplay = endOfWeek(endOfCurrentMonth, { weekStartsOn: 0 }); // Domingo

  const dates: Date[] = [];
  let day = startDateOfMonthDisplay;

  while (day <= endDateOfMonthDisplay) {
    dates.push(day);
    day = add(day, { days: 1 });
  }

  const handleSelectDate = (date: Date) => {
    if (mode === 'range') {
      let { startDate, endDate } = selectedRangeDates;

      if (!startDate || (startDate && endDate && isSameDay(startDate, endDate))) {
        // Inicia um novo range ou reinicia se o range estiver completo ou for um único dia
        startDate = date;
        endDate = null; // Limpa endDate para permitir seleção do segundo ponto
      } else if (startDate && !endDate) {
        // Seleciona o endDate
        if (isBefore(date, startDate)) {
          // Se a nova data é antes do startDate, inverte
          endDate = startDate;
          startDate = date;
        } else {
          endDate = date;
        }
      } else if (startDate && endDate) {
        // Se já tem um range completo, começa um novo range
        startDate = date;
        endDate = null;
      }

      const newRange = { startDate, endDate };
      setSelectedRangeDates(newRange);
      onChange(newRange as DatePickerValue<TMode>); // Notifica o componente pai
    } else { // mode === 'single'
      const newSingleDate = isSameDay(selectedSingleDate || new Date(), date) ? undefined : date; // Alterna seleção
      setSelectedSingleDate(newSingleDate);
      onChange(newSingleDate as DatePickerValue<TMode>); // Notifica o componente pai
    }
  };

  const isWithinSelectedRange = (date: Date) => {
    const { startDate, endDate } = selectedRangeDates;
    return startDate && endDate
      ? isWithinInterval(date, { start: startDate, end: endDate })
      : false;
  };

  return {
    currentDate,
    nextMonth,
    prevMonth,
    dates,
    selectedSingleDate,
    selectedRangeDates,
    handleSelectDate,
    isWithinSelectedRange,
  };
};

export { useCalendar };
