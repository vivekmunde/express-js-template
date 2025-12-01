import { NextFunction, Request, Response } from 'express';

const i18nMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lng } = req.params;

    await req.i18n.changeLanguage(lng);
    req.language = lng;

    next();
  } catch (error) {
    next(error);
  }
};

export { i18nMiddleware };
