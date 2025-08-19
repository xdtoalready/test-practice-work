import { getQueryParam } from './window.utils';
import { periodEnum } from '../pages/Documents/filters/bills.filter.conf';

export const sanitizeDateAndPeriodFilters = (params, sanitizedFilters,defaultPeriod=periodEnum.month) => {
  if (getQueryParam('date_range')) {
    const rangeParams = new URLSearchParams(getQueryParam('date_range'));
    params.from = rangeParams.get('from');
    params.to = rangeParams.get('to');
    delete sanitizedFilters.date_range;
    delete sanitizedFilters.period;
  } else if (sanitizedFilters.period) {
    params.period = sanitizedFilters.period;
    delete sanitizedFilters.period;
    delete sanitizedFilters.date_range;
  } else {
    params.period = getQueryParam('period', defaultPeriod);
    delete sanitizedFilters.date_range;
    delete sanitizedFilters.period;
  }
  if(sanitizedFilters?.date_range_last_comment){
    const rangeParams = new URLSearchParams(getQueryParam('date_range_last_comment'));
    params.date_last_comment_start = rangeParams.get('from_last_comment');
    params.date_last_comment_end = rangeParams.get('to_last_comment');
    delete sanitizedFilters.date_range_last_comment;
    delete sanitizedFilters.period;
  }
  if(sanitizedFilters?.created_at_range){
    const rangeParams = new URLSearchParams(getQueryParam('created_at_range'));
    params.created_at_start = rangeParams.get('created_at_start');
    params.created_at_end = rangeParams.get('created_at_end');
    delete sanitizedFilters.created_at_range;
    delete sanitizedFilters.period;
  }
  if (sanitizedFilters?.is_submit) {
    delete sanitizedFilters.is_submit;
  }
  return [params, sanitizedFilters];
};
