import apiErrors from '../../constants/apiErrors';

const buyValidator = (req, res, next): void => {
  const { fecha, cantidad }: { fecha: Date, cantidad: number } = req.body;

  // if bought qty is equal or less to 0 -> error
  if (cantidad <= 0)
    return res.status(406).json({ ok: false, msg: apiErrors.QUANTITY_ERROR });
  // if buy date is in the future -> error
  if (new Date() < fecha)
    return res.status(406).json({ ok: false, msg: apiErrors.FUTURE_ERROR });
  if (cantidad > 30)
    return res.status(406).json({ ok: false, msg: apiErrors.EXCEED_ERROR });

  next();
}

export default buyValidator;