
import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DatePickerHTML: React.FC<{
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
}> = ({ selected, onSelect, label = "Select Date", placeholder = "No date selected" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Generate dates for current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleCalendar = () => {
    setIsOpen(!isOpen);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleSelectDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onSelect(date);
    setIsOpen(false);
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === selected.toDateString();
  };

  const isToday = (day: number) => {
    const today = new Date();
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === today.toDateString();
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelectedDay = isSelected(day);
      const isTodayDay = isToday(day);
      
      days.push(
        <div
          key={`day-${day}`}
          className={`h-9 w-9 flex items-center justify-center rounded-md cursor-pointer
            ${isSelectedDay ? 'bg-primary text-white' : ''}
            ${isTodayDay && !isSelectedDay ? 'bg-accent text-accent-foreground' : ''}
            ${!isSelectedDay && !isTodayDay ? 'hover:bg-accent hover:text-accent-foreground' : ''}
          `}
          onClick={() => handleSelectDate(day)}
          onMouseEnter={() => setHoveredDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // Convert to HTML representation
  const generateHTMLJavaScript = () => {
    const htmlCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Date Picker</title>
  <style>
    /* Reset and base styles */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    body {
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f9fafb;
    }
    /* Date picker container */
    .date-picker {
      position: relative;
      width: 280px;
    }
    /* Button */
    .date-picker-button {
      width: 100%;
      padding: 10px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background-color: white;
      cursor: pointer;
      font-size: 14px;
      color: #374151;
      transition: all 0.2s;
      text-align: left;
    }
    .date-picker-button:hover {
      border-color: #9ca3af;
    }
    .date-picker-button:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
    .date-picker-button span {
      color: #6b7280;
    }
    /* Calendar popup */
    .calendar-popup {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      width: 280px;
      background-color: white;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      padding: 12px;
      z-index: 50;
      display: none;
    }
    .calendar-popup.open {
      display: block;
    }
    /* Calendar header */
    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .month-title {
      font-size: 14px;
      font-weight: 500;
    }
    .nav-button {
      background: none;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .nav-button:hover {
      background-color: #f3f4f6;
    }
    /* Weekdays */
    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      margin-bottom: 8px;
    }
    .weekday {
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #6b7280;
    }
    /* Days grid */
    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
    }
    .day {
      height: 36px;
      width: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }
    .day:hover {
      background-color: #f3f4f6;
    }
    .day.selected {
      background-color: #6366f1;
      color: white;
    }
    .day.today {
      background-color: #e5e7eb;
      font-weight: 500;
    }
    .day.empty {
      cursor: default;
    }
  </style>
</head>
<body>
  <div class="date-picker">
    <button class="date-picker-button" id="dateTrigger">
      <span id="dateValue">Select a date</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    </button>
    
    <div class="calendar-popup" id="calendarPopup">
      <div class="calendar-header">
        <button class="nav-button" id="prevMonth">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="month-title" id="monthTitle">April 2025</div>
        <button class="nav-button" id="nextMonth">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      
      <div class="weekdays">
        <div class="weekday">Su</div>
        <div class="weekday">Mo</div>
        <div class="weekday">Tu</div>
        <div class="weekday">We</div>
        <div class="weekday">Th</div>
        <div class="weekday">Fr</div>
        <div class="weekday">Sa</div>
      </div>
      
      <div class="days-grid" id="daysGrid">
        <!-- Days will be generated by JavaScript -->
      </div>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // DOM elements
      const dateTrigger = document.getElementById('dateTrigger');
      const dateValue = document.getElementById('dateValue');
      const calendarPopup = document.getElementById('calendarPopup');
      const prevMonthBtn = document.getElementById('prevMonth');
      const nextMonthBtn = document.getElementById('nextMonth');
      const monthTitle = document.getElementById('monthTitle');
      const daysGrid = document.getElementById('daysGrid');
      
      // State
      let currentMonth = new Date();
      let selectedDate = null;
      
      // Event listeners
      dateTrigger.addEventListener('click', toggleCalendar);
      prevMonthBtn.addEventListener('click', goToPrevMonth);
      nextMonthBtn.addEventListener('click', goToNextMonth);
      
      document.addEventListener('click', function(event) {
        if (!calendarPopup.contains(event.target) && event.target !== dateTrigger) {
          calendarPopup.classList.remove('open');
        }
      });
      
      // Initialize calendar
      renderCalendar();
      
      function toggleCalendar() {
        calendarPopup.classList.toggle('open');
      }
      
      function goToPrevMonth() {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
        renderCalendar();
      }
      
      function goToNextMonth() {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
        renderCalendar();
      }
      
      function renderCalendar() {
        // Update month title
        monthTitle.textContent = formatMonthTitle(currentMonth);
        
        // Clear previous days
        daysGrid.innerHTML = '';
        
        // Get first day of month and number of days
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
          const emptyDay = document.createElement('div');
          emptyDay.className = 'day empty';
          daysGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
          const dayElement = document.createElement('div');
          dayElement.className = 'day';
          dayElement.textContent = day;
          
          // Check if this day is selected
          if (selectedDate && 
              selectedDate.getDate() === day && 
              selectedDate.getMonth() === currentMonth.getMonth() &&
              selectedDate.getFullYear() === currentMonth.getFullYear()) {
            dayElement.classList.add('selected');
          }
          
          // Check if this day is today
          const today = new Date();
          if (today.getDate() === day && 
              today.getMonth() === currentMonth.getMonth() &&
              today.getFullYear() === currentMonth.getFullYear()) {
            dayElement.classList.add('today');
          }
          
          // Add click event
          dayElement.addEventListener('click', () => selectDate(day));
          
          daysGrid.appendChild(dayElement);
        }
      }
      
      function selectDate(day) {
        selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        dateValue.textContent = formatDate(selectedDate);
        calendarPopup.classList.remove('open');
        renderCalendar(); // Re-render to update selected date
      }
      
      function formatDate(date) {
        if (!date) return 'Select a date';
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      }
      
      function formatMonthTitle(date) {
        const options = { month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      }
    });
  </script>
</body>
</html>
`;
    
    return htmlCode;
  };

  return (
    <div className="date-picker-container space-y-2">
      {label && <div className="text-sm font-medium">{label}</div>}
      <div className="relative">
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          onClick={toggleCalendar}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : placeholder}
        </Button>
        
        {isOpen && (
          <div 
            ref={calendarRef}
            className="absolute top-full z-50 mt-1 rounded-md border border-gray-200 bg-white p-3 shadow-md"
          >
            <div className="flex justify-between items-center mb-2">
              <button 
                className="p-1 rounded-md hover:bg-gray-100" 
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-sm font-medium">
                {format(currentMonth, "MMMM yyyy")}
              </div>
              <button 
                className="p-1 rounded-md hover:bg-gray-100" 
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="h-9 w-9 flex items-center justify-center text-xs text-gray-500">
                  {day}
                </div>
              ))}
              {renderCalendarDays()}
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              <details>
                <summary className="cursor-pointer">Show HTML/CSS/JS code</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                  {generateHTMLJavaScript()}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePickerHTML;
