import { convertToMinutes } from './format.time';

export const compareTime = (actualTime, deadlineTime) => {
  const actualTimeInMinutes = convertToMinutes(actualTime);
  const deadlineTimeInMinutes = convertToMinutes(deadlineTime);
  return actualTimeInMinutes > deadlineTimeInMinutes;
};

export const isCurrentPageBetweenLimits = (currPage,min=1,max=1) =>{
  return min <= currPage && currPage <= max;
}
