import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

export const iconRegisterInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.endsWith('.svg')) {
    try {
      const url = new URL(req.url, 'http://localhost');
      let urlPath = url.pathname;

      const iconsIndex = urlPath.indexOf('/icons/');
      if (iconsIndex !== -1) {
        urlPath = urlPath.substring(iconsIndex);
      }

      const filePath = path.join(process.cwd(), 'public', urlPath);

      const content = fs.readFileSync(filePath, 'utf8');

      return of(new HttpResponse({
        body: content,
        status: 200,
        headers: req.headers.set('Content-Type', 'image/svg+xml')
      }));
    } catch (err) {
      console.error(`[SSG] Failed to load SVG from disk: ${req.url}`, err);
    }
  }

  return next(req);
};
