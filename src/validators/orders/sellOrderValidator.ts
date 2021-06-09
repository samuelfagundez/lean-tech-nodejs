import apiErrors from '../../constants/apiErrors'

const sellValidator = (req, res, next) => {
  const { fecha, cantidad }: { fecha: Date; cantidad: number } = req.body;

  // if sell qty is equal or less to 0 -> error
  if (cantidad <= 0)
    return res.status(406).json({ ok: false, msg: apiErrors.QUANTITY_ERROR });
  // if sell date is in the future -> error
  if (new Date() < fecha)
    return res.status(406).json({ ok: false, msg: apiErrors.FUTURE_ERROR });

  next();
};

export default sellValidator;