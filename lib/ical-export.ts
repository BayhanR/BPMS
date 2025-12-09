export function generateICal(tasks: Array<{
  title: string;
  description?: string;
  dueDate?: string;
  startTime?: string;
  endTime?: string;
}>) {
  let ical = "BEGIN:VCALENDAR\n";
  ical += "VERSION:2.0\n";
  ical += "PRODID:-//BPMS//Calendar Export//EN\n";
  ical += "CALSCALE:GREGORIAN\n";
  ical += "METHOD:PUBLISH\n";

  tasks.forEach((task, index) => {
    if (!task.dueDate) return;

    const start = task.startTime ? new Date(task.startTime) : new Date(task.dueDate);
    const end = task.endTime ? new Date(task.endTime) : new Date(start.getTime() + 3600000); // Default 1 hour

    ical += "BEGIN:VEVENT\n";
    ical += `UID:task-${index}-${Date.now()}@bpms\n`;
    ical += `DTSTART:${formatICalDate(start)}\n`;
    ical += `DTEND:${formatICalDate(end)}\n`;
    ical += `SUMMARY:${escapeICalText(task.title)}\n`;
    if (task.description) {
      ical += `DESCRIPTION:${escapeICalText(task.description)}\n`;
    }
    ical += `DTSTAMP:${formatICalDate(new Date())}\n`;
    ical += "END:VEVENT\n";
  });

  ical += "END:VCALENDAR\n";
  return ical;
}

function formatICalDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

