import express, { Request, Response, NextFunction } from "express";
import { ExchangeRateService } from "./exchangeRateService";
import Joi from "joi";

const app = express();

const port = process.env.PORT || 3006;

const validator = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    loanAmount: Joi.number().optional(),
    targetCurrencyCode: Joi.string().uppercase().optional(),
    baseCurrencyCode: Joi.string().uppercase().optional(),
    monthlyInterestRate: Joi.number().optional(),
    tenure: Joi.number().optional(),
  });

  const { error } = schema.validate(req.query, {
    allowUnknown: false,
    abortEarly: true,
  });

  if (error) {
    return res
      .status(400)
      .json({ message: error.details[0].message.replace(/['"]/g, "") });
  }

  return next();
};

app.get("/loan-repayment", validator, async (req: Request, res: Response) => {
  try {
    const loanAmount = Number(req.query.loanAmount) || 100;
    const targetCurrencyCode = req.query.targetCurrencyCode || "NGN";
    const baseCurrencyCode = req.query.baseCurrencyCode || "USD";
    const monthlyInterestRate = Number(req.query.monthlyInterestRate) || 0.02; // default is 2%
    const tenure = Number(req.query.tenure) || 10; // This is in months

    const exRate = new ExchangeRateService();

    const liveRate = await exRate.getLiveRates(
      baseCurrencyCode as string,
      targetCurrencyCode as string
    );

    const conversionRate = liveRate.conversion_rate;

    const targetCurrencyValue = loanAmount * conversionRate;

    // Using Amortized Loan Payment Formula
    const monthlyPayment =
      (monthlyInterestRate * targetCurrencyValue) /
      (1 - Math.pow(1 + monthlyInterestRate, -tenure));
    const oneTimeLoanRepaymentValue = monthlyPayment * tenure;

    res.status(200).json({
      message: "successful",
      data: oneTimeLoanRepaymentValue,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

app.get("/", (_req, res) => {
  res.status(404);
  res.send("");
});

app.listen(port, () => {
  console.log(`app is running on ${port}`);
});

export default app;
