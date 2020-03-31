const formatDate = (date: Date, format: string): string => {
  format = format.replace(/YYYY/, date.getFullYear().toString());
  format = format.replace(/MM/, (date.getMonth() + 1).toString());
  format = format.replace(/DD/, date.getDate().toString());
  format = format.replace(/HH/, ('0' + date.getHours().toString()).slice(-2));
  format = format.replace(/NN/, ('0' + date.getMinutes().toString()).slice(-2));

  return format;
};

export const timeExpress = (time: Date): string => {
  const format = 'YYYY-MM-DD HH:NN';
  const ex = formatDate(time, format);

  return ex;
};
