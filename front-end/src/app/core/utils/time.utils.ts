import * as moment from 'moment';

export const CHANGE_DATE_HOUR = 4;

export const dayBegin = (
  date: Date | moment.Moment = moment(),
  changeDateHour: number = CHANGE_DATE_HOUR
): moment.Moment => {
  const dt = moment(date);
  return dt.hours() >= changeDateHour
    ? dt.set('hour', changeDateHour)
    : dt.set('hour', -24 + changeDateHour);
};

export const dayEnd = (
  date: Date | moment.Moment = moment(),
  changeDateHour: number = CHANGE_DATE_HOUR
): moment.Moment => {
  const dt = moment(date);
  return dt.hours() >= changeDateHour
    ? dt.set('hour', 24 + changeDateHour)
    : dt.set('hour', changeDateHour);
};
