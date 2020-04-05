export class ScheduleResponse {
  id: string;

  invoiceId: string;

  rate: number;

  numberOfSpots: number;

  startDate: Date;

  endDate: Date;

  startTime: string;

  endTime: string;

  daysOfWeek: string;
}