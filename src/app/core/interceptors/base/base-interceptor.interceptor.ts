import { HttpInterceptorFn } from '@angular/common/http';

export const baseInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = 'https://reqres.in/api';
  const apiReq = req.clone({ url: `${baseUrl}${req.url}` });
  return next(apiReq);
};
